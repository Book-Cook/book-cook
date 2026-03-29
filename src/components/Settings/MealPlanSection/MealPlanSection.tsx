/**
 * Meal plan settings section
 */
import * as React from "react";
import { CalendarIcon } from "@phosphor-icons/react";

import { mealPlanSectionId } from "../constants";
import { useSettingsSection } from "../context";
import { SettingsSection, SettingItem } from "../SettingShared";

import { Button } from "../../Button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Dialog";
import { CalendarSubscription } from "../../MealPlan/CalendarSubscription/CalendarSubscription";

const sectionKeywords = [
  "meal",
  "plan",
  "planning",
  "calendar",
  "schedule",
  "food"
];

const calendarKeywords = [
  "calendar",
  "subscription",
  "sync",
  "ical",
  "integration",
  "export",
  "subscribe"
];

export const MealPlanSection: React.FC = () => {
  const [showCalendarDialog, setShowCalendarDialog] = React.useState(false);

  const { searchTerm, isVisible: sectionMatches } = useSettingsSection(
    mealPlanSectionId,
    sectionKeywords
  );

  const calendarItemMatches = searchTerm
    ? calendarKeywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : true;

  const isVisible = sectionMatches || calendarItemMatches;

  if (searchTerm && !isVisible) {
    return null;
  }

  return (
    <SettingsSection
      title="Meal Planning"
      itemValue={mealPlanSectionId}
      icon={<CalendarIcon />}
    >
      {(!searchTerm || calendarItemMatches || sectionMatches) && (
        <SettingItem
          label="Calendar Integration"
          description="Sync your meal plans with your favorite calendar app using iCal subscription."
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCalendarDialog(true)}
          >
            Manage Subscription
          </Button>

          <Dialog
            open={showCalendarDialog}
            onOpenChange={(open) => setShowCalendarDialog(open)}
          >
            <DialogContent size="md">
              <DialogHeader>
                <DialogTitle>Calendar Subscription</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <CalendarSubscription />
              </DialogBody>
              <DialogFooter>
                <Button
                  appearance="secondary"
                  onClick={() => setShowCalendarDialog(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SettingItem>
      )}
    </SettingsSection>
  );
};
