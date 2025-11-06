<script setup lang="ts">
import { ref, computed, watch } from "vue"
import Calendar from "@/components/Calendar.vue"
import Habit from "@/components/Habit.vue"
import Consistency from "@/components/Consistency.vue"

// 当前日期
const today = new Date()
const selectedYear = ref(today.getFullYear())
const selectedMonth = ref(today.getMonth())

// 存储结构：{ [habitName]: { [date]: true } }
const habitData = ref<Record<string, Record<string, boolean>>>(
  JSON.parse(localStorage.getItem("habitData") || "{}")
)

const selectedHabit = ref<string | null>(null)
const showAddHabitDialog = ref(false)
const newHabit = ref("")

// 月份 & 星期
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// 年份选项
const yearOptions = computed(() => {
  const years = []
  for (let y = 2020; y <= 2030; y++) years.push(y)
  return years
})

// ---------------- 日历逻辑 ----------------
const calendarDays = ref<{ date: string | null }[]>([])

const updateCalendar = () => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const days: { date: string | null }[] = []
  for (let i = 0; i < startDayOfWeek; i++) days.push({ date: null })
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    days.push({ date: dateStr })
  }
  calendarDays.value = days
}
updateCalendar()

// 月份切换（来自 Calendar 组件的事件）
const onMonthChange = (payload: { year: number; month: number }) => {
  selectedYear.value = payload.year
  selectedMonth.value = payload.month
  updateCalendar()
}

// ---------------- Habit 操作 ----------------
const allHabits = computed(() => Object.keys(habitData.value))

const selectHabit = (habit: string) => {
  selectedHabit.value = habit
}

const addNewHabit = () => {
  if (!newHabit.value.trim()) return
  if (!habitData.value[newHabit.value]) habitData.value[newHabit.value] = {}
  saveToLocal()
  showAddHabitDialog.value = false
  newHabit.value = ""
}

const deleteHabit = (habit: string) => {
  if (confirm(`Are you sure you want to delete "${habit}"?`)) {
    delete habitData.value[habit]
    if (selectedHabit.value === habit) selectedHabit.value = null
    saveToLocal()
  }
}

const toggleHabitForDate = (date: string) => {
  if (!selectedHabit.value) return
  const habit = selectedHabit.value
  habitData.value[habit] = habitData.value[habit] || {}
  habitData.value[habit][date] = !habitData.value[habit][date]
  saveToLocal()
}

// ---------------- 状态与计算 ----------------
const isHabitDoneOnDate = (habit: string, date: string) => {
  return habitData.value[habit]?.[date] || false
}

const isToday = (dateStr: string | null) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

const habitStreak = (habit: string) => {
  const dates = Object.keys(habitData.value[habit] || {}).sort()
  if (dates.length === 0) return 0

  let current = 0
  let max = 0
  let prev: Date | null = null

  for (const dateStr of dates) {
    if (!habitData.value[habit][dateStr]) continue
    const date = new Date(dateStr)
    if (!prev) current = 1
    else {
      const diff = (date.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      if (diff === 1) current++
      else current = 1
    }
    max = Math.max(max, current)
    prev = date
  }
  return max
}

const habitMonthlyConsistency = (habit: string) => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const lastDay = new Date(year, month + 1, 0).getDate()

  let done = 0
  for (let d = 1; d <= lastDay; d++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    if (habitData.value[habit]?.[date]) done++
  }
  return ((done / lastDay) * 100).toFixed(1)
}

const saveToLocal = () => {
  localStorage.setItem("habitData", JSON.stringify(habitData.value))
}

watch([selectedYear, selectedMonth], updateCalendar)
</script>

<template>
  <main>
    <div class="container">
      <h2 class="title">Habit Tracker</h2>
      <div class="habit-calendar-container">
        <Habit :allHabits="allHabits" :selectedHabit="selectedHabit" :habitStreak="habitStreak"
          @select="selectHabit" @add="showAddHabitDialog = true" @delete="deleteHabit" />

        <Calendar :days="calendarDays" :weekDays="weekDays" :monthNames="monthNames" :yearOptions="yearOptions"
          :selectedHabit="selectedHabit" :isHabitDoneOnDate="isHabitDoneOnDate" :isToday="isToday" :year="selectedYear"
          :month="selectedMonth" @toggle="toggleHabitForDate" @change-month="onMonthChange" />

        <!-- <Consistency :allHabits="allHabits" :habitMonthlyConsistency="habitMonthlyConsistency" /> -->

        <!-- 添加 Habit 弹窗 -->
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
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
  color: #333;
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.habit-calendar-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 弹窗 */
.dialog-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 280px;
}

.input {
  width: 100%;
  padding: 6px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
