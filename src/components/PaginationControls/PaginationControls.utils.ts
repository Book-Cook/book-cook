/**
 * Generates array of page numbers to display with ellipsis
 * for large page ranges
 */
export const getVisiblePageNumbers = (
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | string)[] => {
  const range = [];
  const rangeWithDots = [];

  // Generate the range of pages to show around current page
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  // Add first page and ellipsis if needed
  if (currentPage - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  // Add the range of pages
  rangeWithDots.push(...range);

  // Add ellipsis and last page if needed
  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages);
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
};