import { Injectable } from "@angular/core";

type ThemeType = 'dark' | 'light' | 'auto';

@Injectable({providedIn: 'root'})
export class ViewService {
  private _theme;
  private _windowHeight: number;

  get theme() { return this._theme; }
  get windowHeight() { return this._windowHeight; }

  constructor() {
    this.refreshTheme();
    window.matchMedia(('prefers-color-scheme: dark')).addEventListener('change', media => {
      this._theme = media.matches ? 'dark' : 'light';
    })
    // Resizing view-wrappers
    this._windowHeight = window.innerHeight;
    window.addEventListener('resize', event => {
      this._windowHeight = window.innerHeight;
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
