import * as React from "react";
import {
  Card,
  CardHeader,
  Tag,
  Text,
  CardPreview,
  CardFooter,
} from "@fluentui/react-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { RecipeCardProps } from "./RecipeCard.types";

export const RecipeCard: React.FC<RecipeCardProps> = (props) => {
  const { title, createdDate, imageSrc, tags, id } = props;

  const router = useRouter();

  const onCardClick = () => {
    router.push(`/recipes/${id}`);
  };

  return (
    <Card onClick={onCardClick} style={{ width: "268px", height: "300px" }}>
      <CardHeader
        header={<Text weight="bold">{title}</Text>}
        description={<Text italic>{createdDate}</Text>}
      />

      <CardPreview style={{ width: "268px", height: "200px" }}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={title}
            objectFit="contain"
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </CardPreview>
      <CardFooter>
        {tags?.map((i) => {
          return <Tag>{i}</Tag>;
        })}
      </CardFooter>
    </Card>
  );
};
