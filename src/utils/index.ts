// Production-only barrel. Test helpers live in `src/utils/testing` and must be
// imported from there directly: re-exporting them here pulled
// @testing-library/react and next-router-mock into the server bundle, which
// duplicated next/router's RouterContext and broke static prerendering.
export * from "./fetchJson";
