<template>
  <!-- 月份切换 -->
  <div class="month-switch">
    <button @click="prevMonth" class="switch-btn">←</button>
    <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
    <button @click="nextMonth" class="switch-btn">→</button>
  </div>

  <!-- 星期标题 -->
  <div class="weekdays">
    <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
  </div>

  <!-- 日历 -->
  <div class="calendar">
    <div
      v-for="(day, index) in calendarDays"
      :key="index"
      class="calendar-day"
      :class="{ empty: !day, today: isToday(day) }"
      @click="day && openAddHabit(day)"
    >
      <div v-if="day" class="date">{{ new Date(day).getDate() }}</div>
      <!-- 当天的habit -->
      <ul v-if="day" class="habit-list" @click.stop>
        <li v-for="(habit, index) in habitsByDate[day]" :key="index" class="habit-item">
          {{ habit }}
          <button class="delete-btn" @click="deleteHabit(day, index)" title="Delete habit">
            ✕
          </button>
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
import { ref, computed } from 'vue'

// === State ===
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const habitsByDate = ref<Record<string, string[]>>(
  JSON.parse(localStorage.getItem('habitsByDate') || '{}'),
)
const showDialog = ref(false)
const selectedDate = ref('')
const newHabit = ref('')

// === Display strings ===
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

// === Computed month text ===
const monthYear = computed(() => `${monthNames[currentMonth.value]} ${currentYear.value}`)

// === Real calendar structure ===
const calendarDays = computed(() => {
  const days: (string | null)[] = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const totalDays = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  // 前面补空位 (对齐星期)
  const startWeekday = firstDay.getDay()
  for (let i = 0; i < startWeekday; i++) {
    days.push(null)
  }

  // 加入日期
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(
      2,
      '0',
    )}-${String(d).padStart(2, '0')}`
    days.push(dateStr)
  }

  return days
})

// === 功能函数 ===
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
  if (habitsByDate.value[date].length === 0) delete habitsByDate.value[date]
  saveToLocal()
}

const saveToLocal = () => {
  localStorage.setItem('habitsByDate', JSON.stringify(habitsByDate.value))
}

const closeDialog = () => {
  showDialog.value = false
}

// === 月份切换 ===
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
</script>

<style scoped>
/* 月份切换 */
.month-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}
.switch-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
}
.switch-btn:hover {
  opacity: 0.8;
}

/* 星期栏 */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  color: #555;
  margin-bottom: 6px;
}
.weekday {
  text-align: center;
}

/* Calendar */
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.calendar-day {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 4px;
  min-height: 90px;
  background-color: #fafafa;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.2s;
}
.calendar-day.empty {
  background: none;
  border: none;
  cursor: default;
}
.calendar-day:hover:not(.empty) {
  background-color: #e8f0fe;
}

.date {
  font-weight: bold;
  width: 100%;
  text-align: right;
  padding-right: 5px;
}
.today .date {
  color: #d6336c;
  font-weight: 900;
}

/* Habit */
.habit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  width: 100%;
}
.habit-item {
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  padding: 2px 4px;
  margin-top: 4px;
  width: 90%;
  text-align: center;
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
  line-height: 14px;
  cursor: pointer;
  transition: 0.2s;
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
