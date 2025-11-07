<script setup lang="ts">
import { ref, computed } from 'vue'
import Calendar from '@/components/Calendar.vue'
import Habit from '@/components/Habit.vue'
import Consistency from '@/components/Consistency.vue'

// ====================== 数据 ======================
const allHabits = ref<string[]>(JSON.parse(localStorage.getItem('allHabits') || '[]'))
const habitRecords = ref<Record<string, string[]>>(
  JSON.parse(localStorage.getItem('habitRecords') || '{}'),
)

const showAddHabitDialog = ref(false)
const showSelectHabitDialog = ref(false)
const newHabit = ref('')
const selectedDate = ref('')

// ====================== 日历数据 ======================
const today = new Date()
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

// 计算日历日期
const calendarDays = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const days: { date: string | null }[] = []

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 前置空格
  for (let i = 0; i < firstDay; i++) days.push({ date: null })
  // 当月日期
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: dateStr })
  }
  return days
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

// ====================== 操作逻辑 ======================

// 添加新习惯
const addNewHabit = () => {
  if (!newHabit.value.trim()) return
  allHabits.value.push(newHabit.value.trim())
  saveToLocal()
  newHabit.value = ''
  showAddHabitDialog.value = false
}

// 点击日期 => 选择为哪一个 habit 标记完成
const openSelectHabitDialog = (date: string) => {
  selectedDate.value = date
  showSelectHabitDialog.value = true
}

// 在选中的日期标记/取消某个 habit
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

// 删除习惯（同时清除对应记录）
const deleteHabit = (habit: string) => {
  allHabits.value = allHabits.value.filter((h) => h !== habit)
  for (const date in habitRecords.value) {
    habitRecords.value[date] = habitRecords.value[date].filter((h) => h !== habit)
    if (!habitRecords.value[date].length) delete habitRecords.value[date]
  }
  saveToLocal()
}

// 判断某日期是否完成某 habit
const isHabitDoneOnDate = (habit: string, date: string) => {
  return habitRecords.value[date]?.includes(habit) ?? false
}

// ====================== 统计 ======================

// streak：某 habit 连续完成天数
const habitStreak = (habit: string) => {
  let streak = 0
  const currentDate = new Date(today)
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0]
    if (habitRecords.value[dateStr]?.includes(habit)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else break
  }
  return streak
}

// consistency：某 habit 本月完成比例
const habitMonthlyConsistency = (habit: string) => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let count = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (habitRecords.value[dateStr]?.includes(habit)) count++
  }
  return ((count / daysInMonth) * 100).toFixed(1)
}

// 保存数据
const saveToLocal = () => {
  localStorage.setItem('allHabits', JSON.stringify(allHabits.value))
  localStorage.setItem('habitRecords', JSON.stringify(habitRecords.value))
}
</script>

<template>
  <main>
    <div class="container">
      <h2 class="title">Habit Tracker</h2>

      <div class="layout">
        <!-- 左边 Habits -->
        <Habit
          :allHabits="allHabits"
          :habitStreak="habitStreak"
          @add="showAddHabitDialog = true"
          @delete="deleteHabit"
        />

        <!-- 右边 Calendar -->
        <Calendar
          :days="calendarDays"
          :weekDays="weekDays"
          :monthNames="monthNames"
          :yearOptions="yearOptions"
          :allHabits="allHabits"
          :habitRecords="habitRecords"
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

      <!-- 下方 Consistency -->
      <Consistency :allHabits="allHabits" :habitMonthlyConsistency="habitMonthlyConsistency" />

      <!-- 添加新 Habit -->
      <div v-if="showAddHabitDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>Add New Habit</h3>
          <input v-model="newHabit" placeholder="Habit name" class="input" />
          <div class="dialog-buttons">
            <button @click="addNewHabit" class="btn">Add</button>
            <button @click="showAddHabitDialog = false" class="btn cancel">Cancel</button>
          </div>
        </div>
      </div>

      <!-- 选择 Habit 标记完成 -->
      <div v-if="showSelectHabitDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>Select Habit for {{ selectedDate }}</h3>
          <ul class="habit-select-list">
            <li
              v-for="habit in allHabits"
              :key="habit"
              @click="toggleHabitForDate(habit)"
              class="habit-option"
            >
              <span>{{ habit }}</span>
              <span>
                {{ isHabitDoneOnDate(habit, selectedDate) ? '✅' : '❌' }}
              </span>
            </li>
          </ul>
          <div class="dialog-buttons">
            <button @click="showSelectHabitDialog = false" class="btn cancel">Close</button>
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
  font-family: Arial, sans-serif;
}

.layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
}

.input {
  width: 100%;
  padding: 6px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.habit-select-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.habit-option {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
}
.habit-option:hover {
  background: #f0f0f0;
}
</style>
