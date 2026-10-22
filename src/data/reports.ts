/**
 * Published reports and accounts.
 *
 * Adding next year's is one entry here plus the file in public/reports —
 * nothing else needs touching. Newest first; the page does not sort, so keep
 * them in the order they should be read.
 *
 * `size` is written out rather than measured, because the site is exported to
 * static HTML and there is no server at the other end to ask how big a file
 * is. Check it when you add one: it is the only thing here that can quietly
 * stop being true.
 */
export type Report = {
  title: string;
  /** What it covers, in words a donor would use. */
  period: string;
  summary: string;
  /** Who prepared or audited it, where that is the point of the document. */
  preparedBy?: string;
  href: string;
  pages: number;
  size: string;
  kind: "Audited accounts" | "Annual report" | "Policy";
};

export const reports: Report[] = [
  {
    title: "Audited Financial Statements 2026",
    period: "Year ended 30 June 2026",
    summary:
      "Our accounts for the first operating year, independently audited: the statement of financial position, income and expenditure, and the notes behind both.",
    preparedBy: "Ishfaq & Tayyaba, Chartered Accountants",
    href: "/reports/hunarsaaz-audited-financial-statements-2026.pdf",
    pages: 8,
    size: "1.1 MB",
    kind: "Audited accounts",
  },
];
