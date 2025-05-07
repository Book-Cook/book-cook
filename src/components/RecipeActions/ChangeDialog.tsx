import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: "450px",
    width: "100%",
    ...shorthands.borderRadius("14px"),
    boxShadow: tokens.shadow16,
  },
  dialogTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: "4px",
  },
  dialogBody: {
    paddingTop: "12px",
    paddingBottom: "24px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
});

export type ChangeDialogProps = {
  /**
   * Whether the dialog is open or not
   */
  isOpen: boolean;
  /**
   * Function to call when the dialog is closed
   */
  onClose: () => void;
  /**
   * Title of the dialog
   */
  title: string;

  /**
   * Actions to be displayed in the dialog
   */
  actions?: React.ReactNode;

  /**
   * Children to be displayed in the dialog
   */
  children: React.ReactNode;
};

export const ChangeDialog: React.FC<ChangeDialogProps> = (props) => {
  const { isOpen, onClose, title, actions } = props;

  const styles = useStyles();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(ev, data) => {
        ev.stopPropagation();
        return !data.open && onClose();
      }}
      modalType="modal"
      surfaceMotion={null}
    >
      <DialogSurface
        className={styles.dialogSurface}
        onClick={(ev) => {
          ev.stopPropagation();
        }}
      >
        <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>
        <DialogBody className={styles.dialogBody}>{props.children}</DialogBody>
        {actions && <DialogActions>{actions}</DialogActions>}
      </DialogSurface>
    </Dialog>
  );
};
