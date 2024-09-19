import * as React from "react";
import { Body1, Display, LargeTitle } from "../components";
import Markdown from "react-markdown";
import { tokens, Card } from "@fluentui/react-components";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        backgroundColor: tokens.colorNeutralBackground2,
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          marginTop: "40px",
          marginBottom: "100px",
        }}
      >
        <Link
          href="/recipes/french-toast"
          style={{
            textDecorationLine: "none",
            color: tokens.colorNeutralForeground1,
          }}
        >
          <Body1>🍞 French toast</Body1>
        </Link>
      </div>
    </div>
  );
}
