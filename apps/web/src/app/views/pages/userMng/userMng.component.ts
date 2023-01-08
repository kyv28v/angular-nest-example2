import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";

import * as crypto from 'crypto-js';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { UserService } from '../../../common/services/user.service';
import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';
import { SearchConditionComponent } from '../../components/searchCondition/searchCondition.component';
import { SimpleGridComponent, ColumnDefine } from '../../components/simpleGrid/simpleGrid.component';
import { ProgressSpinnerService } from '../../components/progressSpinner/progressSpinner.service';
import { Enums } from '../../../common/defines/enums';

@Component({
  selector: 'app-usermng',
  templateUrl: './userMng.component.html',
  styleUrls: ['./userMng.component.scss'],
  providers: [ HttpRequestInterceptor ],
})
export class UserMngComponent implements OnInit, AfterViewInit {

  public enums = Enums;
  public users: any;
  public searchText = '';

  // ------------------------------------------------------------
  // 一覧定義
  // ------------------------------------------------------------
  dataSource: MatTableDataSource<any>;
  columnDefine: ColumnDefine[] = [
    { type: 'number',   column: 'id',           name: 'user.id',        format: '0.0-0'       },
    { type: 'string',   column: 'code',         name: 'user.code',                            },
    { type: 'string',   column: 'name',         name: 'user.name',                            },
    { type: 'number',   column: 'age',          name: 'user.age',       format: '0.0-0'       },
    { type: 'enum',     column: 'sex',          name: 'user.sex',       enum: Enums.Sex       },
    { type: 'datetime', column: 'birthday',     name: 'user.birthday',  format: 'yyyy/MM/dd'  },
    { type: 'string',   column: 'note',         name: 'note',                                 },
    { type: 'button',   column: '__edit',       name: 'edit',           icon: 'edit',           method: async (data: any) => await this.regUser(data), color: 'primary', auth: 22  },
    { type: 'button',   column: '__delete',     name: 'delete',         icon: 'delete_forever', method: async (data: any) => await this.delUser(data), color: 'warn',    auth: 23  },
  ];

  @ViewChild(SimpleGridComponent)
  public simpleGrid: SimpleGridComponent;

  // ------------------------------------------------------------
  // 検索条件定義
  // ------------------------------------------------------------
  searchItems: any[] = [
    { label: 'user.id',         value: null, inputtype: InputType.NumberRange,    },
    { label: 'user.code',       value: null, inputtype: InputType.Text,           },
    { label: 'user.name',       value: null, inputtype: InputType.Text,           },
    { label: 'user.age',        value: null, inputtype: InputType.NumberRange,    },
    { label: 'user.sex',        value: null, inputtype: InputType.Select2,  selectList : Enums.Sex  },
    { label: 'user.birthday',   value: null, inputtype: InputType.DateRange,      },
  ];
  searchMethod = async () => await this.searchUser();

  @ViewChild(SearchConditionComponent)
  public searchCondition: SearchConditionComponent;
  // ------------------------------------------------------------

  // コンストラクタ
  constructor(
    private http: HttpRequestInterceptor,
    private spinner: ProgressSpinnerService,
    private simpleDialog: SimpleDialogComponent,
    public user: UserService,
  ) { }

  // 初期化完了イベント
  // ※ @Input()でバインドされた入力値を初期化後に呼び出される。
  async ngOnInit() {
    // 処理なし
  }

  // ビュー初期化完了イベント
  // ※ 検索条件などの子コンポーネントの描画が完了した後に呼び出される。
  async ngAfterViewInit() {
    // 検索
    await this.searchUser();
  }

  // 検索
  async searchUser() {
    try{
      // show spinner
      this.spinner.show();
      this.spinner.setMessage('searching');

      // 検索のクエリを実行
      const values = JSON.stringify([
        this.searchCondition.values[0][0],
        this.searchCondition.values[0][1],
        this.searchCondition.values[1],
        this.searchCondition.values[2],
        this.searchCondition.values[3][0],
        this.searchCondition.values[3][1],
        this.searchCondition.values[4],
        this.searchCondition.values[5][0],
        this.searchCondition.values[5][1],
      ]);

      const ret: any = await this.http.get('api/query?sql=Users/getUsers.sql&values=' + values);
      if (ret.message !== null) {
        alert('Get users failed.\n' + ret.message);
        return;
      }
  
      this.dataSource = new MatTableDataSource(ret.rows);

      // 検索条件を画面に表示
      this.searchCondition.dispSearchCondition();

    } finally {
      // stop spinner
      this.spinner.close();
    }
  }

