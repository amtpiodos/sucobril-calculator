<template>
  <div>
    <date-picker :dateInput="dateInput" :initialDates="dates2" :value="dates2"/>
  </div>
</template>

<script>
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      dateInput: {
        placeholder: "Select Date",
      },
      dates1: [new Date("2021 09 01 00:00"), new Date("2021 09 03 23:59")],
      dates2: '',
    };
  },
};
</script>