'use client'

import Link from 'next/link'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  id: string
  children: React.ReactNode
}

export function TermsCheckbox({ checked, onChange, id, children }: Props) {
  return (
    <label
      htmlFor={id}
      className="mt-4 flex cursor-pointer items-start gap-3 text-sm font-semibold leading-snug text-soft-charcoal/85"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 rounded border-[#ead8c2] accent-hai-blue"
      />
      <span>{children}</span>
    </label>
  )
}

export function LegalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-hai-blue hover:underline"
    >
      {children}
    </Link>
  )
}
