import { useId } from "react";

export const useFormFieldIds = (
  id: string | undefined,
  description: string | undefined,
  error: string | undefined,
  ariaDescribedBy: string | undefined,
  prefix = "field"
) => {
  const generatedId = useId();
  const inputId = id ?? `${prefix}-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId, errorId]
    .filter(Boolean)
    .join(" ");
  const hasSupporting = Boolean(description) || Boolean(error);
  return { inputId, descriptionId, errorId, describedBy, hasSupporting };
};
