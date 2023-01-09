import { Component, OnInit, AfterViewInit, OnChanges, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

import { ResizedEvent } from 'angular-resize-event';
import { TranslateService } from '@ngx-translate/core';

import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';
import { ProgressSpinnerService } from '../../components/progressSpinner/progressSpinner.service';
import { UserService } from '../../../common/services/user.service';

export interface ColumnDefine {
  type: string;
  column: string;
  name: string;
  enum?: any[];
  format?: string;
  icon?: string;
  method?: any;
  color?: string;
  auth?: number;
}

@Component({
  selector: 'app-simple-grid',
  templateUrl: './simpleGrid.component.html',
  styleUrls: ['./simpleGrid.component.scss'],
})
export class SimpleGridComponent implements OnChanges {
  @Input() gridName: string;
  @Input() columnDefine: any[] = [];
  @Input() dataSource: MatTableDataSource<any>;

  dispCol: string[];
  @ViewChild("GridSort", { static: true }) gridSort: MatSort;


  // constructor
  constructor(
    private simpleDialog: SimpleDialogComponent,
    private spinner: ProgressSpinnerService,
    public translate: TranslateService,
    public user: UserService,
  ) { }

  // 変更イベント
  ngOnChanges() {
    if (this.columnDefine && this.dataSource) {
      // 列定義やソートをセット
      this.dispCol = this.columnDefine?.map((t) => t.column);
      this.dataSource.sort = this.gridSort;

      var self = this;
      setTimeout(function() {
        // ローカルストレージの列幅を復元
        var colWidthStr = localStorage.getItem('tableCoWidth.' + self.gridName);
        if (colWidthStr) {
          var colWidth = JSON.parse(colWidthStr);
          for (let i = 0; i < self.columnDefine.length; i++) {
            var element = document.getElementById('col_' + i);
            if (element && colWidth) {
              element.style.width = colWidth[i] + 'px';
            }
          }
          console.log(`restore table column width. [${self.gridName}] ` + colWidthStr);
        }

        // ローカルストレージのソート条件を復元
        var tableSortStr = localStorage.getItem('tableSort.' + self.gridName);
        if (tableSortStr && self.dataSource.sort) {
          var tableSort = JSON.parse(tableSortStr);
          self.gridSort.active = tableSort.active;
          self.gridSort.direction = tableSort.direction;
          self.dataSource.sort = self.gridSort;
        }
      });
    }
  }

  // テーブルの列幅を変更したとき、幅をローカルストレージに保存する。
  // ※ 何度も実行されてしまわないよう、500msの間イベントが来ていなかったら実行する。
  lastEvent: any = null;
  onResized(event: ResizedEvent) {
    // 最後のイベントを保持
    var lastEvent = {
      time: new Date(),
      event: event,
    }
    this.lastEvent = lastEvent;
  
    // 500ms待機してから処理を呼び出す
    var self = this;
    setTimeout(function() {
      // すでに次のイベントが来ていたら何もせず終了
      if (self.lastEvent && lastEvent.time < self.lastEvent.time) return;

      // 保存フラグ
      // ※ 初期表示時などに意図せずイベントが走ってしまうことがあるので、HTML要素が見つからない場合はOFFにする
      let saveFlag = true;

      // HTML要素から列幅を取得
      let colWidth = [];
      for (let i = 0; i < self.columnDefine.length; i++) {
        if (!document.getElementById('col_' + i)) saveFlag = false;
        colWidth.push(document.getElementById('col_' + i)?.offsetWidth);
      }

      // ローカルストレージに保存
      if (saveFlag) {
        localStorage.setItem('tableCoWidth.' + self.gridName, JSON.stringify(colWidth));
        console.log(`save table column width. [${self.gridName}] ` + colWidth.join(','));
      }

      // イベントをクリア
      self.lastEvent = null;
    }, 500);
  }

  // テーブルのソート条件を変更したとき、ソート条件をローカルストレージに保存する。
  onSortChange(event: any) {
    localStorage.setItem('tableSort.' + this.gridName, JSON.stringify(event));
  }

  // CSVダウンロード
  async downloadCSV() {
    try {
      // show spinner
      this.spinner.show();
      this.spinner.setMessage(this.translate.instant('Downloading'));

      // // ヘッダ部の生成
      // let csv = this.columnDefine
      //   .filter(col => col.type != 'button')              // ボタン列は除外
      //   .map((col) => this.translate.instant(col.name))   // name定義を変換
      //   .join(',');

      // // データ部の生成
      // let row = '';
      // for (let i = 0; i < this.dataSource.data.length; i++) {
      //   csv += '\n';

      //   for (let j = 0; j < this.columnDefine.length; j++) {
      //     if (row) row += ',';
      //     row += this.dataSource.data[i][this.columnDefine[j].column] || '';
      //   }

      //   csv += row;
      //   row = '';
      // }

      // CSVデータの生成
      // ※ dataSource から取得すると書式変換などが反映されていないので、HTMLのテーブルから取得する。
      let table = document.getElementById('mat-table');
      let csv = '';
      let row = '';
      if (table) {
        for (let i = 0; i < table.children.length; i++) {
          for(let j = 0; j < table.children[i].children.length; j++){
            if (this.columnDefine[j].type == 'button') continue;
            if (row) row += ',';
            row += (table.children[i].children[j].textContent)?.trim();
          }
          csv += row + '\n';
          row = '';
        }
      }

      // 生成したCSVデータをダウンロード
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = this.gridName + '.csv';
      link.click();

    } catch (e: any) {
      alert('download csv failed.\n' + e.message);
    } finally {
      // stop spinner
      this.spinner.close();
    }
  }

  // ローカルストレージに保存した一覧の幅とソート条件を初期化する
  clearSetting() {
    localStorage.removeItem('tableCoWidth.' + this.gridName);
    localStorage.removeItem('tableSort.' + this.gridName);
    window.location.reload();
  }
}
