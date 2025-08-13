import * as React from 'react';
import {
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-icons';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: tokens.spacingVerticalM,
    gap: tokens.spacingHorizontalM,
  },
  navButton: {
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    minWidth: '32px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  pageButton: {
    minWidth: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground1,
    position: 'relative',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  pageButtonActive: {
    color: `${tokens.colorBrandForeground1} !important`,
    fontWeight: `${tokens.fontWeightSemibold} !important`,
    backgroundColor: `${tokens.colorBrandBackgroundSelected} !important`,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '2px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '20px',
      height: '4px',
      backgroundColor: tokens.colorBrandBackground,
      borderRadius: '3px',
      zIndex: 1,
    },
    '&:hover': {
      backgroundColor: `${tokens.colorBrandBackgroundSelected} !important`,
      color: `${tokens.colorBrandForeground1} !important`,
    },
    '&:active': {
      backgroundColor: `${tokens.colorBrandBackgroundSelected} !important`,
      color: `${tokens.colorBrandForeground1} !important`,
    },
  },
  ellipsis: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
});

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const styles = useStyles();

  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

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
        {getVisiblePageNumbers().map((page, index) => {
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