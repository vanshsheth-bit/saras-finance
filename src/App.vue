<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import SearchBar from './components/SearchBar.vue'
import SearchResultList from './components/SearchResultList.vue'
import Loader from './components/Loader.vue'
import { fetchSearchResults } from './services/searchService.js'

const results = ref([])
const query = ref('')

// Wikipedia pagination is driven by an offset (sroffset).
// We keep track of the "next offset" to request when loading
// additional pages via infinite scroll.
const nextOffset = ref(0)

// Number of results to request per page from Wikipedia.
const perPage = 10

const loadingInitial = ref(false)
const loadingMore = ref(false)
const hasMore = ref(false)
let debounceTimeout = null

const isDark = ref(true)
const THEME_STORAGE_KEY = 'app-theme'

async function loadPage(offsetToUse = 0) {
  if (!query.value.trim()) {
    results.value = []
    hasMore.value = false
    nextOffset.value = 0
    return
  }

  const isFirstPage = offsetToUse === 0
  if (isFirstPage) {
    loadingInitial.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const { results: newResults, nextOffset: apiNextOffset } = await fetchSearchResults(
      query.value,
      offsetToUse,
      perPage
    )

    if (isFirstPage) {
      results.value = newResults
    } else {
      results.value = [...results.value, ...newResults]
    }

    // Determine if there are more results available.
    hasMore.value = !!apiNextOffset && newResults.length > 0
    nextOffset.value = apiNextOffset ?? 0
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

function onSearch(input) {
  query.value = input
  clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    results.value = []
    hasMore.value = false
    nextOffset.value = 0
    loadPage(0)
  }, 400)
}

async function fetchNextPage() {
  if (loadingMore.value || loadingInitial.value || !hasMore.value) {
    return
  }

  await loadPage(nextOffset.value)
}

function handleScroll() {
  if (!hasMore.value || loadingMore.value || loadingInitial.value) {
    return
  }

  const scrollPosition = window.innerHeight + window.scrollY
  const threshold = document.body.offsetHeight - 200

  if (scrollPosition >= threshold) {
    fetchNextPage()
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
}

function goHome() {
  // Reset search state to initial "homepage" view
  query.value = ''
  results.value = []
  nextOffset.value = 0
  hasMore.value = false
  loadingInitial.value = false
  loadingMore.value = false

  // Smoothly scroll back to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'dark') {
    isDark.value = true
  } else if (storedTheme === 'light') {
    isDark.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(debounceTimeout)
})

watch(isDark, (value) => {
  const theme = value ? 'dark' : 'light'
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  document.body.classList.toggle('body-dark', value)
})
</script>

