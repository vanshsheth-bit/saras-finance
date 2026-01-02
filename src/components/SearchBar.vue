<template>
  <!-- Search pill container with proper theme transitions -->
  <div :class="['search-pill', { 'search-pill--dark': dark }]">
    <span class="search-icon">🔍</span>
    <input
      v-model="localValue"
      type="text"
      :class="['search-input', { 'search-input--dark': dark }]"
      placeholder="Search for stocks, companies, or finance topics..."
      @input="emitSearch"
      @keydown.enter.prevent="emitSearch"
    />
    <button
      type="button"
      class="search-button"
      @click="emitSearch"
    >
      Search
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  dark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search'])
const localValue = ref('')

function emitSearch() {
  emit('search', localValue.value)
}

const dark = props.dark
</script>

<style scoped>
/* Outer pill with smooth transitions */
.search-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  max-width: 800px;
  width: 100%;
  /* Light theme - WHITE background */
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.search-pill--dark {
  /* Dark theme - DARK background */
  background-color: #1a2332;
  border-color: #2d3748;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.search-icon {
  font-size: 18px;
  color: #64748b;
  transition: color 0.3s ease;
}

.search-pill--dark .search-icon {
  color: #9ca3af;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  /* Light theme - DARK text */
  color: #111827;
  font-size: 15px;
  transition: color 0.3s ease;
}

.search-input::placeholder {
  color: #9ca3af;
  transition: color 0.3s ease;
}

/* Dark theme - LIGHT text */
.search-input--dark {
  color: #f9fafb;
}

.search-input--dark::placeholder {
  color: #6b7280;
}

.search-button {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid #0ea5e9;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
  transition: all 0.2s ease;
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
  filter: brightness(1.05);
}

.search-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.3);
}

@media (max-width: 640px) {
  .search-pill {
    padding: 8px 10px;
  }

  .search-input {
    font-size: 14px;
  }

  .search-button {
    padding: 7px 14px;
    font-size: 13px;
  }
}
</style>