import type { LogoIconprops } from "../types/props"

export function AddIcon({ className = "" } : LogoIconprops) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 25V7m-9 9h18"/></svg>
  )
}