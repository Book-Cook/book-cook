import { useAddMealMutation } from "./useAddMealMutation";
import { useMoveMealMutation } from "./useMoveMealMutation";
import { useRemoveMealMutation } from "./useRemoveMealMutation";
import { useReorderMealMutation } from "./useReorderMealMutation";

interface UseMealPlanMutationsProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export const useMealPlanMutations = ({
  dateRange,
}: UseMealPlanMutationsProps) => {
  const addMealMutation = useAddMealMutation({ dateRange });
  const removeMealMutation = useRemoveMealMutation({ dateRange });
  const reorderMealMutation = useReorderMealMutation({ dateRange });
  const moveMealMutation = useMoveMealMutation({ dateRange });

  return {
    addMealMutation,
    removeMealMutation,
    reorderMealMutation,
    moveMealMutation,
  };
};
