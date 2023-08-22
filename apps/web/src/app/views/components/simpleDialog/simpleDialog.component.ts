import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import flatpickr from 'flatpickr';
import { english } from 'flatpickr/dist/l10n/default';
import { Japanese } from 'flatpickr/dist/l10n/ja';

import { TranslateService } from '@ngx-translate/core';

export namespace InputType {
  export const Display = 'display';
  export const DisplayArea = 'displayArea';
  export const Text = 'text';
  export const Number = 'number';
  export const NumberRange = 'numberRange';
  export const Password = 'password';
  export const TextArea = 'textarea';
  export const Date = 'date';
  export const DateRange = 'dateRange';
  export const DateTime = 'datetime';
  export const DateTimeRange = 'datetimeRange';
  export const Time = 'time';
  export const TimeRange = 'timeRange';
  export const Select = 'select';
  export const Select2 = 'select2';
  export const Select3 = 'select3';
  export const Radio = 'radio';
  export const Check = 'check';
  export const Color = 'color';
  export const ImageFile = 'imageFile';
}

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simpleDialog.component.html',
  styleUrls: ['./simpleDialog.component.scss'],
})
export class SimpleDialogComponent {
  private dialogRef: MatDialogRef<SimpleDialogComponent, any>;

  // view items
  public title: string;
  public message: string;
  public items: any[];
  public buttons: any[];

  // constructor
  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {
    // カレンダーの言語設定
    if (localStorage.getItem('language') === 'ja') {
      flatpickr.localize(Japanese);
    } else {
      flatpickr.localize(english);
    }
    // カレンダーを日曜日スタートにする
    flatpickr.l10ns.default.firstDayOfWeek = 0;
  }

  // open simple dialog
  public open(width?: string): SimpleDialogComponent {
    // open dialog
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;   // Does not close when the background is clicked.
    if(width) {
      dialogConfig.maxWidth = width;
      dialogConfig.minWidth = width;
    }
    
    const dialogRef = this.dialog.open(SimpleDialogComponent, dialogConfig);
    const dialogComponent = dialogRef.componentInstance as SimpleDialogComponent;
    dialogComponent.dialogRef = dialogRef;

    return dialogComponent;
  }

  // open confirm dialog
  public async confirm(title: string, message: string | string[]): Promise<string> {
    // open dialog
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;   // Does not close when the background is clicked.
    const dialogRef = this.dialog.open(SimpleDialogComponent, dialogConfig);
    const dialogComponent = dialogRef.componentInstance as SimpleDialogComponent;
    dialogComponent.dialogRef = dialogRef;
    
    // translate message
    if (Array.isArray(message)) {
      this.message = this.translate.instant(message[0], message[1]);
    } else {
      this.message = message;
    }

    // set dialog parts
    dialogComponent.title = title;
    dialogComponent.message = this.message;
    dialogComponent.buttons = [
      { class: 'btn-left',  color:'',        name: 'cancel', click: async () => { dialogComponent.close('cancel'); } },
      { class: 'btn-right', color:'primary', name: 'ok',     click: async () => { dialogComponent.close('ok');     } },
    ];

    // wait confirm
    const result = await dialogComponent.wait();
    return result;
  }

  // open notify dialog
  public async notify(title: string, message: string | any[]): Promise<string> {
    // open dialog
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true;   // Does not close when the background is clicked.
    const dialogRef = this.dialog.open(SimpleDialogComponent, dialogConfig);
    const dialogComponent = dialogRef.componentInstance as SimpleDialogComponent;
    dialogComponent.dialogRef = dialogRef;

    // translate message
    if (Array.isArray(message)) {
      this.message = this.translate.instant(message[0], message[1]);
    } else {
      this.message = message;
    }

    // set dialog parts
    dialogComponent.title = title;
    dialogComponent.message = this.message;
    dialogComponent.buttons = [
      { class: 'btn-right', color:'primary', name: 'ok',     click: async () => { dialogComponent.close('ok');     } },
    ];

    // wait confirm
    const result = await dialogComponent.wait();
    return result;
  }

  // close
  public close(dialogResult?: any) {
    this.dialogRef.close(dialogResult);
  }

  // wait
  public async wait() {
    return await this.dialogRef.afterClosed().toPromise();
  }

  // 入力チェック
  public validation(): boolean {
    let ret = true;

    if (this.items !== undefined) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].validateMessage = '';
        if (this.items[i].required === true) {
          if (this.items[i].value === undefined || this.items[i].value === null || this.items[i].value === '') {
            this.items[i].validateMessage = this.translate.instant('requiredError');
            ret = false;
          }
        }
      }
    }
    return ret;
  }

  // #region リストボックスのフィルター関連   --------------------------------------------------------
  // フィルターが入力されるたびに、リストボックスの内容を絞り込む
  selectFilter(item: any): void {
    console.log(`selectFilter(${item.selectListFilter})`)
    item.filteredSelectList = item.selectList.filter((s: any) => s.name.toLowerCase().includes(item.selectListFilter || ''));
  }

  // リストボックスを選択したとき、内部のvalueとフィルターの表示文字を更新する。
  selectChanged(item: any, data: any) {
    console.log(`selectChanged(${data.option.value})`)
    item.value = data.option.value;
    item.selectListFilter = item.selectList.find((s: any) => s.id == item.value)?.name;
  }

  // フィルターに、選択中の文字を表示する。（編集の初期表示用）
  getName(item: any) {
    console.log(`getName(${item.value})`)
    return item.selectList.find((s: any) => s.id == item.value)?.name;
  }

  // フィルターからフォーカスアウトしたとき、フィルターに表示されている文字を元に戻す。
  selectFilterCancel(item: any) {
    console.log(`selectFilterCancel(${item.value})`)
    item.selectListFilter = item.selectList.find((s: any) => s.id == item.value)?.name;
  }

  // #endregion   ---------------------------------------------------------------------------------

  // #region 画像関連   ----------------------------------------------------------------------------
  // 画像ファイル選択イベント
  async onSelectFiles(event: any, item: any) {
    const file = event.target.files[0];

    // ファイルサイズチェック
    if (item.maxsize) {
      let sizeMB = file.size / 1024 ** 2;   // MBに変換
      sizeMB = Math.ceil(sizeMB * 100) / 100; 
      if (sizeMB > item.maxsize) {
        alert(`${item.maxsize}MB以下のファイルを選択してください。ファイルサイズ：${sizeMB}MB`);
        return;
      }
    }

    // Base64変換してvalueに格納する
    item.value = await this.readAsDataURL(file);
  }

  // 画像ファイルのBase64変換（同期版）
  async readAsDataURL(file: any) {
    const reader = new FileReader()
    return new Promise(resolve => {
      reader.onload = event => {
        resolve(event.target?.result)
      }
      reader.readAsDataURL(file)
    })
  } 

  // #endregion   ---------------------------------------------------------------------------------

}
