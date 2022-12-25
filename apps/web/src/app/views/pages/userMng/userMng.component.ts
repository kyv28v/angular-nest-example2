import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as crypto from 'crypto-js';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { UserService } from '../../../common/services/user.service';
import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';
import { Enums } from '../../../common/defines/enums';

@Component({
  selector: 'app-usermng',
  templateUrl: './userMng.component.html',
  styleUrls: ['./userMng.component.scss'],
  providers: [ HttpRequestInterceptor ],
})
export class UserMngComponent implements OnInit {

  public enums = Enums;
  public users: any;
  public searchText = '';

  constructor(
    private http: HttpRequestInterceptor,
    private simpleDialog: SimpleDialogComponent,
    public user: UserService,
  ) { }

  // 画面初期表示
  async ngOnInit() {
     // 検索
     await this.searchUser();
  }

  // 検索
  async searchUser() {
    // 検索のクエリを実行
    const values = JSON.stringify([this.searchText]);
    const ret: any = await this.http.get('api/query?sql=Users/getUsers.sql&values=' + values);
    if (ret.message !== null) {
      alert('Get users failed.\n' + ret.message);
      return;
    }

    this.users = ret.rows;
  }

  // 追加/更新
  // ※ 引数の user が null なら追加、null でなければ更新する
  async regUser(data: any) {
    const selectedList = Enums.getSelectedList(Enums.Auth, data?.auth);

    // ユーザ登録用のダイアログ表示
    const dialog = this.simpleDialog.open();
    dialog.title = 'Register user';
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
      { class: 'btn-left',  name: 'Cancel', click: async () => { dialog.close('cancel'); } },
      { class: 'btn-right', name: 'OK',     click: async () => { this.regUserExec(data, dialog); } },
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
      'Confirm',
      'Do you want to register user?');
    if (result !== 'ok') { return; }

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
      alert('Register user failed.\n' + ret.message);
      return;
    }

    dialog.close('ok');
  }

  // 削除
  async delUser(data: any) {
    // 確認ダイアログの表示
    const result = await this.simpleDialog.confirm(
      'Confirm',
      'Do you want to delete user?');
    if (result !== 'ok') { return; }

    // 削除のクエリを実行
    const body = { sql: 'Users/delUser.sql', values: [data.id] };
    const ret: any = await this.http.post('api/query', body);
    if (ret.message !== null) {
      alert('Delete user failed.\n' + ret.message);
      return;
    }

    // 再検索
    await this.searchUser();
  }
}
