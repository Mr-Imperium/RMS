import React from 'react';
import { Grid, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

/**
 * @typedef {object} DateRange
 * @property {Date|null} startDate
 * @property {Date|null} endDate
 */

/**
 * A component for selecting a start and end date.
 * @param {object} props
 * @param {DateRange} props.value - The current date range value.
 * @param {function(DateRange): void} props.onChange - Callback function when the date range changes.
 */
const DateRangePicker = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Start Date"
            value={value.startDate}
            onChange={(date) => onChange({ ...value, startDate: date })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="End Date"
            value={value.endDate}
            onChange={(date) => onChange({ ...value, endDate: date })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangePicker;