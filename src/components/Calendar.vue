<template>
  <div class="calendar-container">
    <!-- 月份选择器 -->
    <div class="month-selector">
      <select v-model="localYear" @change="emitChangeMonth">
        <option v-for="y in yearOptions" :key="y">{{ y }}</option>
      </select>
      <select v-model="localMonth" @change="emitChangeMonth">
        <option v-for="(m, i) in monthNames" :key="i" :value="i">{{ m }}</option>
      </select>
    </div>

    <!-- 日历主体 -->
    <div class="calendar">
      <!-- 星期标题 -->
      <div
        v-for="(d, idx) in weekDays"
        :key="d"
        class="weekday"
        :class="{ weekend: idx === 0 || idx === 6 }"
      >
        {{ d }}
      </div>

      <!-- 日期格 -->
      <div
        v-for="day in days"
        :key="day.date || Math.random()"
        class="calendar-day"
        :class="{
          today: isToday(day.date),
          empty: !day.date,
        }"
        @click="day.date && $emit('click-date', day.date)"
      >
        <div v-if="day.date" class="date">{{ new Date(day.date).getDate() }}</div>

        <!-- ✅ 当天完成的习惯 -->
        <ul v-if="day.date" class="habit-list">
          <li
            v-for="habit in allHabits.filter((h) => habitRecords[h]?.includes(day.date))"
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
/* === 容器整体 === */
.calendar-container {
  flex: 1;
  min-width: 650px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: all 0.3s ease;
}

/* === 月份选择器 === */
.month-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.month-selector select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.month-selector select:hover {
  background: #e9ecef;
}

/* === 星期栏 === */
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.weekday {
  font-weight: bold;
  text-align: center;
  padding: 6px;
  background: #f0f2f5;
  border-radius: 6px;
  color: #333;
}

.weekday.weekend {
  color: #c62828;
}

/* === 日期格 === */
.calendar-day {
  border-radius: 8px;
  min-height: 90px;
  background-color: #fafafa;
  box-shadow: inset 0 0 0 1px #e0e0e0;
  position: relative;
  transition: all 0.25s ease;
  cursor: pointer;
  padding: 4px;
}

.calendar-day:hover {
  background: #f3f8ff;
  transform: scale(1.03);
}

/* 空白格 */
.calendar-day.empty {
  background: transparent;
  box-shadow: none;
  cursor: default;
}

/* 当天 */
.calendar-day.today {
  border: 2px solid #007bff;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

/* 日期数字 */
.date {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  text-align: right;
  padding-right: 4px;
}

/* === 当天的 habit 列表 === */
.habit-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.habit-item {
  background: #4caf50;
  color: white;
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 2px 0;
  text-align: left;
  word-break: break-word;
}
</style>
