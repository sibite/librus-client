import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

type ThemeType = 'dark' | 'light' | 'auto';

interface ViewStatesType {
  gradesView: {
    scroll: number,
    semester: number
  },
  attendancesView: {
    scroll: number
  }
}

const initialViewStates = {
  gradesView: {
    scroll: null,
    semester: 1
  },
  attendancesView: {
    scroll: null
  }
}

@Injectable({providedIn: 'root'})
export class ViewService {
  private _theme;
  private _windowHeight: number;
  public state: ViewStatesType = initialViewStates;
  public popUpSubject = new Subject<{ content: any, title: string }>();

  get theme() { return this._theme; }
  get windowHeight() { return this._windowHeight; }
  get showAverages() {
    return Boolean(Number(localStorage.getItem('app.showAverages') ?? '1'));
  }
  set showAverages(value) {
    localStorage.setItem('app.showAverages', '' + Number(value));
  }

  constructor() {
    this.refreshTheme();
    // add listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', media => {
      this.refreshTheme();
    })
    // Resizing view-wrappers
    this._windowHeight = window.innerHeight;
    window.addEventListener('resize', event => {
      this._windowHeight = window.innerHeight;
    })
  }

  refreshTheme() {
    let localTheme = this.getLocalThemePreference() || 'auto';
    if (localTheme === 'auto' && window.matchMedia) {
      let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('isDark', isDark);
      this._theme = isDark ? 'dark' : 'light';
    } else {
      this._theme = localTheme;
    }
    if (localTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    let themeMetaEl = document.head.querySelector('meta[name="theme-color"]');
    let themeColor = getComputedStyle(document.body).getPropertyValue('--bg-color-1').trim();
    console.log('theme color', themeColor);
    themeMetaEl.setAttribute('content', themeColor);
  }

  getLocalThemePreference(): ThemeType {
    return <ThemeType>localStorage.getItem('app.preferedTheme') || 'auto';
  }

  setLocalThemePreference(theme: ThemeType) {
    localStorage.setItem('app.preferedTheme', theme);
  }
}
