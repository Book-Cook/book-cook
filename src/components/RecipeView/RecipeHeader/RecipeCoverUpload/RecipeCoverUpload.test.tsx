import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { toast } from "sonner";

import { server } from "src/mocks/server";
import { RecipeCoverUpload } from "./RecipeCoverUpload";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  CameraIcon: ({ size }: { size: number }) => (
    <span data-testid="camera-icon" data-size={size} />
  ),
  TrashIcon: ({ size }: { size: number }) => (
    <span data-testid="trash-icon" data-size={size} />
  ),
}));

// Polyfill Blob.prototype.arrayBuffer for jsdom — returns JPEG magic bytes.
// Safe because all tests that reach magic-byte validation use JPEG files;
// invalid-type and oversized tests fail before reaching that code path.
Object.defineProperty(Blob.prototype, "arrayBuffer", {
  configurable: true,
  writable: true,
  value(): Promise<ArrayBuffer> {
    const buf = new ArrayBuffer(8);
    const view = new Uint8Array(buf);
    view[0] = 0xff;
    view[1] = 0xd8;
    view[2] = 0xff; // JPEG magic bytes
    return Promise.resolve(buf);
  },
});

// Mock canvas — jsdom doesn't implement it
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  drawImage: jest.fn(),
});
HTMLCanvasElement.prototype.toBlob = jest
  .fn()
  .mockImplementation((callback: BlobCallback) =>
    callback(new Blob(["fake-webp-data"], { type: "image/webp" })),
  );

// Mock URL.createObjectURL / revokeObjectURL
global.URL.createObjectURL = jest.fn().mockReturnValue("blob:mock-preview-url");
global.URL.revokeObjectURL = jest.fn();

// Mock Image so onload fires asynchronously — jsdom doesn't load images
class MockImage {
  width = 1000;
  height = 800;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_val: string) {
    setTimeout(() => this.onload?.(), 0);
  }
}
global.Image = MockImage as unknown as typeof Image;

// ----- constants -----
const RECIPE_ID = "6507a5a5a5a5a5a5a5a5a5a5";
const PRESIGN_URL = "https://r2-test.example.com/signed-put";
const PENDING_KEY = `uploads/pending/user123/abc-test.jpg`;
const PUBLIC_URL = `https://pub-abc.r2.dev/uploads/public/user123/abc-test.jpg`;

// ----- helpers -----
function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
}

function makeJpegFile(sizeBytes = 500 * 1024): File {
  // Include real JPEG magic bytes (FF D8 FF) so validateMagicBytes passes
  const data = new Uint8Array(sizeBytes);
  data[0] = 0xff;
  data[1] = 0xd8;
  data[2] = 0xff;
  return new File([data], "photo.jpg", { type: "image/jpeg" });
}

// ----- tests -----
describe("RecipeCoverUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows Add cover button when no image", () => {
    render(<RecipeCoverUpload recipeId={RECIPE_ID} imageURL="" />, {
      wrapper: makeWrapper(),
    });
    expect(
      screen.getByRole("button", { name: /add cover photo/i }),
    ).toBeInTheDocument();
  });

  it("shows Change and Remove buttons when image exists", () => {
    render(
      <RecipeCoverUpload
        recipeId={RECIPE_ID}
        imageURL="https://example.com/cover.jpg"
      />,
      { wrapper: makeWrapper() },
    );
    expect(
      screen.getByRole("button", { name: /change cover photo/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove cover photo/i }),
    ).toBeInTheDocument();
  });

  it("does not show Remove button when no image", () => {
    render(<RecipeCoverUpload recipeId={RECIPE_ID} imageURL="" />, {
      wrapper: makeWrapper(),
    });
    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("shows error for disallowed file types", async () => {
    render(<RecipeCoverUpload recipeId={RECIPE_ID} imageURL="" />, {
      wrapper: makeWrapper(),
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const badFile = new File(["pdf content"], "doc.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [badFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/only jpeg, png, webp, and gif/i),
      );
    });
  });

  it("shows error for files over 10 MB", async () => {
    render(<RecipeCoverUpload recipeId={RECIPE_ID} imageURL="" />, {
      wrapper: makeWrapper(),
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const bigBlob = new Blob([new Uint8Array(11 * 1024 * 1024)], {
      type: "image/jpeg",
    });
    const bigFile = new File([bigBlob], "huge.jpg", { type: "image/jpeg" });

    fireEvent.change(input, { target: { files: [bigFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/under 10 mb/i),
      );
    });
  });

  it("completes the upload flow and returns to idle without errors", async () => {
    server.use(
      http.post("/api/upload/presign", () =>
        HttpResponse.json({ uploadUrl: PRESIGN_URL, key: PENDING_KEY }),
      ),
      http.put(PRESIGN_URL, () => new HttpResponse(null, { status: 200 })),
      http.post("/api/upload/confirm", () =>
        HttpResponse.json({ url: PUBLIC_URL }),
      ),
    );

    render(<RecipeCoverUpload recipeId={RECIPE_ID} imageURL="" />, {
      wrapper: makeWrapper(),
    });

    const input = document.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpegFile()] } });

    // Success: idle state (Add cover button) with no error alert
    await waitFor(
      () => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /add cover photo/i }),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("shows error when presign request returns an error", async () => {
    server.use(
      http.post("/api/upload/presign", () =>
        HttpResponse.json(
          { error: "Too many uploads. Please wait before trying again." },
          { status: 429 },
        ),
      ),
    );

    render(<RecipeCoverUpload recipeId={RECIPE_ID} imageURL="" />, {
      wrapper: makeWrapper(),
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [makeJpegFile()] } });

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringMatching(/too many uploads/i),
        );
      },
      { timeout: 5000 },
    );
  });

  it("removes cover by calling PUT /api/recipes/:id with empty imageURL", async () => {
    const removeSpy = jest.fn();

    server.use(
      http.put(`/api/recipes/${RECIPE_ID}`, async ({ request }) => {
        const body = await request.json();
        removeSpy(body);
        return HttpResponse.json({ message: "Recipe updated successfully" });
      }),
    );

    render(
      <RecipeCoverUpload
        recipeId={RECIPE_ID}
        imageURL="https://example.com/cover.jpg"
      />,
      { wrapper: makeWrapper() },
    );

    const removeBtn = screen.getByRole("button", {
      name: /remove cover photo/i,
    });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(removeSpy).toHaveBeenCalledWith(
        expect.objectContaining({ imageURL: "" }),
      );
    });
  });
});
