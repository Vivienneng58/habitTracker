# Habit Tracker

## Project Choice

# The Habit Tracker with Calendar View

- **Product Details:** A habit tracking application with a primary calendar interface.
Users define habits and mark them complete on the calendar grid. The
application calculates and displays statistics like completion streaks and
monthly consistency.

- **Objective:** The objective is to build a motivational personal development tool
that helps users establish and maintain habits. The application will provide a
clear, visual representation of their progress through a calendar interface and
insightful statistics.

- **Target User:** An individual focused on personal development who wants a
visual and statistical way to track their daily or weekly habits.

## Justification of Tools

- **Vue 3 + Composition API**: Provides modular, reactive component design for building a clean and maintainable frontend.
- **Chart.js + vue-chartjs**: Offers a simple and flexible way to render statistical visualizations like bar and line charts.
- **TypeScript**: Adds type safety and improves code readability.
- **LocalStorage**: Used for simple data persistence without a backend.

## High-Level Approach

The project was built using a **component-based approach**:

- `Habit.vue` → Displays and manages the list of habits.
- `Calendar.vue` → Displays the monthly calendar view where users can mark habits as complete.
- `Consistency.vue` → Renders a monthly consistency chart using Chart.js.
- `HabitTracker.vue` → Acts as the main controller handling all data, logic, and local storage.

Data flow:

1. The user adds a new habit → stored in `localStorage`.
2. On date click → user selects which habits were completed.
3. The consistency chart dynamically calculates completion % using computed properties.

## Final Prompts

Build a Vue 3 + TypeScript Habit Tracker with a calendar view that allows users to mark daily completions, track streaks, and visualize monthly consistency with Chart.js. Use localStorage for persistence and ensure the UI updates reactively across all components.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Challenges & Iterations

1. Calendar Reactivity Issues

Challenge:
The calendar view didn’t update immediately when a user marked or unmarked a habit. The reactivity between components wasn’t working as expected.

Iteration:
I fixed this by restructuring the data flow between habitTracker.vue and calendar.vue, using reactive() and computed() properly to ensure Vue’s reactivity system tracked updates correctly.

2. v-model Binding Problems

Challenge:
Some input fields cleared their values after losing focus due to incorrect v-model setup in custom components.

Iteration:
I rewrote these components using the Composition API with proper two-way binding (defineModel()), ensuring stable synchronization between parent and child components.

3. Chart Visualization Optimization

Challenge:
The monthly consistency chart was cluttered and hard to read when multiple habits were tracked.

Iteration:
I optimized the chart layout by reducing bar thickness, limiting visible tick labels, and adjusting axis intervals for a cleaner, more readable visualization.
