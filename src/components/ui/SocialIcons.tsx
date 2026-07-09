type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.75h2.6l.39-3.02h-2.99V8.31c0-.87.24-1.47 1.5-1.47h1.6V4.14C16.3 4.1 15.3 4 14.13 4c-2.44 0-4.11 1.49-4.11 4.22v2.01H7.4v3.02h2.62V21h3.48Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4a1.68 1.68 0 1 0 0 3.36A1.68 1.68 0 0 0 5.5 4ZM20 20h-2.87v-5.9c0-1.41-.03-3.22-1.96-3.22-1.97 0-2.27 1.54-2.27 3.12V20H10.03V8.5h2.76v1.57h.04c.38-.73 1.32-1.5 2.72-1.5 2.9 0 3.45 1.91 3.45 4.4V20Z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.8 8.1a2.8 2.8 0 0 0-1.97-2C18.15 5.6 12 5.6 12 5.6s-6.15 0-7.83.5a2.8 2.8 0 0 0-1.97 2A29 29 0 0 0 1.7 12a29 29 0 0 0 .5 3.9 2.8 2.8 0 0 0 1.97 1.98c1.68.52 7.83.52 7.83.52s6.15 0 7.83-.52a2.8 2.8 0 0 0 1.97-1.98 29 29 0 0 0 .5-3.9 29 29 0 0 0-.5-3.9ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.24 3H21l-6.3 7.2L22.1 21h-6.2l-4.85-6.36L5.5 21H2.7l6.74-7.7L1.9 3h6.34l4.38 5.8L18.24 3Zm-1.08 16.2h1.72L7.9 4.7H6.05l11.1 14.5Z" />
    </svg>
  );
}
