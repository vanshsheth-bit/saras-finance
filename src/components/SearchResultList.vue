<template>
  <div>
    <!-- Loop through all results and display each as a SearchResultItem -->
    <SearchResultItem
      v-for="item in results"
      :key="item.id"
      :item="item"
      :dark="dark"
    />
  </div>
</template>

<script setup>
import SearchResultItem from './SearchResultItem.vue'

// Receive array of results from parent (App.vue) and dark mode flag
const props = defineProps({
  results: {
    type: Array,
    required: true
  },
  dark: {
    type: Boolean,
    default: false
  }
})

// Expose dark flag for template usage
const dark = props.dark
</script>

<style scoped>
/* Optional: spacing or styling for the whole list */
</style>
