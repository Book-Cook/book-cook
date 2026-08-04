import fs from "fs";
import path from "path";

/**
 * Regression guard: Next.js Pages Router turns every file under src/pages into
 * a live route, so a test file placed there ships as a publicly routable page
 * or API endpoint (see PR #290). This walks src/pages and fails if any test
 * file or __tests__ directory is found.
 */
const PAGES_DIR = path.join(process.cwd(), "src", "pages");

const TEST_FILE_PATTERN = /\.test\.tsx?$/;

const HINT =
  "Every file under src/pages becomes a live Next.js route, so these ship as " +
  "publicly routable endpoints. Move API-route specs to src/__tests__/api/** " +
  "and component specs beside their subject outside src/pages.";

const collectTestArtifacts = (dir: string): string[] => {
  const offenders: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        offenders.push(entryPath);
        continue;
      }
      offenders.push(...collectTestArtifacts(entryPath));
      continue;
    }

    if (TEST_FILE_PATTERN.test(entry.name)) {
      offenders.push(entryPath);
    }
  }

  return offenders;
};

describe("repository structure", () => {
  it("has no test files or __tests__ directories under src/pages", () => {
    const offenders = collectTestArtifacts(PAGES_DIR).map((offender) =>
      path.relative(process.cwd(), offender).split(path.sep).join("/")
    );

    expect({ offenders, hint: HINT }).toEqual({ offenders: [], hint: HINT });
  });
});
