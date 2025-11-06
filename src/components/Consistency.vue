<template>
  <div class="monthly-stats">
    <h4>Monthly Consistency</h4>
    <ul>
      <li v-for="habit in allHabits" :key="habit">
        {{ habit }} — {{ habitMonthlyConsistency(habit) }}%
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  allHabits: string[]
  habitMonthlyConsistency: (habit: string) => string
}>()
</script>

<style scoped>
.monthly-stats {
  margin-top: 20px;
  background: #f9fafb;
  border-radius: 6px;
  padding: 10px;
}
</style>
