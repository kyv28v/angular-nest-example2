import { Component, Input, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';

@Component({
  selector: 'app-search-condition',
  templateUrl: './searchCondition.component.html',
  styleUrls: ['./searchCondition.component.scss'],
})
export class SearchConditionComponent implements OnInit {
  @Input() searchConditionName: string;
  @Input() items: any[] = [];
  @Input() method: any;

  public title: string = 'search';
  public values: any[] = [];
  public searchConditionString: string;
  private defaultValues: any[];

  // constructor
  constructor(
    private simpleDialog: SimpleDialogComponent,
    private translate: TranslateService,
  ) { }

  async ngOnInit() {
    // itemsからデフォルトのvalues配列を生成
    this.createDefaultValues();
    
    // ローカルストレージの検索条件を復元
    this.restoreSetting();
  }

  // 検索ダイアログの表示
  async openSearchDialog() {
    const dialog = this.simpleDialog.open();
    dialog.title = this.title;
    dialog.message = '';
    dialog.items = this.items;
    for (let i = 0; i < dialog.items.length; i++) {       // キャンセルして開きなおしたときのために、valuesをitemsに戻す
      dialog.items[i].value = this.values[i]?.concat();   // 単に代入すると範囲のとき（[0]、[1]があるとき）参照渡しになってしまうため、concatで値渡しにする。
    }
    dialog.buttons = [
      { class: 'btn-left',                    name: 'cancel', click: async () => { dialog.close('cancel'); } },
      { class: 'btn-left',                    name: 'clear',  click: async () => { this.clear(); } },
      { class: 'btn-right', color: 'primary', name: 'ok',     click: async () => { dialog.close('ok'); } },
    ];

    // ダイアログの実行待ち
    const result = await dialog.wait();
    if (result !== 'ok') { return; }

    // OKなら条件を保持して検索実行
    this.values = dialog.items.map((t) => t.value);
    await this.method();

    // 検索条件をローカルストレージに保存
    localStorage.setItem('searchCondition.' + this.searchConditionName, JSON.stringify(this.values));
    console.log(`save search condition. [${this.searchConditionName}]` + JSON.stringify(this.values));
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

  // itemsからデフォルトのvalues配列を生成
  createDefaultValues() {
    this.defaultValues = []; 
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].inputtype.substr(-5) == 'Range') {    // 範囲入力の場合は配列をセット
        this.defaultValues.push([null, null]);
      } else {
        this.defaultValues.push(null);
      }
    }
  }

  // ローカルストレージの検索条件を復元
  restoreSetting() {
    var searchConditionStr = localStorage.getItem('searchCondition.' + this.searchConditionName);
    if (searchConditionStr) {
      this.values = JSON.parse(searchConditionStr);
      console.log(`restore search condition. [${this.searchConditionName}] ` + searchConditionStr);
    } else {
      this.values = this.defaultValues;
    }
  }

  // 検索条件のクリア
  clear() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].value = this.defaultValues[i];
    }
  }
}
