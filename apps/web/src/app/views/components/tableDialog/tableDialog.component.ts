import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { UserService } from '../../../common/services/user.service';
import { Enums } from '../../../common/defines/enums';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-table-dialog-content',
  templateUrl: './tableDialog.component.html',
  styleUrls: ['./tableDialog.component.scss'],
  providers: [ HttpRequestInterceptor ],
})
export class TableDialogComponent {
  public enums = Enums;
  private dialogRef: MatDialogRef<TableDialogComponent, any>;
  public authView: number;
  public authAdd: number;
  public authEdit: number;
  public authDelete: number;
  public translateHeader = "";

  // function defined by the caller
  public getData: any;
  public addData: any;
  public updateData: any;
  public deleteData: any;

  // view items
  public searchText = '';
  public title: string;
  public datas: any[];
  public list_columns: any[];

  // constructor
  constructor(
    private dialog: MatDialog,
    public user: UserService,
  ) { }

  // open table dialog
  public open(maxWidth?: string) {
    // open dialog
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;   // Does not close when the background is clicked.
    if(maxWidth) { dialogConfig.maxWidth = maxWidth; }

    const dialogRef = this.dialog.open(TableDialogComponent, dialogConfig);
    const dialogComponent = dialogRef.componentInstance as TableDialogComponent;
    dialogComponent.dialogRef = dialogRef;

    return dialogComponent;
  }
  
  // close
  public close(dialogResult?: any) {
    this.dialogRef.close(dialogResult);
  }

  // wait
  public async wait() {
    return await this.dialogRef.afterClosed().toPromise();
  }

  // search
  public async search() {
    await this.getData();
    this.filter();
  }

  // filter
  public filter() {
    if(this.searchText.length > 0) {
      const self = this;
      // filter the data that matches the search text
      let datas = this.datas.filter(function(data) {
          let match = false;
          self.list_columns.forEach(col => {
            if((data[col] + '').indexOf(self.searchText) != -1) {
              match = true;
            }
          });
          return match;
      })
      this.datas = datas;
    }
  }
}
