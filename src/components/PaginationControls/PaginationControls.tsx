import * as React from 'react';
import { Button, tokens } from '@fluentui/react-components';
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-icons';

import { useStyles } from './PaginationControls.styles';
import type { PaginationControlsProps } from './PaginationControls.types';
import { getVisiblePageNumbers } from './PaginationControls.utils';

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const styles = useStyles();

  if (totalPages <= 1) {
    return null;
  }

  const visiblePageNumbers = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <div className={styles.container}>
      <Button
        appearance="subtle"
        className={styles.navButton}
        icon={<ChevronLeft24Regular />}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        title="Previous page"
      />
      
      <div className={styles.pageButtons}>
        {visiblePageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }
          
          const isActive = Number(page) === Number(currentPage);
          return (
            <Button
              key={page}
              appearance="transparent"
              className={styles.pageButton}
              style={{
                color: isActive ? tokens.colorBrandForeground1 : undefined,
                fontWeight: isActive ? tokens.fontWeightSemibold : undefined,
                fontSize: tokens.fontSizeBase300,
                position: 'relative',
              }}
              onClick={() => onPageChange(page as number)}
            >
              {page}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '3px',
                    backgroundColor: tokens.colorBrandBackground,
                    borderRadius: '2px',
                  }}
                />
              )}
            </Button>
          );
        })}
      </div>

      <Button
        appearance="subtle"
        className={styles.navButton}
        icon={<ChevronRight24Regular />}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title="Next page"
      />
    </div>
  );
};