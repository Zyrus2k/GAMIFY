import type { ReactNode } from 'react'

interface SectionHeaderProps {
  kicker: string
  title: ReactNode
  description?: string
  action?: ReactNode
  align?: 'row' | 'stack'
}

export function SectionHeader({
  kicker,
  title,
  description,
  action,
  align = 'row',
}: SectionHeaderProps) {
  return (
    <div className={`section-head ${align === 'stack' ? 'section-head--stack' : ''}`}>
      <div className="section-head__copy">
        <p className="eyebrow">
          <span className="eyebrow__bar" aria-hidden="true" />
          {kicker}
        </p>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-desc">{description}</p>}
      </div>
      {action && <div className="section-head__action">{action}</div>}
    </div>
  )
}
