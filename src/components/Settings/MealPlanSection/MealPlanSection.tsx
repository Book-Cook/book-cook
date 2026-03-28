/**
 * Meal plan settings section
 */
import * as React from "react";
import {
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions
} from "@fluentui/react-components";
import { Calendar24Regular } from "@fluentui/react-icons";

import { mealPlanSectionId } from "../constants";
import { useSettingsSection } from "../context";
import { SettingsSection, SettingItem } from "../SettingShared";

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
      icon={<Calendar24Regular />}
    >
      {(!searchTerm || calendarItemMatches || sectionMatches) && (
        <SettingItem
          label="Calendar Integration"
          description="Sync your meal plans with your favorite calendar app using iCal subscription."
        >
          <Button
            appearance="subtle"
            size="small"
            onClick={() => setShowCalendarDialog(true)}
          >
            Manage Subscription
          </Button>
          
          <Dialog 
            open={showCalendarDialog} 
            onOpenChange={(_, data) => setShowCalendarDialog(data.open)}
          >
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Calendar Subscription</DialogTitle>
                <DialogContent>
                  <CalendarSubscription />
                </DialogContent>
                <DialogActions>
                  <Button 
                    appearance="secondary" 
                    onClick={() => setShowCalendarDialog(false)}
                  >
                    Close
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </SettingItem>
      )}
    </SettingsSection>
  );
};