import { useId, type ReactNode } from 'react'
import type { GameSlug } from '../types'

type MotifProps = {
  game: GameSlug
  className?: string
}

export function GameMotif({ game, className }: MotifProps) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg
      className={className ?? 'game-motif'}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.34" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="66" fill={`url(#${uid}-glow)`} />
      {motifs[game](uid)}
    </svg>
  )
}

const line = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  vectorEffect: 'non-scaling-stroke' as const,
}

const motifs: Record<GameSlug, (uid: string) => ReactNode> = {
  bayblade: (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="80" cy="82" r="56" opacity="0.16" strokeDasharray="2 8" />
      <circle cx="80" cy="82" r="43" opacity="0.38" />
      <circle cx="80" cy="82" r="30" fill={`url(#${uid}-fade)`} opacity="0.8" />
      <path
        d="M80 27 96 43 112 39 108 55 124 69 112 82 116 99 99 98 86 115 80 98 62 110 58 94 40 94 47 78 30 68 45 56 42 38 60 42 68 26Z"
        fill="currentColor"
        fillOpacity="0.05"
        opacity="0.7"
      />
      <path d="M80 46 91 65 110 74 93 86 84 107 72 89 52 82 69 68Z" fill="currentColor" fillOpacity="0.14" />
      <circle cx="80" cy="82" r="10" fill="currentColor" fillOpacity="0.38" />
      <circle cx="80" cy="82" r="3.5" fill="currentColor" />
      <path d="M38 40c-12 10-19 24-20 40M122 120c-12 9-26 14-42 14" opacity="0.38" />
      <path d="M31 50 38 40 48 43M110 128l12-8-2-11" opacity="0.5" />
      <path d="M19 99h18M123 99h18M80 132v14" opacity="0.25" />
    </g>
  ),
  'cardfight-vanguard': (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <rect x="28" y="39" width="61" height="86" rx="5" transform="rotate(-17 58 82)" opacity="0.24" />
      <rect x="48" y="28" width="61" height="86" rx="5" transform="rotate(9 78 71)" opacity="0.36" />
      <rect x="62" y="34" width="64" height="91" rx="5" fill={`url(#${uid}-fade)`} opacity="0.88" />
      <path d="M72 49h44M72 57h39M72 65h26" opacity="0.45" />
      <path d="M80 98c7-7 7-14 2-20-4-5-2-11 4-15-1 9 11 11 12 21 1 9-7 18-18 18Z" fill="currentColor" fillOpacity="0.22" />
      <path d="M91 84c8 1 12 8 11 15" opacity="0.45" />
      <path d="M30 115 47 99M119 25l13-13M118 134l17 10" opacity="0.45" />
      <circle cx="123" cy="58" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="35" cy="69" r="2" fill="currentColor" opacity="0.55" />
      <path d="M25 88c-7 5-11 12-12 20M132 87c8 6 12 13 13 22" opacity="0.28" />
    </g>
  ),
  'cookie-run': (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M119 80c0 23-18 42-41 42-22 0-40-17-40-39 0-21 16-38 37-39 3 9 10 13 18 11 7-2 10-8 9-16 10 9 17 24 17 41Z"
        fill={`url(#${uid}-fade)`}
      />
      <path d="M34 91c-8 0-14-6-14-14s6-14 14-14M84 121c2 9-4 16-13 17-8 1-15-4-16-12" opacity="0.42" />
      <circle cx="54" cy="63" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="78" cy="54" r="3" fill="currentColor" opacity="0.45" />
      <circle cx="53" cy="91" r="3.5" fill="currentColor" opacity="0.55" />
      <circle cx="76" cy="98" r="5" fill="currentColor" opacity="0.68" />
      <circle cx="94" cy="78" r="2.7" fill="currentColor" opacity="0.4" />
      <path d="M67 72c3 3 7 4 11 2M59 106c4 3 9 3 12 0" opacity="0.45" />
      <path d="M118 34l3 10 10 3-10 3-3 10-3-10-10-3 10-3Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M29 36l2 6 6 2-6 2-2 6-2-6-6-2 6-2ZM129 103l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="currentColor" opacity="0.5" />
      <path d="M101 26c8-5 16-4 22 2M20 74c-5 4-7 9-7 15" opacity="0.3" />
    </g>
  ),
  cyberpunk: (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <path d="M80 19 124 44v72l-44 25-44-25V44Z" opacity="0.4" />
      <path d="M80 34 111 51v57l-31 18-31-18V51Z" fill={`url(#${uid}-fade)`} opacity="0.62" />
      <path d="M45 101V62l15-9v39l-15 9ZM100 50l15 9v39l-15-9V50Z" opacity="0.4" />
      <path d="M56 72h48M56 86h31M68 57h36" opacity="0.76" />
      <path d="M84 67v12h13V67H84Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M36 50 22 42M124 50l14-8M36 111l-14 8M124 111l14 8" opacity="0.4" />
      <path d="M19 64v18M141 64v18M63 24l17-9 17 9" opacity="0.5" />
      <circle cx="80" cy="112" r="3" fill="currentColor" opacity="0.9" />
      <path d="M63 119h34" opacity="0.2" />
    </g>
  ),
  riftbound: (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="80" cy="80" r="58" opacity="0.24" strokeDasharray="2 7" />
      <path d="M80 24c20 12 32 33 32 56s-12 44-32 56c-20-12-32-33-32-56s12-44 32-56Z" opacity="0.55" />
      <path d="M80 36c14 10 22 27 22 44s-8 34-22 44c-14-10-22-27-22-44s8-34 22-44Z" fill={`url(#${uid}-fade)`} />
      <path d="M24 80c12-17 32-27 56-27s44 10 56 27c-12 17-32 27-56 27S36 97 24 80Z" opacity="0.26" />
      <path d="M80 44 92 66 116 72 98 89 102 114 80 103 58 114 62 89 44 72 68 66Z" fill="currentColor" fillOpacity="0.14" />
      <circle cx="80" cy="80" r="14" fill="currentColor" fillOpacity="0.25" />
      <circle cx="80" cy="80" r="5" fill="currentColor" />
      <path d="M80 13v21M80 126v21M13 80h21M126 80h21" opacity="0.42" />
      <circle cx="122" cy="47" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="36" cy="116" r="2" fill="currentColor" opacity="0.5" />
    </g>
  ),
  pokemon: (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="80" cy="80" r="56" opacity="0.2" />
      <path d="M86 18 48 70h25l-9 41 41-60H79l7-33Z" fill={`url(#${uid}-fade)`} stroke="currentColor" strokeWidth="1.8" />
      <path d="M62 82h18M70 96h8" opacity="0.42" />
      <path d="M31 46 43 34 57 36M129 46 117 34 103 36M31 114l12 12 14-2M129 114l-12 12-14-2" opacity="0.55" />
      <circle cx="42" cy="88" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="124" cy="72" r="2.5" fill="currentColor" opacity="0.55" />
      <path d="M24 68c-7 4-11 10-12 18M137 94c6-6 9-13 8-21" opacity="0.28" />
      <path d="M57 28 64 19 70 29M99 133l7 9 7-9" opacity="0.45" />
    </g>
  ),
  mtg: (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <path d="M80 17 121 43v64l-41 26-41-26V43Z" opacity="0.42" />
      <path d="M80 31 109 49v52l-29 18-29-18V49Z" fill={`url(#${uid}-fade)`} opacity="0.7" />
      <circle cx="80" cy="80" r="34" opacity="0.32" />
      <path d="M80 43c11 12 19 18 19 30 0 13-9 23-19 29-10-6-19-16-19-29 0-12 8-18 19-30Z" fill="currentColor" fillOpacity="0.13" />
      <path d="M80 51v42M66 68l28 17M94 68 66 85" opacity="0.46" />
      <circle cx="80" cy="80" r="8" fill="currentColor" fillOpacity="0.28" />
      <circle cx="80" cy="80" r="3" fill="currentColor" />
      <path d="M65 24l15-11 15 11M65 136l15 11 15-11M20 55l7-19 18-6M140 55l-7-19-18-6" opacity="0.45" />
      <circle cx="80" cy="33" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="80" cy="127" r="2" fill="currentColor" opacity="0.6" />
    </g>
  ),
  'flesh-and-blood': (uid) => (
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <path d="M34 128 111 25l9 7-68 106Z" fill={`url(#${uid}-fade)`} />
      <path d="M126 128 49 25l-9 7 68 106Z" fill="currentColor" fillOpacity="0.04" opacity="0.8" />
      <path d="M29 126h24M107 126h24M41 38l-8-7M119 38l8-7" opacity="0.55" />
      <path d="M80 56 94 72 88 92 80 102 72 92 66 72Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M80 64v28M71 75h18" opacity="0.65" />
      <circle cx="80" cy="80" r="35" opacity="0.15" strokeDasharray="2 6" />
      <path d="M44 49c-9 7-14 16-16 27M116 49c9 7 14 16 16 27M52 116c-10-4-17-11-22-20M108 116c10-4 17-11 22-20" opacity="0.3" />
      <path d="M23 84h15M122 84h15" opacity="0.4" />
      <circle cx="80" cy="36" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="80" cy="124" r="3" fill="currentColor" opacity="0.5" />
    </g>
  ),
}
