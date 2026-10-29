export function BrandMark({ className = 'brand__mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="11" fill="currentColor" opacity="0.08" />
      <rect x="1" y="1" width="38" height="38" rx="11" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <path
        d="M13.5 11.5h9.2c4.4 0 7.3 2.2 7.3 6.1 0 3.9-2.9 6.1-7.3 6.1h-4.5v5.8h-4.7V11.5Z"
        fill="currentColor"
      />
      <path d="M18.2 15.6h4.2c1.8 0 2.9.7 2.9 2s-1.1 2-2.9 2h-4.2v-4Z" fill="var(--brand-cut, #101114)" />
      <path d="M10 7.5h5.5M10 32.5h5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M29 30.5c1.8 0 3.2-1.4 3.2-3.2v-2.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`brand-lockup ${footer ? 'brand-lockup--footer' : ''}`}>
      <BrandMark />
      <span className="brand__text">
        <span className="brand__name">DECKOUT</span>
        <span className="brand__sub">CAFE · TCG CLUB</span>
      </span>
    </span>
  )
}
