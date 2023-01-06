import { Component, Injectable, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-search-condition',
  templateUrl: './searchCondition.component.html',
  styleUrls: ['./searchCondition.component.scss'],
})
export class SearchConditionComponent {
  @Input() searchCondition: any;

  public title: string;
  public items: any[] = [];
  public values: any[] = [];
  public method: any;

  public searchConditionString: string;

  // constructor
  constructor(
    private simpleDialog: SimpleDialogComponent,
    private translate: TranslateService,
  ) { }

  // 検索ダイアログの表示
  async openSearchDialog() {
    const dialog = this.simpleDialog.open();
    dialog.title = this.searchCondition.title;
    dialog.message = '';
    dialog.items = this.searchCondition.items;
    dialog.buttons = [
      { class: 'btn-left',                    name: 'Cancel', click: async () => { dialog.close('cancel'); } },
      { class: 'btn-right', color: 'primary', name: 'OK',     click: async () => { dialog.close('ok'); } },
    ];

    // ダイアログの実行待ち
    const result = await dialog.wait();
    if (result !== 'ok') { return; }

    // OKなら条件を保持して検索実行
    this.searchCondition.values = dialog.items.map((t) => t.value);
    await this.searchCondition.method();
    this.dispSearchCondition();
  }

  // 検索条件を画面に表示
  dispSearchCondition() {
    let str = "";

    for (let i = 0; i < this.searchCondition.values.length; i++) {
      if (!Array.isArray(this.searchCondition.values[i])) {
        if (this.searchCondition.values[i]) {
          if (str) str += ', ';
          str += this.translate.instant(this.searchCondition.items[i].label)
              + "：" + this.searchCondition.values[i];
        }
      } else {
        if (this.searchCondition.values[i][0] || this.searchCondition.values[i][1]) {
          if (str) str += ', ';
          str += this.translate.instant(this.searchCondition.items[i].label)
              + "：" + (this.searchCondition.values[i][0] || '') 
              + '～' + (this.searchCondition.values[i][1] || '');
        }
      }
    }

    this.searchConditionString = str;
  }  
}
