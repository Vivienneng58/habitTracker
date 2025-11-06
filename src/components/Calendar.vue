<template>
  <div class="container">
    <h2 class="title">Habit Tracker</h2>

    <!-- 日历部分 -->
    <div class="calendar">
      <div v-for="day in daysOfMonth" :key="day" class="calendar-day" @click="openAddHabit(day)">
        <div class="date">{{ new Date(day).getDate() }}</div>

        <!-- 当天已添加的习惯 -->
        <ul class="habit-list" @click.stop>
          <li v-for="(habit, index) in habitsByDate[day]" :key="index" class="habit-item">
            {{ habit }}
            <button class="delete-btn" @click="deleteHabit(day, index)" title="Delete habit">
              ✕
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- 添加习惯弹窗 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 用 localStorage 保存用户数据
const habitsByDate = ref<Record<string, string[]>>(
  JSON.parse(localStorage.getItem('habitsByDate') || '{}'),
)

const today = new Date()
const showDialog = ref(false)
const selectedDate = ref('')
const newHabit = ref('')

// 计算本月所有日期
const daysOfMonth = computed(() => {
  const days: string[] = []
  const date = new Date(today.getFullYear(), today.getMonth(), 1)
  while (date.getMonth() === today.getMonth()) {
    const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`
    days.push(d)
    date.setDate(date.getDate() + 1)
  }
  return days
})

// 打开添加habit的弹窗
const openAddHabit = (date: string) => {
  selectedDate.value = date
  newHabit.value = ''
  showDialog.value = true
}

// 添加habit
const addHabitForDate = () => {
  if (!newHabit.value.trim()) return
  if (!habitsByDate.value[selectedDate.value]) {
    habitsByDate.value[selectedDate.value] = []
  }
  habitsByDate.value[selectedDate.value].push(newHabit.value.trim())
  saveToLocal()
  closeDialog()
}

// 删除habit
const deleteHabit = (date: string, index: number) => {
  habitsByDate.value[date].splice(index, 1)
  if (habitsByDate.value[date].length === 0) {
    delete habitsByDate.value[date] // 删除空日期
  }
  saveToLocal()
}

// 保存到localStorage
const saveToLocal = () => {
  localStorage.setItem('habitsByDate', JSON.stringify(habitsByDate.value))
}

// 关闭弹窗
const closeDialog = () => {
  showDialog.value = false
}
</script>

<style scoped>
.container {
  max-width: 650px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
  color: #333;
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Calendar */
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px;
  min-height: 90px;
  background-color: #fafafa;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-day:hover {
  background-color: #e8f0fe;
}

.date {
  font-weight: bold;
  margin-bottom: 4px;
}

.habit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  color: #333;
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
