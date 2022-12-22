import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Message } from '@angular-nest-example/api-interfaces';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'angular-nest-example-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // hello$ = this.http.get<Message>('/api/hello');
  // constructor(private http: HttpClient) {}
  constructor(private http: HttpClient, private translate: TranslateService) {
    translate.setDefaultLang('en');
  }
}
