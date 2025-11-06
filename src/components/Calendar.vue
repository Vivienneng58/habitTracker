<template>
  <div class="container">
    <div class="add-section">
      <input v-model="newHabit" placeholder="Add habit" class="input" />
      <button @click="addHabit(newHabit)" class="btn">Add</button>
    </div>

    <div v-for="habit in habits" :key="habit.id" class="habit-card">
      <h3 class="habit-title">{{ habit.name }} - Streak: {{ calculateStreak(habit) }}</h3>

      <div class="calendar">
        <div
          v-for="day in daysOfMonth"
          :key="day"
          :class="['calendar-day', habit.records[day] ? 'completed' : 'not-completed']"
          @click="toggleHabitRecord(habit.id, day)"
        >
          {{ new Date(day).getDate() }}
        </div>
      </div>

      <p class="summary">Monthly completion: {{ calculateMonthlyCompletion(habit, monthStr) }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHabitStore } from '../stores/habitStore'

const store = useHabitStore()
const { habits, addHabit, toggleHabitRecord, calculateStreak, calculateMonthlyCompletion } = store

const newHabit = ref('')
const today = new Date()
const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

const daysOfMonth = computed(() => {
  const days: string[] = []
  const date = new Date(today.getFullYear(), today.getMonth(), 1)
  while (date.getMonth() === today.getMonth()) {
    const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    days.push(d)
    date.setDate(date.getDate() + 1)
  }
  return days
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
  color: #333;
}

.add-section {
  margin-bottom: 20px;
}

.input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  margin-left: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

.habit-card {
  margin-bottom: 30px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fafafa;
}

.habit-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.calendar-day {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  transition: background-color 0.2s;
}

.completed {
  background-color: #4caf50;
  color: white;
}

.not-completed {
  background-color: #e0e0e0;
}

.calendar-day:hover {
  filter: brightness(0.9);
}

.summary {
  font-size: 13px;
  color: #555;
}
</style>
