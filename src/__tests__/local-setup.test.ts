import fs from "fs";
import path from "path";

const readProjectFile = (name: string): string =>
  fs.readFileSync(path.join(process.cwd(), name), "utf8");

describe("local development setup", () => {
  it("uses the documented application port for browser tests", () => {
    const config = readProjectFile("playwright.config.ts");

    expect(config).toContain('baseURL: "http://localhost:3200"');
    expect(config).toContain('command: "yarn dev"');
    expect(config).toContain('url: "http://localhost:3200"');
  });

  it("captures failures without depending on disabled retries", () => {
    expect(readProjectFile("playwright.config.ts")).toContain(
      'trace: "retain-on-failure"',
    );
  });

  it("keeps TypeScript configuration in tsconfig rather than package metadata", () => {
    const manifest: Record<string, unknown> = JSON.parse(
      readProjectFile("package.json"),
    );

    expect(manifest).not.toHaveProperty("compilerOptions");
  });

  it("ignores local environment files and logs without duplicate output entries", () => {
    const patterns = readProjectFile(".gitignore").split(/\r?\n/);

    expect(patterns).toContain(".env.local");
    expect(patterns).toContain("*.log");
    expect(
      patterns.filter((pattern) => pattern === "test-results/"),
    ).toHaveLength(1);
  });
});
