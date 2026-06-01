import { create } from 'zustand'
import { storage } from '@/lib/storage'

interface SettingsState {
  theme: 'light' | 'dark'
  defaultView: 'list' | 'calendar'

  loadSettings: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setDefaultView: (view: 'list' | 'calendar') => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'light',
  defaultView: 'list',

  loadSettings: () => {
    const settings = storage.getSettings()
    set({
      theme: settings.theme as 'light' | 'dark',
      defaultView: settings.defaultView as 'list' | 'calendar',
    })
  },

  setTheme: (theme) => {
    storage.setSettings({ theme, defaultView: get().defaultView })
    set({ theme })
  },

  setDefaultView: (defaultView) => {
    storage.setSettings({ theme: get().theme, defaultView })
    set({ defaultView })
  },
}))
