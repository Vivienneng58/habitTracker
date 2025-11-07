<template>
  <div class="monthly-stats">
    <h4 class="title">Monthly Consistency</h4>
    <div class="chart-wrapper">
      <Bar
        v-if="chartData.datasets[0].data.length"
        :data="chartData"
        :options="chartOptions"
        :height="120"
      />
      <p v-else class="no-data">No habits yet. Add some to start tracking!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  allHabits: string[]
  habitMonthlyConsistency: (habit: string) => string
  habitColors: Record<string, string>
}>()

// 使用 habitColors 动态生成每个柱子的颜色
const chartData = computed(() => ({
  labels: props.allHabits,
  datasets: [
    {
      label: 'Completion (%)',
      data: props.allHabits.map(habit => Number(props.habitMonthlyConsistency(habit))),
      backgroundColor: props.allHabits.map(habit => props.habitColors[habit] || '#4CAF50'),
      borderRadius: 4,
      barThickness: 18,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 25,
        callback: (value: number) => value + '%',
        font: { size: 10 },
      },
      grid: { color: '#f1f1f1' },
    },
    x: {
      ticks: { font: { size: 10 } },
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.parsed.y.toFixed(1)}%`,
      },
    },
  },
}
</script>

<style scoped>
.monthly-stats {
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.chart-wrapper {
  height: 300px;
}

.no-data {
  color: #777;
  text-align: center;
  font-size: 12px;
  margin-top: 10px;
}
</style>
