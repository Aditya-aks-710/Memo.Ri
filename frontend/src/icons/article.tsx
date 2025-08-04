import type { LogoIconprops } from "../types/props"

export function ArticleIcon({ className = "" } : LogoIconprops) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 8h2m-2 4h2m-5 4H7m14-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7M7 8v4h4V8H7z"/><path d="M19.268 19.268a2.5 2.5 0 1 0-3.536-3.536a2.5 2.5 0 0 0 3.536 3.536zm0 0L21 21"/></g></svg>
  )
}