<template>
  <div :class="['app-root', { 'app-root--dark': isDark }]">
    <!-- Fixed Header -->
    <header :class="['app-header-fixed', { 'app-header-fixed--dark': isDark }]">
      <div class="app-header-content">
        <div class="app-header-left" @click="goHome">
          <div class="app-logo">
            <span class="app-logo-icon">📈</span>
          </div>
          <div class="app-brand">
            <span class="app-brand-title">Saras <span>Finance</span></span>
            <span class="app-brand-subtitle">Intelligent Search</span>
          </div>
        </div>

        <button
          type="button"
          class="theme-toggle"
          :class="{ 'theme-toggle--dark': isDark }"
          @click="toggleTheme"
          aria-label="Toggle dark mode"
        >
          {{ isDark ? '🌙' : '☀️' }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div :class="['app-container', { 'app-container--dark': isDark, 'app-container--searching': query.trim() && results.length > 0 }]">
      <div class="app">
        <!-- Hero section - hide when searching -->
        <section v-if="!query.trim() || results.length === 0" class="hero">
          <h1 class="hero-title">Search Smarter, Not Harder</h1>
          <p class="hero-subtitle">
            Instant results from articles, tutorials, and content across the web.
          </p>
        </section>

        <!-- Search area -->
        <section class="search-section" :class="{ 'search-section--compact': query.trim() && results.length > 0 }">
          <SearchBar :dark="isDark" @search="onSearch" />
        </section>

        <!-- Results count -->
        <div v-if="!loadingInitial && query.trim() && results.length > 0" class="results-count">
          Found {{ results.length }} results
        </div>

        <!-- Initial loader while we fetch the first page for a query -->
        <div class="content-area">
          <Loader v-if="loadingInitial" :dark="isDark" />

          <!-- When not loading, show helper / empty states or the results list -->
          <div v-else>
            <!-- Helper text before user starts typing -->
            <p
              v-if="!query.trim()"
              :class="['state-message', { 'state-message--dark': isDark }]"
            >
              Type something above to start searching.
            </p>

            <!-- No results message once a search has been performed -->
            <p
              v-else-if="results.length === 0"
              :class="['state-message', { 'state-message--dark': isDark }]"
            >
              No results found for "{{ query }}".
            </p>

            <!-- Results list once initial loading is done and we have items -->
            <SearchResultList v-else :results="results" :dark="isDark" />
          </div>
        </div>

        <!-- Bottom loader shown when loading more pages (infinite scroll) -->
        <Loader v-if="loadingMore && !loadingInitial" :dark="isDark" />
      </div>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.app-root {
  min-height: 100vh;
  background: #f8f9fa;
  transition: background-color 0.3s ease;
}

.app-root--dark {
  background: #0a0e1a;
}

/* Fixed Header */
.app-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.app-header-fixed--dark {
  background: #0f1419;
  border-bottom-color: #1e2937;
}

.app-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.app-logo-icon {
  font-size: 24px;
}

.app-brand-title {
  font-weight: 700;
  font-size: 20px;
  color: #111827;
  display: block;
}

.app-header-fixed--dark .app-brand-title {
  color: #f9fafb;
}

.app-brand-title span {
  color: #0ea5e9;
}

.app-brand-subtitle {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.app-header-fixed--dark .app-brand-subtitle {
  color: #9ca3af;
}

/* Theme toggle button */
.theme-toggle {
  padding: 10px 14px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  cursor: pointer;
  font-size: 18px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: #f3f4f6;
  transform: scale(1.05);
}

.theme-toggle.theme-toggle--dark {
  background: #1e2937;
  border-color: #374151;
  color: #f9fafb;
}

.theme-toggle.theme-toggle--dark:hover {
  background: #2d3748;
}

/* Main Container */
.app-container {
  padding-top: 80px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  transition: padding-top 0.3s ease;
}

.app-container--searching {
  padding-top: 100px;
}

.app {
  width: 100%;
  max-width: 1100px;
  padding: 40px 24px;
  transition: all 0.3s ease;
}

/* Hero section */
.hero {
  text-align: center;
  margin-bottom: 48px;
  padding: 60px 20px;
  background: radial-gradient(circle at top, rgba(14, 165, 233, 0.1), transparent 70%);
  border-radius: 24px;
  transition: all 0.3s ease;
}

.app-root--dark .hero {
  background: radial-gradient(circle at top, rgba(14, 165, 233, 0.15), transparent 70%);
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 16px 0;
  color: #111827;
  line-height: 1.2;
}

.app-root--dark .hero-title {
  color: #f9fafb;
}

.hero-subtitle {
  font-size: 18px;
  max-width: 700px;
  margin: 0 auto;
  color: #6b7280;
  line-height: 1.6;
}

.app-root--dark .hero-subtitle {
  color: #9ca3af;
}

/* Search section */
.search-section {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-section--compact {
  margin-bottom: 24px;
}

/* Results count */
.results-count {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 20px;
  font-weight: 500;
}

.app-root--dark .results-count {
  color: #9ca3af;
}

/* Content area */
.content-area {
  margin-top: 12px;
}

/* Helper / empty state messages */
.state-message {
  margin-top: 40px;
  font-size: 16px;
  color: #6b7280;
  text-align: center;
}

.state-message.state-message--dark {
  color: #9ca3af;
}

/* Light theme card appearance: ensure result cards are white like the reference UI */
.app-root:not(.app-root--dark) .result-item {
  background-color: #ffffff;
  border-color: #e5e7eb;
  color: #111827;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .app-header-content {
    padding: 12px 16px;
  }

  .app-logo {
    width: 40px;
    height: 40px;
  }

  .app-logo-icon {
    font-size: 20px;
  }

  .app-brand-title {
    font-size: 18px;
  }

  .app-brand-subtitle {
    font-size: 11px;
  }

  .theme-toggle {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .app {
    padding: 20px 16px;
  }

  .hero {
    padding: 40px 16px;
    margin-bottom: 32px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 15px;
  }
}
</style>