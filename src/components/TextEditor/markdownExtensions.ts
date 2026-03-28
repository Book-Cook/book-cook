/**
 * Custom Lexical markdown transformers for horizontal rules and tables.
 * @lexical/markdown v0.40 does not ship TABLE or HR transformers, so we provide them here.
 */
import type { ElementNode, LexicalNode } from "lexical";
import { $createParagraphNode, $createTextNode, $isElementNode } from "lexical";
import type { MultilineElementTransformer, ElementTransformer } from "@lexical/markdown";
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from "@lexical/table";
import {
  $createHorizontalRuleNode,
  HorizontalRuleNode,
} from "@lexical/react/LexicalHorizontalRuleNode";
import { $isHorizontalRuleNode } from "@lexical/extension";

// ── Horizontal Rule ──────────────────────────────────────────────────────────

export const HR_TRANSFORMER: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node: LexicalNode) => {
    return $isHorizontalRuleNode(node) ? "---" : null;
  },
  regExp: /^(---|\*\*\*|___)\s*$/,
  replace: (parentNode: ElementNode) => {
    parentNode.replace($createHorizontalRuleNode());
  },
  type: "element",
};

// ── Markdown Table ───────────────────────────────────────────────────────────

function parseCells(line: string): string[] {
  return line.split("|").slice(1, -1).map((c) => c.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((c) => /^[\s\-:]+$/.test(c));
}

export const TABLE_TRANSFORMER: MultilineElementTransformer = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  type: "multiline-element",
  regExpStart: /^\|.+\|/,

  // handleImportAfterStartMatch gives us full control: collect all consecutive
  // pipe-delimited lines, build the table node, and return the end index.
  handleImportAfterStartMatch: ({ lines, rootNode, startLineIndex }) => {
    // Collect all consecutive |…| lines starting from startLineIndex
    const tableLines: string[] = [];
    let i = startLineIndex;
    while (i < lines.length && /^\|/.test(lines[i])) {
      tableLines.push(lines[i]);
      i++;
    }

    if (tableLines.length < 2) return null; // not a valid table

    const tableNode = $createTableNode();

    tableLines.forEach((line, rowIndex) => {
      const cells = parseCells(line);
      if (isSeparatorRow(cells)) return; // skip the `| --- | --- |` row

      const isHeader = rowIndex === 0;
      const rowNode = $createTableRowNode();

      cells.forEach((cellText) => {
        const headerState = isHeader
          ? TableCellHeaderStates.ROW
          : TableCellHeaderStates.NO_STATUS;
        const cellNode = $createTableCellNode(headerState);
        const para = $createParagraphNode();
        para.append($createTextNode(cellText));
        cellNode.append(para);
        rowNode.append(cellNode);
      });

      tableNode.append(rowNode);
    });

    rootNode.append(tableNode);
    return [true, i - 1];
  },

  // export converts a TableNode back to markdown
  export: (node: LexicalNode) => {
    if (!$isTableNode(node)) return null;

    const rows = node.getChildren().filter($isTableRowNode) as TableRowNode[];
    if (rows.length === 0) return null;

    const markdownRows = rows.map((row) => {
      const cells = row.getChildren().filter($isTableCellNode) as TableCellNode[];
      const cellTexts = cells.map((cell) => {
        if ($isElementNode(cell)) {
          return cell.getTextContent().trim().replace(/\|/g, "\\|");
        }
        return "";
      });
      return `| ${cellTexts.join(" | ")} |`;
    });

    // Insert separator after header row
    const headerCells = (
      rows[0].getChildren().filter($isTableCellNode) as TableCellNode[]
    ).length;
    const separator = `| ${Array(headerCells).fill("---").join(" | ")} |`;
    markdownRows.splice(1, 0, separator);

    return markdownRows.join("\n");
  },

  // replace is not called when handleImportAfterStartMatch is provided and returns a result
  replace: () => false,
};
