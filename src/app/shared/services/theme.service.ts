import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themeSubject = new BehaviorSubject<string>('light');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    const storedTheme = localStorage.getItem('preferredTheme');
    if (storedTheme) {
      this.setTheme(storedTheme);
    } else {
      const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkMediaQuery.addEventListener('change', (e) => {
        this.setTheme(e.matches ? 'dark' : 'light');
      });
      this.setTheme(darkMediaQuery.matches ? 'dark' : 'light');
    }
  }

  setTheme(theme: string) {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.dataset['theme'] = theme;
    localStorage.setItem('preferredTheme', theme);
    this.themeSubject.next(theme);
  }

  changeThemeState() {
    const body = document.querySelector('body') as HTMLBodyElement;
    const bodyThemeState = body.dataset['theme'];

    if (bodyThemeState === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }
}
