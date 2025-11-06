<template>
  <div class="calendar-container">
    <div class="month-selector">
      <select
        :value="year"
        @change="$emit('update:year', +$event.target.value)"
      >
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>

      <select
        :value="month"
        @change="$emit('update:month', +$event.target.value)"
      >
        <option v-for="(m, i) in monthNames" :key="i" :value="i">{{ m }}</option>
      </select>
    </div>

    <div class="calendar">
      <div class="weekday" v-for="d in weekDays" :key="d">{{ d }}</div>
      <div
        v-for="day in days"
        :key="day.date"
        class="calendar-day"
        :class="{ today: isToday(day.date) }"
        @click="day.date && $emit('toggle', day.date)"
      >
        <div v-if="day.date" class="date">{{ new Date(day.date).getDate() }}</div>
        <ul
          v-if="selectedHabit && day.date && isHabitDoneOnDate(selectedHabit, day.date)"
          class="habit-list"
        >
          <li class="habit-item">✅ {{ selectedHabit }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  days: { date: string | null }[]
  weekDays: string[]
  monthNames: string[]
  yearOptions: number[]
  selectedHabit: string | null
  isHabitDoneOnDate: (habit: string, date: string) => boolean
  isToday: (date: string | null) => boolean
  year: number
  month: number
}>()

defineEmits(["toggle", "update:year", "update:month"])
</script>

<style scoped>
.calendar-container {
  flex: 1;
  min-width: 600px;
}

.month-selector {
  margin-bottom: 10px;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.weekday {
  font-weight: bold;
  text-align: center;
  padding: 4px;
}

.calendar-day {
  border: 1px solid #ddd;
  border-radius: 6px;
  min-height: 80px;
  width: 100px;
  background-color: #fafafa;
  position: relative;
  transition: background-color 0.2s;
}

.calendar-day.today {
  border: 2px solid #007bff;
}

.calendar-day:hover {
  background: #e8f0fe;
}

.habit-item {
  background: #4caf50;
  color: white;
  font-size: 13px;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 3px;
}
</style>
