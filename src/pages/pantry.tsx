import * as React from "react";
import {
  Title2,
  Subtitle1,
  Card,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Dialog,
  Field,
  Input,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogSurface,
  DialogBody,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { AddRegular, EditRegular, DeleteRegular } from "@fluentui/react-icons";

// Simple type to track pantry items
interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  expirationDate: string;
  dateAdded: string;
}

const useStyles = makeStyles({
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px 16px" },
  formRow: { display: "flex", gap: tokens.spacingHorizontalM },
  expiredText: {
    textDecoration: "line-through",
    color: tokens.colorNeutralForeground3,
  },
  expiringText: { color: tokens.colorPaletteRedForeground1 },
  emptyState: { textAlign: "center", padding: "40px 0" },
});

export default function PantryPage() {
  const styles = useStyles();
  const [pantryItems, setPantryItems] = React.useState<PantryItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pantryItems");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<PantryItem>({
    id: "",
    name: "",
    quantity: "",
    unit: "",
    expirationDate: "",
    dateAdded: "",
  });

  // Save to localStorage when items change
  React.useEffect(() => {
    localStorage.setItem("pantryItems", JSON.stringify(pantryItems));
  }, [pantryItems]);

  // Handle opening dialog for adding new item
  const handleOpenAddDialog = () => {
    setCurrentItem({
      id: "",
      name: "",
      quantity: "",
      unit: "",
      expirationDate: "",
      dateAdded: new Date().toISOString().split("T")[0],
    });
    setEditMode(false);
    setDialogOpen(true);
  };

  // Handle opening dialog for editing item
  const handleOpenEditDialog = (item: PantryItem) => {
    setCurrentItem({ ...item });
    setEditMode(true);
    setDialogOpen(true);
  };

  // Handle input changes in form
  const handleInputChange = (field: keyof PantryItem, value: string) => {
    setCurrentItem((prev) => ({ ...prev, [field]: value }));
  };

  // Save current item (add new or update existing)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem.name || !currentItem.quantity) {
      alert("Name and quantity are required.");
      return;
    }

    if (editMode) {
      setPantryItems((prev) =>
        prev.map((item) => (item.id === currentItem.id ? currentItem : item))
      );
    } else {
      setPantryItems((prev) => [
        ...prev,
        { ...currentItem, id: crypto.randomUUID() },
      ]);
    }
    setDialogOpen(false);
  };

  // Delete an item
  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to remove this item?")) {
      setPantryItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Check expiration status
  const getExpirationStatus = (date: string) => {
    if (!date) {
      return { status: "ok" };
    }

    const expiry = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return { status: "expired", daysLeft: diffDays };
    }
    if (diffDays <= 7) {
      return { status: "expiring-soon", daysLeft: diffDays };
    }
    return { status: "ok", daysLeft: diffDays };
  };

  // Sort items by expiration date
  const sortedItems = [...pantryItems].sort((a, b) => {
    if (!a.expirationDate && !b.expirationDate) {
      return 0;
    }
    if (!a.expirationDate) {
      return 1;
    }
    if (!b.expirationDate) {
      return -1;
    }
    return (
      new Date(a.expirationDate).getTime() -
      new Date(b.expirationDate).getTime()
    );
  });

  return (
    <div className={styles.container}>
      <CardHeader
        header={<Title2>My Pantry</Title2>}
        description={
          <Subtitle1>Track your ingredients and expiration dates</Subtitle1>
        }
        action={
          <Button
            appearance="primary"
            icon={<AddRegular />}
            onClick={handleOpenAddDialog}
          >
            Add Ingredient
          </Button>
        }
      />

      <Card>
        {sortedItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Ingredient</TableHeaderCell>
                <TableHeaderCell>Quantity</TableHeaderCell>
                <TableHeaderCell>Expiration</TableHeaderCell>
                <TableHeaderCell>Date Added</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => {
                const status = getExpirationStatus(item.expirationDate);
                const isExpired = status.status === "expired";
                const isExpiring = status.status === "expiring-soon";

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Text
                        className={
                          isExpired
                            ? styles.expiredText
                            : isExpiring
                              ? styles.expiringText
                              : undefined
                        }
                      >
                        {item.name}
                        {isExpired && (
                          <Badge
                            color="danger"
                            appearance="filled"
                            style={{ marginLeft: "8px" }}
                          >
                            Expired
                          </Badge>
                        )}
                        {isExpiring && (
                          <Badge
                            color="warning"
                            appearance="filled"
                            style={{ marginLeft: "8px" }}
                          >
                            {status.daysLeft} days left
                          </Badge>
                        )}
                      </Text>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>{item.expirationDate || "Not set"}</TableCell>
                    <TableCell>{item.dateAdded}</TableCell>
                    <TableCell>
                      <Button
                        icon={<EditRegular />}
                        appearance="subtle"
                        size="small"
                        onClick={() => handleOpenEditDialog(item)}
                      />
                      <Button
                        icon={<DeleteRegular />}
                        appearance="subtle"
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className={styles.emptyState}>
            <Text size={400}>Your pantry is empty</Text>
            <Text size={300} block>
              Add ingredients to track what you have on hand
            </Text>
            <Button
              appearance="primary"
              icon={<AddRegular />}
              onClick={handleOpenAddDialog}
              style={{ marginTop: "16px" }}
            >
              Add Your First Ingredient
            </Button>
          </div>
        )}
      </Card>
      <Dialog
        open={dialogOpen}
        onOpenChange={(e, data) => setDialogOpen(data.open)}
      >
        <DialogSurface>
          <form onSubmit={handleSaveItem}>
            <DialogBody>
              <DialogTitle>
                {editMode ? "Edit Ingredient" : "Add Ingredient"}
              </DialogTitle>
              <DialogContent>
                <Field label="Name" required>
                  <Input
                    value={currentItem.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Flour"
                  />
                </Field>

                <div className={styles.formRow}>
                  <Field label="Quantity" required style={{ flex: 1 }}>
                    <Input
                      value={currentItem.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                      placeholder="e.g., 500"
                    />
                  </Field>
                  <Field label="Unit" style={{ flex: 1 }}>
                    <Input
                      value={currentItem.unit}
                      onChange={(e) =>
                        handleInputChange("unit", e.target.value)
                      }
                      placeholder="e.g., g, cups, oz"
                    />
                  </Field>
                </div>

                <Field label="Expiration Date">
                  <Input
                    type="date"
                    value={currentItem.expirationDate}
                    onChange={(e) =>
                      handleInputChange("expirationDate", e.target.value)
                    }
                  />
                </Field>
              </DialogContent>

              <DialogActions>
                <Button
                  appearance="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button appearance="primary" type="submit">
                  {editMode ? "Save Changes" : "Add to Pantry"}
                </Button>
              </DialogActions>
            </DialogBody>
          </form>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
