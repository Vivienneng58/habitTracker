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
        v-for="(day, i) in weekDays"
        :key="day"
        class="weekday"
        :class="{ weekend: i === 0 || i === 6 }"
      >
        {{ day }}
      </div>

      <!-- 日期格 -->
      <div
        v-for="(day, index) in days"
        :key="day.date ? `day-${day.date}` : `empty-${index}`"
        class="calendar-day"
        :class="{ today: isToday(day.date), empty: !day.date }"
        @click="() => day.date && emit('click-date', day.date)"
      >
        <template v-if="day.date">
          <div class="date">{{ new Date(day.date).getDate() }}</div>

          <!-- 用颜色显示当前日期完成的 habits -->
          <ul v-if="habitsByDate[day.date]?.length" class="habit-list">
            <li
              v-for="habit in habitsByDate[day.date]"
              :key="habit"
              class="habit-item"
              :style="{ backgroundColor: habitColors[habit] || '#10b981' }"
            >
              √ {{ habit }}
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface DayItem {
  date: string | null
}

const props = defineProps<{
  days: DayItem[]
  weekDays: string[]
  monthNames: string[]
  yearOptions: number[]
  allHabits: string[]
  habitRecords: Record<string, string[]> // { '2025-11-07': ['Exercise', 'Read'] }
  isToday: (date: string | null) => boolean
  year: number
  month: number
  habitColors: Record<string, string> // ✅ 新增：每个习惯对应颜色
}>()

const emit = defineEmits<{
  (e: 'change-month', payload: { year: number; month: number }): void
  (e: 'click-date', date: string): void
}>()

const localYear = ref(props.year)
const localMonth = ref(props.month)

watch(
  () => [props.year, props.month],
  ([y, m]) => {
    localYear.value = y
    localMonth.value = m
  },
)

const emitChangeMonth = () => {
  emit('change-month', { year: localYear.value, month: localMonth.value })
}

const habitsByDate = computed(() => props.habitRecords)
</script>

<style scoped>
/* 保持你的样式原样 */
.calendar-container {
  flex: 1;
  min-width: 600px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.month-selector {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.month-selector select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f9fafb;
  font-size: 14px;
  cursor: pointer;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  padding: 6px 0;
  border-radius: 6px;
  background: #f3f4f6;
  color: #333;
}

.calendar-day {
  border-radius: 8px;
  min-height: 80px;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  padding: 4px 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.calendar-day:hover {
  background: #f3f8ff;
}

.calendar-day.empty {
  background: transparent;
  border: none;
  pointer-events: none;
}

.calendar-day.today {
  border: 2px solid #2563eb;
  background: linear-gradient(135deg, #e0f2fe, #bfdbfe);
}

.date {
  text-align: right;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
  font-size: 13px;
}

.habit-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.habit-item {
  color: white;
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 2px 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
