<template>
  <aside class="habit-sidebar">
    <h3 class="sidebar-title">Habits</h3>

    <ul class="habit-list">
      <li
        v-for="habit in allHabits"
        :key="habit"
        class="habit-item"
        :class="{ selected: selectedHabit === habit }"
      >
        <div class="habit-info" @click="$emit('select', habit)">
          <div class="habit-name">{{ habit }}</div>
          <div class="habit-streak">🔥 {{ habitStreak(habit) }} days</div>
        </div>

        <button class="delete-btn" title="Delete habit" @click.stop="$emit('delete', habit)">
          ✕
        </button>
      </li>
    </ul>

    <button class="add-habit-btn" @click="$emit('add')">＋ Add Habit</button>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  allHabits: string[]
  selectedHabit: string | null
  habitStreak: (habit: string) => number
}>()

defineEmits(['select', 'delete', 'add'])
</script>

<style scoped>
/* === 容器整体 === */
.habit-sidebar {
  width: 200px;
  background: #f9fbfd;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: fit-content;
}

/* === 标题 === */
.sidebar-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
}

/* === 列表 === */
.habit-list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 8px;
  transition: all 0.25s ease;
  cursor: pointer;
}

/* === 习惯信息 === */
.habit-info {
  flex: 1;
  overflow: hidden;
}

.habit-name {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.habit-streak {
  font-size: 12px;
  color: #ff7043;
  margin-top: 2px;
}

/* === 删除按钮 === */
.delete-btn {
  background: transparent;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #ffecec;
  color: #e53935;
}

/* === 添加按钮 === */
.add-habit-btn {
  margin-top: 10px;
  width: 100%;
  background: #007bff;
  color: white;
  font-weight: 500;
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.25s ease,
    transform 0.1s ease;
}

.add-habit-btn:hover {
  background: #0062cc;
  transform: translateY(-1px);
}
</style>
