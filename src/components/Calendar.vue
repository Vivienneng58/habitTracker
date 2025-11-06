<template>
  <!-- 年份与月份选择 -->
  <div class="month-selector">
    <select v-model="selectedYear" @change="updateCalendar">
      <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
    </select>

    <select v-model="selectedMonth" @change="updateCalendar">
      <option v-for="(monthName, index) in monthNames" :key="index" :value="index">
        {{ monthName }}
      </option>
    </select>
  </div>

  <!-- ✅ 新增统计栏 -->
  <div class="stats">
    <div><strong>Current Streak:</strong> {{ streak }} days</div>
    <div><strong>Monthly Consistency:</strong> {{ monthlyConsistency }}%</div>
  </div>

  <!-- 日历 -->
  <div class="calendar">
    <div class="weekday" v-for="day in weekDays" :key="day">{{ day }}</div>

    <div
      v-for="day in calendarDays"
      :key="day.date"
      class="calendar-day"
      :class="{ empty: !day.date, today: isToday(day.date) }"
      @click="day.date && openAddHabit(day.date)"
    >
      <div v-if="day.date" class="date">{{ new Date(day.date).getDate() }}</div>

      <!-- habits -->
      <ul v-if="day.date" class="habit-list" @click.stop>
        <li v-for="(habit, index) in habitsByDate[day.date]" :key="index" class="habit-item">
          {{ habit }}
          <button class="delete-btn" @click="deleteHabit(day.date, index)">✕</button>
        </li>
      </ul>
    </div>
  </div>

  <!-- 添加habit弹窗 -->
  <div v-if="showDialog" class="dialog-overlay">
    <div class="dialog">
      <h3>Add Habit on {{ selectedDate }}</h3>
      <input v-model="newHabit" placeholder="Enter habit name" class="input" />
      <div class="dialog-buttons">
        <button @click="addHabitForDate" class="btn">Add</button>
        <button @click="closeDialog" class="btn cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const habitsByDate = ref<Record<string, string[]>>(
  JSON.parse(localStorage.getItem('habitsByDate') || '{}'),
)

const today = new Date()
const showDialog = ref(false)
const selectedDate = ref('')
const newHabit = ref('')

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const selectedYear = ref(today.getFullYear())
const selectedMonth = ref(today.getMonth())

const yearOptions = computed(() => {
  const years = []
  for (let y = 2020; y <= 2030; y++) years.push(y)
  return years
})

const calendarDays = ref<{ date: string | null }[]>([])

const updateCalendar = () => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()
  const totalDays = lastDay.getDate()
  const tempDays: { date: string | null }[] = []

  for (let i = 0; i < startDayOfWeek; i++) tempDays.push({ date: null })

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    tempDays.push({ date: dateStr })
  }
  calendarDays.value = tempDays
}
updateCalendar()

// ✅ 统计计算
const streak = computed(() => {
  // 获取所有有habit的日期
  const allDates = Object.keys(habitsByDate.value).sort()
  if (allDates.length === 0) return 0

  let maxStreak = 0
  let currentStreak = 0
  let prevDate: Date | null = null

  for (const dateStr of allDates) {
    const date = new Date(dateStr)
    if (!prevDate) {
      currentStreak = 1
    } else {
      const diffDays = (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays === 1) {
        currentStreak++
      } else {
        currentStreak = 1
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak)
    prevDate = date
  }

  return maxStreak
})

const monthlyConsistency = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const lastDay = new Date(year, month + 1, 0)
  const totalDays = lastDay.getDate()

  let completedDays = 0
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (habitsByDate.value[dateStr] && habitsByDate.value[dateStr].length > 0) {
      completedDays++
    }
  }

  return ((completedDays / totalDays) * 100).toFixed(1)
})

const isToday = (dateStr: string | null) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

const openAddHabit = (date: string) => {
  selectedDate.value = date
  newHabit.value = ''
  showDialog.value = true
}

const addHabitForDate = () => {
  if (!newHabit.value.trim()) return
  if (!habitsByDate.value[selectedDate.value]) {
    habitsByDate.value[selectedDate.value] = []
  }
  habitsByDate.value[selectedDate.value].push(newHabit.value.trim())
  saveToLocal()
  closeDialog()
}

const deleteHabit = (date: string, index: number) => {
  habitsByDate.value[date].splice(index, 1)
  if (habitsByDate.value[date].length === 0) {
    delete habitsByDate.value[date]
  }
  saveToLocal()
}

const saveToLocal = () => {
  localStorage.setItem('habitsByDate', JSON.stringify(habitsByDate.value))
}

const closeDialog = () => {
  showDialog.value = false
}

// 当习惯或月份改变时自动刷新统计
watch([habitsByDate, selectedMonth, selectedYear], () => {
  updateCalendar()
})
</script>

<style scoped>
.month-selector {
  margin-bottom: 10px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  font-size: 16px;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 6px;
}

select {
  padding: 6px 10px;
  margin: 0 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* Calendar */
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.weekday {
  font-weight: bold;
  background-color: #f0f0f0;
  padding: 6px;
  border-radius: 4px;
}

.calendar-day {
  border: 1px solid #ddd;
  border-radius: 6px;
  min-height: 90px;
  background-color: #fafafa;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-day.empty {
  background-color: transparent;
  border: none;
  cursor: default;
}

.calendar-day:hover {
  background-color: #e8f0fe;
}

.date {
  font-weight: bold;
  margin: 4px;
  align-self: flex-end;
}

.today {
  border: 2px solid #007bff;
}

.habit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  width: 90%;
}

.habit-item {
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  padding: 2px 4px;
  margin-top: 4px;
  position: relative;
}

.delete-btn {
  position: absolute;
  right: -5px;
  top: -5px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 10px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #d9363e;
}

/* Dialog */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.input {
  width: 100%;
  padding: 6px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn.cancel {
  background-color: #aaa;
}

.btn:hover {
  opacity: 0.9;
}
</style>
