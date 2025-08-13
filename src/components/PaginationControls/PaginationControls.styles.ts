import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
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