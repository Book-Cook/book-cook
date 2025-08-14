import * as React from "react";
import { 
  Button, 
  Dialog, 
  DialogTrigger, 
  DialogSurface, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogBody,
  Field,
  Combobox,
  Option,
  makeStyles,
  tokens
} from "@fluentui/react-components";

import { generateTimeSlots, DEFAULT_TIME_CONFIG, formatTimeForDisplay } from "../../../utils/timeSlots";

const useStyles = makeStyles({
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalM,
  },
  timeButton: {
    height: "40px",
    fontSize: tokens.fontSizeBase200,
  },
  selectedTime: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

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
  const styles = useStyles();
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
    <Dialog open={isOpen} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Choose a time for your meal</DialogTitle>
          <DialogContent>
            <Field label="Quick select common times:">
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
            </Field>
            
            <Field label="Or select any time:" style={{ marginTop: tokens.spacingVerticalL }}>
              <Combobox
                placeholder="Select time"
                value={formatTimeForDisplay(selectedTime)}
                onOptionSelect={(_, data) => {
                  if (data.optionValue) {
                    setSelectedTime(data.optionValue);
                  }
                }}
              >
                {allTimeSlots.map(time => (
                  <Option key={time} value={time}>
                    {formatTimeForDisplay(time)}
                  </Option>
                ))}
              </Combobox>
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={handleConfirm}>
              Add Meal
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};