import type { LogoIconprops } from "../types/props"

export function HamburgerIcon({ className = "" } : LogoIconprops) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h22M5 16h22M5 24h22"/></svg>
  )
}