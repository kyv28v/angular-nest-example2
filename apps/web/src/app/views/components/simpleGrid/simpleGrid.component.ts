import { Component, OnInit, AfterViewInit, OnChanges, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

import { ResizedEvent } from 'angular-resize-event';

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
        var colWidthStr = localStorage.getItem('tableCoWidth_' + self.gridName);
        if (colWidthStr) {
          var colWidth = JSON.parse(colWidthStr);
          for (let i = 0; i < self.columnDefine.length; i++) {
            var element = document.getElementById('col_' + i);
            if (element && colWidth) {
              element.style.width = colWidth[i] + 'px';
            }
          }
          console.log('restore table column width. ');
        }

        // ローカルストレージのソート条件を復元
        var tableSortStr = localStorage.getItem('tableSort_' + self.gridName);
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

      // テーブルサイズをローカルに保存
      let colWidth = [];
      for (let i = 0; i < self.columnDefine.length; i++) {
        colWidth.push(document.getElementById('col_' + i)?.offsetWidth);
      }

      localStorage.setItem('tableCoWidth_' + self.gridName, JSON.stringify(colWidth));
      console.log('save table column width. ' + colWidth.join(','));

      // イベントをクリア
      self.lastEvent = null;
    }, 500);
  }

  // テーブルのソート条件を変更したとき、ソート条件をローカルストレージに保存する。
  onSortChange(event: any) {
    localStorage.setItem('tableSort_' + this.gridName, JSON.stringify(event));
  }
}
