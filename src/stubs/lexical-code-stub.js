// Stub to prevent PrismJS from being bundled via @lexical/code.
// The app uses @lexical/markdown for markdown import/export but does not
// render syntax-highlighted code blocks, so the full @lexical/code package
// (which pulls in all of PrismJS) is not needed.

export const CodeNode = null;
export const CodeHighlightNode = null;
export const $createCodeNode = () => null;
export const $isCodeNode = () => false;
export const $createCodeHighlightNode = () => null;
export const $isCodeHighlightNode = () => false;
export const getCodeLanguages = () => [];
export const getDefaultCodeLanguage = () => "";
