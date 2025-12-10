import { Spinner } from "@fluentui/react-components";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";

import { getDb } from "src/utils/db";
import { authOptions } from "./api/auth/[...nextauth]";

const RecipeGallery = dynamic(
  () =>
    import("src/components/RecipeGallery/RecipeGallery").then((mod) => ({
      default: mod.RecipeGallery,
    })),
  {
    loading: () => <Spinner label="Loading recipes..." />,
    ssr: true,
  }
);

export default function Recipes(props: {
  initialPage?: number;
}) {
  return (
    <RecipeGallery
      initialPage={props.initialPage}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const pageParam = context.query.page;
    const page =
      Number(
        pageParam && typeof pageParam === "string" ? parseInt(pageParam, 10) : 1
      ) || 1;
    const pageSize = 20;

    const offset = (page - 1) * pageSize;

    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    const db = await getDb();

    // Build visibility conditions (same as API)
    const visibilityConditions: Array<Record<string, unknown>> = [
      { isPublic: true },
    ];
    if (session?.user?.id) {
      try {
        const sharedOwners = await db
          .collection("users")
          .find(
            { sharedWithUsers: session.user.email },
            { projection: { _id: 1 } }
          )
          .map((user) => user._id.toString())
          .toArray();

        visibilityConditions.push(
          { owner: session.user.id },
          { owner: { $in: sharedOwners } }
        );
      } catch (err) {
        console.error("Error fetching shared owners for SSR:", err);
      }
    }

    const query = { $or: visibilityConditions };
    const projection = { data: 0 };

    // Default sort matches client default: dateNewest -> createdAt desc
    const sortProperty = "createdAt";
    const direction = -1;

    const rawRecipes = await db
      .collection("recipes")
      .find(query, { projection })
      .sort({ [sortProperty]: direction })
      .skip(offset)
      .limit(pageSize)
      .toArray();

    // Convert DB-specific types (ObjectId, Date) to serializable values
    const recipes = rawRecipes.map((r) => {
      const record = r as Record<string, unknown>;
      const id = record._id;
      let idStr: unknown = id;
      if (id && typeof id === "object") {
        const maybeId = id as {
          toHexString?: () => string;
          toString?: () => string;
        };
        if (typeof maybeId.toHexString === "function") {
          idStr = maybeId.toHexString();
        } else if (typeof maybeId.toString === "function") {
          idStr = maybeId.toString();
        }
      }

      const ownerRaw = record.owner;
      let owner: unknown = ownerRaw;
      if (ownerRaw && typeof ownerRaw === "object") {
        const maybeOwner = ownerRaw as { toString?: () => string };
        if (typeof maybeOwner.toString === "function") {
          owner = maybeOwner.toString();
        }
      }

      const createdAtRaw = record.createdAt;
      const createdAt =
        createdAtRaw instanceof Date
          ? createdAtRaw.toISOString()
          : (createdAtRaw ?? null);

      const publishedAtRaw = record.publishedAt;
      const publishedAt =
        publishedAtRaw instanceof Date
          ? publishedAtRaw.toISOString()
          : (publishedAtRaw ?? null);

      return {
        ...record,
        _id: idStr,
        owner,
        createdAt,
        publishedAt,
      } as Record<string, unknown>;
    });

    const totalCount = await db.collection("recipes").countDocuments(query);

    const initialData = {
      recipes,
      totalCount,
      hasMore: offset + pageSize < totalCount,
    };

    const queryClient = new QueryClient();
    // match the queryKey used in RecipeGallery's useQuery
    queryClient.setQueryData(
      ["recipes", "", "dateNewest", page, pageSize],
      initialData
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialPage: page
      },
    };
  } catch (error) {
    console.error("SSR error for /recipes:", error);
    return { props: {} };
  }
};
