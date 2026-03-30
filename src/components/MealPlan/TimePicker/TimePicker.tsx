import * as React from "react";

import styles from "./TimePicker.module.css";

import { generateTimeSlots, DEFAULT_TIME_CONFIG, formatTimeForDisplay } from "../../../utils/timeSlots";
import { Button } from "../../Button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogTitle } from "../../Dialog";

interface TimePickerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTimeSelect: (time: string) => void;
  defaultTime?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  isOpen,
  onOpenChange,
  onTimeSelect,
  defaultTime = "12:00",
}) => {
  const [selectedTime, setSelectedTime] = React.useState(defaultTime);

  // Generate common meal times
  const commonTimes = [
    "07:00", "07:30", "08:00", "08:30", // Breakfast
    "12:00", "12:30", "13:00", "13:30", // Lunch
    "15:00", "15:30", // Snack
    "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", // Dinner
  ];

  const allTimeSlots = generateTimeSlots(DEFAULT_TIME_CONFIG);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    onTimeSelect(selectedTime);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedTime(defaultTime);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent withCloseButton={false}>
        <DialogBody>
          <DialogTitle>Choose a time for your meal</DialogTitle>
          <div>
            <label className={styles.fieldLabel}>Quick select common times:</label>
            <div className={styles.timeGrid}>
              {commonTimes.map(time => (
                <Button
                  key={time}
                  appearance={selectedTime === time ? "primary" : "secondary"}
                  className={styles.timeButton}
                  onClick={() => handleTimeSelect(time)}
                >
                  {formatTimeForDisplay(time)}
                </Button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Or select any time:</label>
            <select
              className={styles.select}
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {allTimeSlots.map(time => (
                <option key={time} value={time}>
                  {formatTimeForDisplay(time)}
                </option>
              ))}
            </select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button appearance="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={handleConfirm}>
            Add Meal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
