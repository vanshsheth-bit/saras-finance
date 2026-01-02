<template>
  <div class="loader-wrapper">
    <div :class="['loader-spinner', { 'loader-spinner--dark': dark }]"></div>
    <p :class="['loader-text', { 'loader-text--dark': dark }]">
      <slot>Searching financial data...</slot>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  dark: {
    type: Boolean,
    default: false
  }
})

const dark = props.dark
</script>

<style scoped>
.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 0;
}

.loader-spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  border-top-color: #0ea5e9;
  animation: spin 0.8s linear infinite;
}

.loader-spinner--dark {
  border-color: #374151;
  border-top-color: #0ea5e9;
}

.loader-text {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
}

.loader-text--dark {
  color: #9ca3af;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .loader-wrapper {
    padding: 32px 0;
  }

  .loader-spinner {
    width: 40px;
    height: 40px;
  }

  .loader-text {
    font-size: 14px;
  }
}
</style>