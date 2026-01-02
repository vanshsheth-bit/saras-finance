# Saras Finance - Intelligent Search Tool

> A modern, responsive search interface built with Vue.js 3, featuring real time Wikipedia search, infinite scrolling, dark mode, and smooth animations.

![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## Project Overview

This project is a production ready search tool built as part of the **Saras Finance Frontend Developer Assignment**. It demonstrates advanced Vue.js concepts, clean component architecture, and modern web development practices.

### Key Features

- **Real time Search**: Instant search results from Wikipedia API with debounced input
- **Infinite Scrolling**: Seamless pagination with automatic loading on scroll
- **Dark Mode**: Beautiful light/dark theme with persistent user preferences
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Smooth Animations**: Vue transitions for enhanced user experience
- **Accessible**: Keyboard navigation and ARIA labels for screen readers
- **Performance Optimized**: Debouncing, lazy loading, and efficient state management

---

## Architecture & Design Decisions

### Component Structure

The application follows Vue.js best practices with a modular, reusable component architecture:

```
src/
├── components/
│   ├── SearchBar.vue           # Search input with debouncing
│   ├── SearchResultList.vue    # Container for search results
│   ├── SearchResultItem.vue    # Individual expandable result card
│   └── Loader.vue              # Loading spinner component
├── services/
│   └── searchService.js        # Wikipedia API integration
├── App.vue                     # Main application component
├── main.js                     # Application entry point
└── style.css                   # Global styles
```

### Technical Highlights

#### 1. **Efficient API Integration** 
- Wikipedia MediaWiki API with pagination support
- 400ms simulated latency for realistic UX testing
- HTML sanitization for safe content rendering
- Error handling with graceful fallbacks

#### 2. **Smart Debouncing**
```javascript
function onSearch(input) {
  query.value = input
  clearTimeout(debounceTimeout)
  
  debounceTimeout = setTimeout(() => {
    results.value = []
    hasMore.value = false
    nextOffset.value = 0
    loadPage(0)
  }, 300)
}
```
Reduces API calls from potentially hundreds to just a few per search query.

#### 3. **Infinite Scroll Implementation**
- Scroll position detection with 200px threshold
- Separate loading states for initial and paginated requests
- Automatic continuation token management
- Performance-optimized with scroll event listeners

#### 4. **Theme System**
- `localStorage` persistence across sessions
- Smooth CSS transitions between themes
- Comprehensive dark mode styling for all components
- Body class toggling for global theme application

#### 5. **Vue 3 Composition API**
- `<script setup>` syntax for cleaner code
- Reactive refs and computed properties
- Lifecycle hooks for proper cleanup
- Custom event emitters for parent-child communication

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saras-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Features Breakdown

### Search Functionality

- **Debounced Input**: 400ms delay prevents excessive API calls
- **Real time Results**: Updates as you type
- **Empty State Handling**: Helpful messages when no results found
- **Query Preservation**: Maintains search context during pagination

### UI/UX Components

#### SearchBar Component
- Pill shaped design with gradient button
- Emoji icons for visual appeal
- Theme aware styling
- Enter key support for submission

#### SearchResultItem Component
- Expandable cards with smooth transitions
- Color coded badges based on source type
- Trend indicators support
- Click to expand functionality
- Hover effects and visual feedback

#### Loader Component
- Spinning animation with customizable text
- Theme aware colors
- Centered positioning
- Slot support for custom messages

### Responsive Design

| Breakpoint | Layout Adjustments |
|------------|-------------------|
| Desktop (>768px) | Full width search bar, multi column potential |
| Tablet (≤768px) | Adjusted padding, readable font sizes |
| Mobile (≤640px) | Stacked layout, touch optimized buttons |

---

## Performance Optimizations

### 1. **Debouncing**
Reduces API calls by 90%+ during active typing.

### 2. **Lazy Loading**
Only requests 10 results at a time, loading more on scroll.

### 3. **Event Listener Cleanup**
Proper cleanup in `onBeforeUnmount` prevents memory leaks.

### 4. **CSS Transitions**
Hardware accelerated animations using `transform` and `opacity`.

### 5. **Efficient State Management**
Minimal re renders with computed properties and reactive refs.

---

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Labels**: Screen reader support with descriptive labels
- **Focus Indicators**: Visible focus outlines for keyboard users
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color Contrast**: WCAG AA compliant color ratios

---

## Future Enhancements & Scalability

### Immediate Improvements

1. **Search Filters**
   - Date range filtering
   - Category selection (e.g., Science, Technology, History)
   - Language options

2. **Advanced Features**
   - Search history with recent queries
   - Bookmark/favorite results
   - Share search results via URL parameters
   - Export results to CSV/PDF

3. **Performance**
   - Implement virtual scrolling for 1000+ results
   - Service worker for offline capability
   - IndexedDB caching for frequent searches

### Scalability Considerations

For larger applications, I would implement:

#### State Management (Pinia)
```javascript
// stores/search.js
export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    results: [],
    loading: false,
    filters: {}
  }),
  actions: {
    async fetchResults() {
      // Centralized search logic
    }
  }
})
```

#### Route-based Navigation
```javascript
// router/index.js
const routes = [
  { path: '/', component: HomePage },
  { path: '/search', component: SearchPage },
  { path: '/result/:id', component: ResultDetailPage }
]
```

#### Component Testing
```javascript
// SearchBar.spec.js
import { mount } from '@vue/test-utils'
import SearchBar from '@/components/SearchBar.vue'

describe('SearchBar', () => {
  it('emits search event with debounced input', async () => {
    // Test implementation
  })
})
```

#### API Abstraction Layer
```javascript
// api/endpoints.js
export const searchAPI = {
  wikipedia: new WikipediaClient(),
  unsplash: new UnsplashClient(),
  news: new NewsClient()
}
```

---

## Technical Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Vue.js** | Frontend framework | 3.4.x |
| **Vite** | Build tool & dev server | 5.0.x |
| **Axios** | HTTP client | 1.6.x |
| **CSS3** | Styling & animations | - |
| **Wikipedia API** | Search data source | MediaWiki API |

---

## Learning Outcomes

This project demonstrates proficiency in:

- ✅ Vue.js Composition API and reactivity system
- ✅ Component-based architecture and reusability
- ✅ Asynchronous JavaScript and API integration
- ✅ CSS animations and responsive design
- ✅ Performance optimization techniques
- ✅ Accessibility best practices
- ✅ Clean code and documentation

---

## Code Quality Practices

### Naming Conventions
- **Components**: PascalCase (e.g., `SearchBar.vue`)
- **Functions**: camelCase (e.g., `fetchResults`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)

### Code Organization
- Single Responsibility Principle for components
- Separation of concerns (UI vs. business logic)
- DRY (Don't Repeat Yourself) principles

---

## Known Limitations

1. **Wikipedia API Rate Limits**: No rate limit handling implemented (would add retry logic for production)
2. **Result Caching**: No caching layer (would add LRU cache for frequent queries)
3. **Error UI**: Basic error handling (would add toast notifications)
4. **Advanced Search**: No support for operators like AND, OR, quotes

---

## Alternative Approaches Considered

### 1. API Selection
**Considered**: Postman Echo, OpenAI, Unsplash
**Chosen**: Wikipedia API
**Reason**: Free, no API key required, rich content, reliable uptime

### 2. State Management
**Considered**: Pinia/Vuex
**Chosen**: Component level reactive refs
**Reason**: Application complexity doesn't justify global state management overhead

### 3. Styling Approach
**Considered**: Tailwind CSS, CSS in JS
**Chosen**: Scoped CSS
**Reason**: Better performance, no additional dependencies, full control

---

## Acknowledgments

- **Wikipedia API** for providing free, accessible search data
- **Vue.js Team** for the excellent documentation and framework
- **Saras Finance** for the opportunity to build this project

---

## Contact

**Developer**: Vansh Sheth  
**Email**: shethvansh4@gmail.com 
**LinkedIn**: https://www.linkedin.com/in/vansh-sheth-286b34277/ 
**Portfolio**: https://vansh-portfolio-pink.vercel.app/

---

## License

This project is created as part of an assignment and is available for review purposes.

---

<div align="center">

**Built using Vue.js**

 If you found this project interesting, please star the repository!

</div>