<script setup lang="ts">
import Calendar from '@/components/Calendar.vue'
</script>

<template>
  <main>
    <div class="container">
      <h2 class="title">Habit Tracker</h2>
      <Calendar />
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
  color: #333;
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>
