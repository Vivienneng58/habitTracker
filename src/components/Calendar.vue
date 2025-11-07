<template>
  <div class="calendar-container">
    <div class="month-selector">
      <select v-model="localYear" @change="emitChangeMonth">
        <option v-for="y in yearOptions" :key="y">{{ y }}</option>
      </select>
      <select v-model="localMonth" @change="emitChangeMonth">
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
        @click="day.date && $emit('click-date', day.date)"
      >
        <div v-if="day.date" class="date">{{ new Date(day.date).getDate() }}</div>

        <!-- 显示当天完成的所有 habits -->
        <ul v-if="day.date" class="habit-list">
          <li
            v-for="habit in allHabits.filter((h) => habitRecords[day.date]?.includes(h))"
            :key="habit"
            class="habit-item"
          >
            ✅ {{ habit }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  days: { date: string | null }[]
  weekDays: string[]
  monthNames: string[]
  yearOptions: number[]
  allHabits: string[]
  habitRecords: Record<string, string[]>
  isToday: (date: string | null) => boolean
  year: number
  month: number
}>()

const emit = defineEmits(['change-month', 'click-date'])

const localYear = ref(props.year)
const localMonth = ref(props.month)

watch([() => props.year, () => props.month], ([y, m]) => {
  localYear.value = y
  localMonth.value = m
})

const emitChangeMonth = () => {
  emit('change-month', { year: localYear.value, month: localMonth.value })
}
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
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 2px;
}
</style>
