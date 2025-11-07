<script setup lang="ts">
import { ref, computed } from 'vue'
import Calendar from '@/components/Calendar.vue'
import Habit from '@/components/Habit.vue'
import Consistency from '@/components/Consistency.vue'

// ============ 数据初始化 ============
const today = new Date()
const allHabits = ref<string[]>(JSON.parse(localStorage.getItem('allHabits') || '[]'))
const habitRecords = ref<Record<string, string[]>>(
  JSON.parse(localStorage.getItem('habitRecords') || '{}'),
)
// 🟢 新增：存储每个习惯对应颜色
const habitColors = ref<Record<string, string>>(
  JSON.parse(localStorage.getItem('habitColors') || '{}'),
)

// ============ UI 状态 ============
const showAddHabitDialog = ref(false)
const showSelectHabitDialog = ref(false)
const newHabit = ref('')
const selectedDate = ref('')

// ============ 日历控制 ============
const selectedYear = ref(today.getFullYear())
const selectedMonth = ref(today.getMonth())

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
const yearOptions = Array.from({ length: 6 }, (_, i) => today.getFullYear() - 3 + i)

// 生成当月日期数据
const calendarDays = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const days: { date: string | null }[] = []

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  for (let i = 0; i < firstDay; i++) days.push({ date: null })
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: dateStr })
  }
  return days
})

// 是否今天
const isToday = (dateStr: string | null) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return d.toDateString() === today.toDateString()
}

// ============ 操作逻辑 ============
const saveToLocal = () => {
  localStorage.setItem('allHabits', JSON.stringify(allHabits.value))
  localStorage.setItem('habitRecords', JSON.stringify(habitRecords.value))
  localStorage.setItem('habitColors', JSON.stringify(habitColors.value))
}

// 🎨 生成随机颜色函数
const generateColor = () => {
  const colors = ['#22c55e', '#ef4444', '#3b82f6', '#f97316', '#a855f7', '#eab308', '#10b981']
  return colors[Math.floor(Math.random() * colors.length)]
}

// 添加习惯
const addNewHabit = () => {
  const habit = newHabit.value.trim()
  if (!habit) return
  allHabits.value.push(habit)
  // 🔵 为新 habit 分配颜色
  habitColors.value[habit] = generateColor()
  saveToLocal()
  newHabit.value = ''
  showAddHabitDialog.value = false
}

// 删除习惯并清理记录
const deleteHabit = (habit: string) => {
  allHabits.value = allHabits.value.filter((h) => h !== habit)
  delete habitColors.value[habit] // 🗑️ 删除颜色映射
  for (const date in habitRecords.value) {
    habitRecords.value[date] = habitRecords.value[date].filter((h) => h !== habit)
    if (!habitRecords.value[date].length) delete habitRecords.value[date]
  }
  saveToLocal()
}

// 点击日期 => 打开习惯选择
const openSelectHabitDialog = (date: string) => {
  selectedDate.value = date
  showSelectHabitDialog.value = true
}

// 选中日期标记习惯完成
const toggleHabitForDate = (habit: string) => {
  const date = selectedDate.value
  if (!date) return
  const list = habitRecords.value[date] || []
  const idx = list.indexOf(habit)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(habit)
  habitRecords.value[date] = list
  saveToLocal()
}

// 某天是否完成某习惯
const isHabitDoneOnDate = (habit: string, date: string) =>
  habitRecords.value[date]?.includes(habit) ?? false

// ============ 统计 ============
const habitStreak = computed(() => (habit: string) => {
  const completed = Object.keys(habitRecords.value)
    .filter((d) => habitRecords.value[d].includes(habit))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  if (!completed.length) return 0

  let streak = 1
  for (let i = 1; i < completed.length; i++) {
    const diff =
      (new Date(completed[i - 1]).getTime() - new Date(completed[i]).getTime()) / (1000 * 3600 * 24)
    if (diff === 1) streak++
    else break
  }
  return streak
})

const habitMonthlyConsistency = (habit: string) => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const totalDays = new Date(year, month + 1, 0).getDate()

  let completed = 0
  for (let d = 1; d <= totalDays; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (habitRecords.value[date]?.includes(habit)) completed++
  }
  return ((completed / totalDays) * 100).toFixed(1)
}
</script>

<template>
  <main>
    <div class="container">
      <h2 class="title">Habit Tracker</h2>

      <div class="layout">
        <!-- Habit 组件传入颜色映射 -->
        <Habit
          :allHabits="allHabits"
          :habitStreak="habitStreak"
          :habitColors="habitColors"
          @add="showAddHabitDialog = true"
          @delete="deleteHabit"
        />

        <!-- Calendar 组件也传入 habitColors -->
        <Calendar
          :days="calendarDays"
          :weekDays="weekDays"
          :monthNames="monthNames"
          :yearOptions="yearOptions"
          :allHabits="allHabits"
          :habitRecords="habitRecords"
          :habitColors="habitColors"
          :isToday="isToday"
          :year="selectedYear"
          :month="selectedMonth"
          @change-month="
            ({ year, month }) => {
              selectedYear = year
              selectedMonth = month
            }
          "
          @click-date="openSelectHabitDialog"
        />
      </div>

      <Consistency :allHabits="allHabits" :habitMonthlyConsistency="habitMonthlyConsistency" />

      <!-- 添加 Habit -->
      <div v-if="showAddHabitDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>Add New Habit</h3>
          <input v-model="newHabit" placeholder="Habit name" class="input" />
          <div class="dialog-buttons">
            <button @click="addNewHabit" class="btn primary">Add</button>
            <button @click="showAddHabitDialog = false" class="btn">Cancel</button>
          </div>
        </div>
      </div>

      <!-- 标记 Habit 完成 -->
      <div v-if="showSelectHabitDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>Mark Habits for {{ selectedDate }}</h3>
          <ul class="habit-select-list">
            <li
              v-for="habit in allHabits"
              :key="habit"
              @click="toggleHabitForDate(habit)"
              class="habit-option"
              :style="{ borderLeft: `6px solid ${habitColors[habit]}` }"
            >
              <span>{{ habit }}</span>
              <span>{{ isHabitDoneOnDate(habit, selectedDate) ? '✅' : '❌' }}</span>
            </li>
          </ul>
          <div class="dialog-buttons">
            <button @click="showSelectHabitDialog = false" class="btn">Close</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1100px;
  margin: 30px auto;
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2d3748;
}

.layout {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}

/* ======= Dialog ======= */
.dialog-overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.dialog {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 340px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.dialog h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2d3748;
}

.input {
  width: 80%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: #e5e7eb;
  color: #374151;
}

.btn.primary {
  background: #3b82f6;
  color: #fff;
}

.btn.primary:hover {
  background: #2563eb;
}

.habit-select-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.habit-option {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.habit-option:hover {
  background: #f3f4f6;
}
</style>
