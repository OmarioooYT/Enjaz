/**
 * Enjaz — Tailwind CSS theme (colors and fonts) shared by both pages.
 *
 * Copyright (C) 2026 Omariooo
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Enjaz, free software released under the GNU General
 * Public License v3.0 or later. See the LICENSE file for details.
 */

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Cairo', 'Inter', 'sans-serif'],
        display: ['Cairo', '"IBM Plex Sans Arabic"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        obsidian: '#07070A',
        surface: '#0E0E13',
        surfaceElevated: '#14141B',
        surfaceHover: '#1A1A23',
        borderSubtle: 'rgba(255, 255, 255, 0.08)',
        brand: {
          DEFAULT: '#FC6A0D',
          hover: '#FF7D29',
          dark: '#D95605',
          soft: 'rgba(252, 106, 13, 0.14)',
        }
      }
    }
  }
}
