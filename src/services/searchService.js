import axios from 'axios'

const WIKIPEDIA_API_ENDPOINT = 'https://en.wikipedia.org/w/api.php'

function stripHtml(html = '') {
  const withoutTags = html.replace(/<[^>]+>/g, ' ')

  return withoutTags
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}


export async function fetchSearchResults(query, offset = 0, limit = 10) {
  const trimmedQuery = (query || '').trim()

  if (!trimmedQuery) {
    return { results: [], nextOffset: 0, totalHits: 0 }
  }

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

    if (!searchResults.length) {
      return { results: [], nextOffset, totalHits }
    }

    
    const pageIds = searchResults.map((item) => item.pageid).join('|')

    let extractsById = {}

    try {
      const { data: extractData } = await axios.get(WIKIPEDIA_API_ENDPOINT, {
        params: {
          action: 'query',
          prop: 'extracts',
          exintro: 1,
          explaintext: 1,
          pageids: pageIds,
          format: 'json',
          origin: '*'
        }
      })

      const pages = extractData?.query?.pages || {}
      for (const pageId in pages) {
        if (Object.prototype.hasOwnProperty.call(pages, pageId)) {
          const extract = stripHtml(pages[pageId].extract || '')

          // Keep the description reasonably sized but longer than snippet.
          const maxDescriptionLength = 600
          extractsById[pageId] =
            extract.length > maxDescriptionLength
              ? extract.slice(0, maxDescriptionLength).trimEnd() + '…'
              : extract
        }
      }
    } catch (extractError) {
      
      console.warn('Failed to fetch Wikipedia extracts:', extractError)
    }

    const results = searchResults.map((item) => {
      const cleanSnippet = stripHtml(item.snippet)

      const maxSnippetLength = 160
      const shortSnippet =
        cleanSnippet.length > maxSnippetLength
          ? cleanSnippet.slice(0, maxSnippetLength).trimEnd() + '…'
          : cleanSnippet

      return {
        id: String(item.pageid),
        title: item.title,
        snippet: shortSnippet,
        // Prefer the longer extract when available; otherwise fall back
        // to the cleaned snippet so we always have something meaningful.
        description: extractsById[item.pageid] || cleanSnippet,
        source: 'Wikipedia',
        trend: null,
        pageid: item.pageid
      }
    })

    return { results, nextOffset, totalHits }
  } catch (error) {
    console.error('Error fetching search results from Wikipedia:', error)
    return { results: [], nextOffset: null, totalHits: 0 }
  }
}