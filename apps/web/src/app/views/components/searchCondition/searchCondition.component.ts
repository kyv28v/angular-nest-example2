import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';

@Component({
  selector: 'app-search-condition',
  templateUrl: './searchCondition.component.html',
  styleUrls: ['./searchCondition.component.scss'],
})
export class SearchConditionComponent {
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
    dialog.title = this.title;
    dialog.message = '';
    dialog.items = this.items;
    dialog.buttons = [
      { class: 'btn-left',                    name: 'Cancel', click: async () => { dialog.close('cancel'); } },
      { class: 'btn-right', color: 'primary', name: 'OK',     click: async () => { dialog.close('ok'); } },
    ];

    // ダイアログの実行待ち
    const result = await dialog.wait();
    if (result !== 'ok') { return; }

    // OKなら条件を保持して検索実行
    this.values = dialog.items.map((t) => t.value);
    await this.method();
    this.dispSearchCondition();
  }

  // 検索条件を画面に表示
  dispSearchCondition() {
    let str = "";

    for (let i = 0; i < this.values.length; i++) {
      if (!Array.isArray(this.values[i])) {
        if (this.values[i]) {
          if (str) str += ', ';
          str += this.translate.instant(this.items[i].label)
              + "：" + this.values[i];
        }
      } else {
        if (this.values[i][0] || this.values[i][1]) {
          if (str) str += ', ';
          str += this.translate.instant(this.items[i].label)
              + "：" + (this.values[i][0] || '') 
              + '～' + (this.values[i][1] || '');
        }
      }
    }

    this.searchConditionString = str;
  }  
}
