<template>
  <div class="habit-sidebar">
    <h3>Habits</h3>
    <ul class="habit-list-side">
      <li
        v-for="habit in allHabits"
        :key="habit"
        :class="{ selected: selectedHabit === habit }"
      >
        <div class="habit-info" @click="$emit('select', habit)">
          <div class="habit-name">{{ habit }}</div>
          <div class="habit-streak">🔥 {{ habitStreak(habit) }} days</div>
        </div>
        <button class="delete-btn" @click="$emit('delete', habit)">X</button>
      </li>
    </ul>

    <button class="add-habit-btn" @click="$emit('add')">＋ Add Habit</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  allHabits: string[]
  selectedHabit: string | null
  habitStreak: (habit: string) => number
}>()

defineEmits(["select", "delete", "add"])
</script>

<style scoped>
.habit-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  height: fit-content;
}

.habit-list-side {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.habit-list-side li {
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
}

.habit-list-side li.selected {
  border: 2px solid #007bff;
  background: #e8f0fe;
}

.habit-info {
  flex: 1;
  cursor: pointer;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #888;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ff4444;
}

.habit-streak {
  font-size: 13px;
  color: #ff5722;
}

.add-habit-btn {
  margin-top: 10px;
  width: 100%;
  background: #007bff;
  color: white;
  padding: 6px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-habit-btn:hover {
  background: #0056b3;
}
</style>
