// Hex to OKLch conversion pipeline: hex -> sRGB -> linear sRGB -> OKLab -> OKLch

export interface OklchColor {
  l: number // 0-1 lightness
  c: number // 0-0.4 chroma
  h: number // 0-360 hue
}

// sRGB [0-1] -> linear sRGB
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

// Parse "#RRGGBB" to [r, g, b] in 0-1
export function hexToSrgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

// sRGB -> OKLab
function srgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  return [L, a, bVal]
}

// OKLab -> OKLch
function oklabToOklch(L: number, a: number, b: number): OklchColor {
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h }
}

export function hexToOklch(hex: string): OklchColor {
  const [r, g, b] = hexToSrgb(hex)
  const [L, a, bVal] = srgbToOklab(r, g, b)
  return oklabToOklch(L, a, bVal)
}

// Format OKLch as CSS string
export function oklchString(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(4)} ${h.toFixed(1)})`
}

// Generate a full palette from a hex primary color
export interface PaletteVariables {
  light: Record<string, string>
  dark: Record<string, string>
}

export function generatePaletteFromHex(hex: string): PaletteVariables {
  const { c, h } = hexToOklch(hex)
  const clampedC = Math.max(0.02, Math.min(c, 0.2))

  return {
    light: {
      '--primary': oklchString(0.69, clampedC, h),
      '--primary-foreground': 'oklch(1 0 0)',
      '--secondary': oklchString(0.97, Math.min(clampedC * 0.07, 0.015), h),
      '--secondary-foreground': 'oklch(0 0 0)',
      '--accent': oklchString(0.94, Math.min(clampedC * 0.2, 0.04), h),
      '--accent-foreground': 'oklch(0 0 0)',
      '--ring': oklchString(0.69, clampedC, h),
      '--sidebar': oklchString(0.97, Math.min(clampedC * 0.07, 0.015), h),
      '--sidebar-foreground': 'oklch(0 0 0)',
      '--sidebar-primary': oklchString(0.69, clampedC, h),
      '--sidebar-primary-foreground': 'oklch(1 0 0)',
      '--sidebar-accent': oklchString(0.94, Math.min(clampedC * 0.2, 0.04), h),
      '--sidebar-accent-foreground': 'oklch(0 0 0)',
      '--sidebar-ring': oklchString(0.69, clampedC, h),
      '--chart-1': oklchString(0.69, clampedC, h),
      '--chart-2': oklchString(0.94, Math.min(clampedC * 0.2, 0.04), h),
      '--chart-3': oklchString(0.97, Math.min(clampedC * 0.07, 0.015), h),
    },
    dark: {
      '--primary': oklchString(0.69, clampedC, h),
      '--primary-foreground': 'oklch(1 0 0)',
      '--secondary': oklchString(0.25, Math.min(clampedC * 0.07, 0.015), h),
      '--secondary-foreground': 'oklch(0.96 0 0)',
      '--accent': oklchString(0.3, Math.min(clampedC * 0.15, 0.03), h),
      '--accent-foreground': 'oklch(0.96 0 0)',
      '--ring': oklchString(0.69, clampedC, h),
      '--sidebar': 'oklch(0.18 0 0)',
      '--sidebar-foreground': 'oklch(0.96 0 0)',
      '--sidebar-primary': oklchString(0.69, clampedC, h),
      '--sidebar-primary-foreground': 'oklch(1 0 0)',
      '--sidebar-accent': oklchString(0.25, Math.min(clampedC * 0.07, 0.015), h),
      '--sidebar-accent-foreground': 'oklch(0.96 0 0)',
      '--sidebar-ring': oklchString(0.69, clampedC, h),
      '--chart-1': oklchString(0.69, clampedC, h),
      '--chart-2': oklchString(0.94, Math.min(clampedC * 0.2, 0.04), h),
      '--chart-3': oklchString(0.55, Math.min(clampedC * 0.5, 0.08), h),
    },
  }
}

// Apply CSS variables to document
export function applyVariablesToDocument(variables: Record<string, string>): void {
  const root = document.documentElement
  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value)
  }
}

// Clear runtime CSS variable overrides (revert to stylesheet defaults)
export function clearVariableOverrides(variableNames: string[]): void {
  const root = document.documentElement
  for (const name of variableNames) {
    root.style.removeProperty(name)
  }
}
