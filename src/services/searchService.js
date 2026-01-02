// src/services/searchService.js
// --------------------------------------------------------
// Wikipedia-powered search service.
// Uses the MediaWiki Action API to fetch search results
// and maps them into the shape expected by the UI.
// --------------------------------------------------------

import axios from 'axios'

const WIKIPEDIA_API_ENDPOINT = 'https://en.wikipedia.org/w/api.php'

/**
 * Strip basic HTML tags from a snippet returned by Wikipedia.
 * Wikipedia search snippets include <span class="searchmatch"> tags.
 *
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '')
}

/**
 * Fetch search results for a given query using the Wikipedia
 * Search API. This function uses sroffset for pagination and
 * simulates network latency so the Loader component has time
 * to appear, mimicking a real-world search experience.
 *
 * @param {string} query    - The text the user typed.
 * @param {number} offset   - Zero-based offset for pagination (sroffset).
 * @param {number} limit    - Maximum number of results to request.
 * @returns {Promise<{ results: Array, nextOffset: number|null, totalHits: number }>} 
 *   results    - Array of normalized result objects for the UI.
 *   nextOffset - Next sroffset to request, or null if there are no more results.
 *   totalHits  - Total number of hits reported by Wikipedia.
 */
export async function fetchSearchResults(query, offset = 0, limit = 10) {
  const trimmedQuery = (query || '').trim()

  if (!trimmedQuery) {
    return { results: [], nextOffset: 0, totalHits: 0 }
  }

  // Simulate real-world latency so loaders are visible.
  await new Promise((resolve) => setTimeout(resolve, 400))

  try {
    const { data } = await axios.get(WIKIPEDIA_API_ENDPOINT, {
      params: {
        action: 'query',
        list: 'search',
        format: 'json',
        origin: '*',
        srsearch: trimmedQuery,
        sroffset: offset,
        srlimit: limit
      }
    })

    const searchResults = data?.query?.search || []
    const totalHits = data?.query?.searchinfo?.totalhits ?? 0
    const nextOffset =
      typeof data?.continue?.sroffset === 'number' ? data.continue.sroffset : null

    const results = searchResults.map((item) => {
      const cleanSnippet = stripHtml(item.snippet)

      return {
        // Use Wikipedia pageid as a stable identifier
        id: String(item.pageid),
        title: item.title,
        // Map snippet to both snippet and description so that
        // the existing UI (title + snippet + expandable description)
        // continues to work without visual changes.
        snippet: cleanSnippet,
        description: cleanSnippet,
        // Source is fixed to "Wikipedia" to keep the existing badge UI.
        source: 'Wikipedia',
        // No trend information is available from Wikipedia.
        trend: null,
        // Expose raw pageid in case the UI wants to link out later.
        pageid: item.pageid
      }
    })

    return { results, nextOffset, totalHits }
  } catch (error) {
    console.error('Error fetching search results from Wikipedia:', error)
    return { results: [], nextOffset: null, totalHits: 0 }
  }
}