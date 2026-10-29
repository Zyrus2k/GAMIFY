import { useEffect } from 'react'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} · Deckout Cafe`
      : 'Deckout Cafe · TCG Club & Tournament Venue'
  }, [title])
}
