import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "../../components/Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
      {/* Basic card */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Basic Card</h3>
        <Card>
          <h4 style={{ margin: 0, marginBottom: "8px" }}>Card Title</h4>
          <p style={{ margin: 0, color: "#666" }}>
            This is a basic card with some content inside.
          </p>
        </Card>
      </div>

      {/* Clickable card */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Clickable Card</h3>
        <Card onClick={() => alert("Card clicked!")}>
          <h4 style={{ margin: 0, marginBottom: "8px" }}>Clickable Card</h4>
          <p style={{ margin: 0, color: "#666" }}>
            Click this card to see an alert. Notice the hover effect and cursor.
          </p>
        </Card>
      </div>

      {/* Card with custom styling */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Custom Styled Card</h3>
        <Card className="custom-card" style={{ padding: "24px", backgroundColor: "#f9f9f9" }}>
          <h4 style={{ margin: 0, marginBottom: "8px" }}>Custom Styled</h4>
          <p style={{ margin: 0, color: "#666" }}>
            This card has custom padding and background color.
          </p>
        </Card>
      </div>

      {/* Card with complex content */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Card with Complex Content</h3>
        <Card>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🍕
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, marginBottom: "4px" }}>Pizza Recipe</h4>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                A delicious homemade pizza recipe
              </p>
              <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                <span style={{
                  padding: "4px 8px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "4px",
                  fontSize: "12px"
                }}>
                  Italian
                </span>
                <span style={{
                  padding: "4px 8px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "4px",
                  fontSize: "12px"
                }}>
                  30 mins
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Multiple cards in a grid */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Card Grid</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <Card onClick={() => console.log("Card 1")}>
            <h4 style={{ margin: 0, marginBottom: "8px" }}>Recipe 1</h4>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Quick and easy meal
            </p>
          </Card>
          <Card onClick={() => console.log("Card 2")}>
            <h4 style={{ margin: 0, marginBottom: "8px" }}>Recipe 2</h4>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Healthy dinner option
            </p>
          </Card>
          <Card onClick={() => console.log("Card 3")}>
            <h4 style={{ margin: 0, marginBottom: "8px" }}>Recipe 3</h4>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Family favorite
            </p>
          </Card>
        </div>
      </div>
    </div>
  ),
};
