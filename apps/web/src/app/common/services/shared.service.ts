import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public language: string = localStorage.getItem('language') || '';
  public theme: string = localStorage.getItem('theme') || '';

  constructor(
    private translate: TranslateService,
  ) {
    this.language = localStorage.getItem('language') || '';
    this.theme = localStorage.getItem('theme') || '';

    if (!this.language) { this.setLanguage('en'); }
    if (!this.theme) { this.setTheme('default-theme'); }
  }

  public setLanguage(language: string) {
    this.language = language;
    localStorage.setItem('language', language);
    this.translate.use(this.language);
  }

  public setTheme(theme: string) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }
}