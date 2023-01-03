import { Component, OnInit, AfterViewInit, OnChanges, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

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
  selector: 'app-simple-grid-content',
  templateUrl: './simpleGrid.component.html',
  styleUrls: ['./simpleGrid.component.scss'],
})
export class SimpleGridComponent implements OnChanges {
  @Input() dataSource: MatTableDataSource<any>;
  @Input() columnDefine: any[] = [];

  dispCol: string[];
  @ViewChild("GridSort", { static: true }) gridSort: MatSort;


  // constructor
  constructor(
    public user: UserService,
  ) { }

  // 変更イベント
  ngOnChanges() {
    this.dispCol = this.columnDefine.map((t) => t.column);
    this.dataSource.sort = this.gridSort;
  }
}
