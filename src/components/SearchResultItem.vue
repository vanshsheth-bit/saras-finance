<template>
  <div 
    :class="[
      'result-item', 
      { 
        'result-item--dark': dark, 
        'result-item--expanded': expanded 
      }
    ]" 
    @click="toggle"
  >
    <div class="result-header">
      <div class="result-badge-container">
        <span :class="['result-badge', getBadgeClass()]">
          {{ item.source || 'Insight' }}
        </span>
        <span v-if="item.trend" class="result-trend">
          {{ item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '—' }}
        </span>
      </div>

      <span class="result-chevron" :class="{ 'result-chevron--expanded': expanded }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </div>

    <h3 class="result-title">{{ item.title }}</h3>
    <p class="result-snippet">{{ item.snippet }}</p>

    <transition name="fade">
      <div v-if="expanded" class="result-details">
        <p class="details-text">{{ item.description }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: Object,
  dark: {
    type: Boolean,
    default: false
  }
})

const expanded = ref(false)
const dark = props.dark

function toggle() {
  expanded.value = !expanded.value
}

function getBadgeClass() {
  const source = props.item.source?.toLowerCase() || ''
  if (source.includes('sec') || source.includes('filing')) return 'badge-sec'
  if (source.includes('federal') || source.includes('reserve')) return 'badge-fed'
  if (source.includes('news')) return 'badge-news'
  if (source.includes('market')) return 'badge-market'
  return 'badge-default'
}
</script>

<style scoped>
/* Card base styling with smooth transitions */
.result-item {
  border: 1px solid;
  padding: 20px 24px;
  margin-bottom: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  /* Light theme - WHITE card with dark text */
  background-color: #ffffff;
  border-color: #e5e7eb;
  color: #111827;
}

.result-item:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.1);
  transform: translateY(-2px);
}

/* Dark theme - DARK card with light text */
.result-item--dark {
  background-color: #1a2332;
  border-color: #2d3748;
  color: #f9fafb;
}

.result-item--dark:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.2);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.result-badge-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

/* Badge color schemes for light theme */
.badge-default {
  background-color: #e0f2fe;
  color: #0369a1;
}

.badge-sec {
  background-color: #dcfce7;
  color: #166534;
}

.badge-fed {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-news {
  background-color: #fce7f3;
  color: #9f1239;
}

.badge-market {
  background-color: #ede9fe;
  color: #5b21b6;
}

/* Badge color schemes for dark theme */
.result-item--dark .badge-default {
  background-color: rgba(14, 165, 233, 0.15);
  color: #38bdf8;
}

.result-item--dark .badge-sec {
  background-color: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.result-item--dark .badge-fed {
  background-color: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.result-item--dark .badge-news {
  background-color: rgba(236, 72, 153, 0.15);
  color: #f472b6;
}

.result-item--dark .badge-market {
  background-color: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.result-trend {
  font-size: 14px;
}

.result-chevron {
  display: flex;
  align-items: center;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.result-chevron--expanded {
  transform: rotate(180deg);
}

.result-item--dark .result-chevron {
  color: #6b7280;
}

.result-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.result-snippet {
  font-size: 15px;
  margin: 0;
  line-height: 1.6;
  transition: color 0.3s ease;
  
  /* Light theme */
  color: #6b7280;
}

.result-item--dark .result-snippet {
  /* Dark theme */
  color: #9ca3af;
}

.result-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid;
  transition: border-color 0.3s ease;
  
  /* Light theme */
  border-top-color: #e5e7eb;
}

.result-item--dark .result-details {
  /* Dark theme */
  border-top-color: #2d3748;
}

.details-text {
  font-size: 15px;
  margin: 0;
  line-height: 1.6;
  transition: color 0.3s ease;
  
  /* Light theme */
  color: #4b5563;
}

.result-item--dark .details-text {
  /* Dark theme */
  color: #d1d5db;
}

/* Transition for expand/collapse */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .result-item {
    padding: 16px 18px;
    margin-bottom: 12px;
  }

  .result-title {
    font-size: 16px;
  }

  .result-snippet {
    font-size: 14px;
  }

  .details-text {
    font-size: 14px;
  }
}
</style>