  // 追加/更新
  // ※ 引数の user が null なら追加、null でなければ更新する
  async regUser(data: any) {
    const selectedList = Enums.getSelectedList(Enums.Auth, data?.auth);

    // ユーザ登録用のダイアログ表示
    const dialog = this.simpleDialog.open();
    dialog.title = 'user.register';
    dialog.message = '';
    dialog.items = [
      { label: 'user.id', value: data?.id, inputtype: InputType.Display },
      { label: 'user.code', value: data?.code, inputtype: data ? InputType.Display : InputType.Text, required: true, placeholder: '' },
      { label: 'user.name', value: data?.name, inputtype: InputType.Text, required: true, placeholder: 'John Smith' },
      { label: 'user.age', value: data?.age, inputtype: InputType.Text, required: true, placeholder: '20' },
      { label: 'user.sex', value: data?.sex, inputtype: InputType.Radio, required: false, placeholder: '', selectList : Enums.Sex },
      { label: 'user.birthday', value: data?.birthday, inputtype: InputType.Date, required: false, placeholder: '1990/01/01' },
      { label: 'user.password', value: data ? '●●●●●●' : null, inputtype: data ? InputType.Display : InputType.Password, required: true, placeholder: '' },
      { label: 'user.note', value: data?.note, inputtype: InputType.TextArea, required: false, placeholder: '' },
      { label: 'user.auth', value: selectedList, inputtype: InputType.Check, required: false, placeholder: '', selectList : Enums.Auth },
    ];
    dialog.buttons = [
      { class: 'btn-left',                    name: 'cancel', click: async () => { dialog.close('cancel'); } },
      { class: 'btn-right', color: 'primary', name: 'ok',     click: async () => { this.regUserExec(data, dialog); } },
    ];

    // ダイアログの実行待ち
    const result = await dialog.wait();
    if (result !== 'ok') { return; }

    // 再検索
    await this.searchUser();
  }
  // 追加/更新（ダイアログ側で実行される処理）
  async regUserExec(data: any, dialog: SimpleDialogComponent) {
    // 入力チェック
    if (dialog.validation() === false) { return; }

    // 確認ダイアログの表示
    const result = await this.simpleDialog.confirm(
      'confirm',
      'user.registerConfirm');
    if (result !== 'ok') { return; }

    try{
      // show spinner
      this.spinner.show();
      this.spinner.setMessage('registering');

      // APIの呼び出し
      const code = dialog.items[1].value;
      const name = dialog.items[2].value;
      const age = dialog.items[3].value;
      const sex = dialog.items[4].value;
      const birthday = dialog.items[5].value;
      const password = dialog.items[6].value;
      const note = dialog.items[7].value;
      const auth = JSON.stringify(Enums.getSelectedValue(Enums.Auth, dialog.items[8].value));

      // 追加/更新のクエリを実行
      let body;
      if (data) {
        body = { sql: 'Users/updUser.sql', values: [code, name, age, sex, birthday, note, auth, data.id] };
      } else {
        // パスワードのハッシュ化
        const hashedPassword = crypto.SHA512(password).toString();
        body = { sql: 'Users/addUser.sql', values: [code, name, age, sex, birthday, hashedPassword, note, auth] };
      }
      const ret: any = await this.http.post('api/query', body);
      if (ret.message !== null) {
        if (ret.message == 'duplicate key value violates unique constraint "users_pkey"') {
          // コード重複エラーの時はメッセージを表示
          // ※ 実際の業務で使用する場合は、バックエンド側で独自のAPIを作ってチェックしたほうがよい。
          await this.simpleDialog.notify('error', 'user.codeDuplicate');
        } else {
          alert('Register user failed.\n' + ret.message);
        }
        return;
      }

      dialog.close('ok');

    } finally {
      // stop spinner
      this.spinner.close();
    }
  }

  // 削除
  async delUser(data: any) {
    // 確認ダイアログの表示
    const result = await this.simpleDialog.confirm(
      'confirm',
      'user.deleteConfirm');
    if (result !== 'ok') { return; }

    try{
      // show spinner
      this.spinner.show();
      this.spinner.setMessage('deleting');

      // 削除のクエリを実行
      const body = { sql: 'Users/delUser.sql', values: [data.id] };
      const ret: any = await this.http.post('api/query', body);
      if (ret.message !== null) {
        alert('Delete user failed.\n' + ret.message);
        return;
      }

    } finally {
      // stop spinner
      this.spinner.close();
    }

    // 再検索
    await this.searchUser();
  }
}
