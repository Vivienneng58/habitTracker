import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Habit {
  id: string
  name: string
  records: Record<string, boolean>
}

export const useHabitStore = defineStore('habit', () => {
  const habits = ref<Habit[]>(JSON.parse(localStorage.getItem('habits') || '[]'))

  const addHabit = (name: string) => {
    if (!name) return
    habits.value.push({ id: Date.now().toString(), name, records: {} })
    save()
  }

  const toggleHabitRecord = (habitId: string, date: string) => {
    const habit = habits.value.find((h) => h.id === habitId)
    if (!habit) return
    habit.records[date] = !habit.records[date]
    save()
  }

  const calculateStreak = (habit: Habit) => {
    const dates = Object.keys(habit.records).sort().reverse()
    let streak = 0
    for (const date of dates) {
      if (habit.records[date]) streak++
      else break
    }
    return streak
  }

  const calculateMonthlyCompletion = (habit: Habit, month: string) => {
    const days = Object.keys(habit.records).filter((d) => d.startsWith(month))
    const completed = days.filter((d) => habit.records[d]).length
    return days.length ? Math.round((completed / days.length) * 100) : 0
  }

  const save = () => localStorage.setItem('habits', JSON.stringify(habits.value))

  return { habits, addHabit, toggleHabitRecord, calculateStreak, calculateMonthlyCompletion }
})
