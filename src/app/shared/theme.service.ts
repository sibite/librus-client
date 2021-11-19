import { Injectable, Renderer2 } from "@angular/core";

type ThemeType = 'dark' | 'light' | 'auto';

@Injectable({providedIn: 'root'})
export class ThemeService {
  private _theme;
  private _prefersTheme: ThemeType;

  get theme() {
    return this._theme;
  }

  constructor() {
    this.refreshTheme();
    window.matchMedia(('prefers-color-scheme: dark')).addEventListener('change', media => {
      this._theme = media.matches ? 'dark' : 'light';
    })
  }

  refreshTheme() {
    let localTheme = this.getLocalPreference();
    if (localTheme === 'auto' && window.matchMedia) {
      let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('isDark', isDark);
      this._theme = isDark ? 'dark' : 'light';
    } else {
      this._theme = localTheme;
    }
    if (this._theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }

  getLocalPreference(): ThemeType {
    return <ThemeType>localStorage.getItem('app.preferedTheme') || 'auto';
  }

  setLocalPreference(theme: ThemeType) {
    localStorage.setItem('app.preferedTheme', theme);
  }
}
