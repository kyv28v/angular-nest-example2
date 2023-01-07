import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";

import { TranslateService } from '@ngx-translate/core';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { UserService } from '../../../common/services/user.service';
import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';
import { SearchConditionComponent } from '../../components/searchCondition/searchCondition.component';
import { SimpleGridComponent } from '../../components/simpleGrid/simpleGrid.component';
import { ProgressSpinnerService } from '../../components/progressSpinner/progressSpinner.service';
import { ColumnDefine } from '../../components/simpleGrid/simpleGrid.component';
import { Enums } from '../../../common/defines/enums';


@Component({
  selector: 'app-room-access-mng',
  templateUrl: './roomAccessMng.component.html',
  styleUrls: ['./roomAccessMng.component.scss'],
  providers: [ HttpRequestInterceptor ],
})
export class RoomAccessMngComponent implements OnInit {

  public enums = Enums;
  public userList: any[] = [];

  // 一覧定義
  dataSource: MatTableDataSource<any>;
  columnDefine: ColumnDefine[];

  @ViewChild(SimpleGridComponent)
  public simpleGrid: SimpleGridComponent;

  // 検索条件
  @ViewChild(SearchConditionComponent)
  public searchCondition: SearchConditionComponent;

  constructor(
    private http: HttpRequestInterceptor,
    private spinner: ProgressSpinnerService,
    private simpleDialog: SimpleDialogComponent,
    public translate: TranslateService,
    public user: UserService,
  ) { }

  // 画面初期表示
  async ngOnInit() {
    // ユーザ一覧の取得
    const users: any = await this.http.get('api/query?sql=Users/getUsers.sql&values=' + JSON.stringify(['']));
    const userList: any[] = users.rows as any[];
    this.userList = userList.map(({id, name}) => ({id, name}));

    // 一覧のカラム定義をセット
    // ※ userList のようにDBデータを Enum として使用する場合はOnInitで定義する。そうでない場合は変数宣言時に定義してもよい。
    this.columnDefine = [
      { type: 'number',   column: 'id',           name: 'roomAccessMng.id',             format: '0.0-0'               },
      { type: 'enum',     column: 'room_cd',      name: 'roomAccessMng.room',           enum: Enums.Rooms             },
      { type: 'enum',     column: 'user_id',      name: 'roomAccessMng.user',           enum: this.userList           },
      { type: 'datetime', column: 'entry_dt',     name: 'roomAccessMng.entryDateTime',  format: 'yyyy/MM/dd HH:mm'    },
      { type: 'datetime', column: 'exit_dt',      name: 'roomAccessMng.exitDateTime',   format: 'yyyy/MM/dd HH:mm'    },
      { type: 'number',   column: 'access_time',  name: 'roomAccessMng.accessTime',     format: '1.2-2'               },
      { type: 'string',   column: 'note',         name: 'note',                                                       },
      { type: 'button',   column: '__edit',       name: 'edit',           icon: 'edit',           method: async (data: any) => await this.regRoomAccessMng(data), color: 'primary', auth: 22  },
      { type: 'button',   column: '__delete',     name: 'delete',         icon: 'delete_forever', method: async (data: any) => await this.delRoomAccessMng(data), color: 'warn',    auth: 23  },
    ];

    // 検索条件をセット
    this.searchCondition.searchConditionName = 'roomAccessMng';
    this.searchCondition.title = 'search';
    this.searchCondition.initSearchCondition([[null, null], null, null, [null, null], [null, null]]);
    this.searchCondition.items = [
      { label: 'roomAccessMng.id',            value: this.searchCondition.values[0], inputtype: InputType.NumberRange,    },
      { label: 'roomAccessMng.room',          value: this.searchCondition.values[1], inputtype: InputType.Select2,  selectList : Enums.Rooms },
      { label: 'roomAccessMng.user',          value: this.searchCondition.values[2], inputtype: InputType.Select2,  selectList : this.userList },
      { label: 'roomAccessMng.entryDateTime', value: this.searchCondition.values[3], inputtype: InputType.DateTimeRange,  },
      { label: 'roomAccessMng.exitDateTime',  value: this.searchCondition.values[4], inputtype: InputType.DateTimeRange,  },
    ];
    this.searchCondition.method = async () => await this.searchRoomAccessMng();

    // 検索
    await this.searchRoomAccessMng();
  }

  // 検索
  async searchRoomAccessMng() {
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
        this.searchCondition.values[4][0],
        this.searchCondition.values[4][1],
      ]);

      const ret: any = await this.http.get('api/query?sql=RoomAccessMng/getRoomAccessMngs.sql&values=' + values);
      if (ret.message !== null) {
        alert('Get room access datetime failed.\n' + ret.message);
        return;
      }

      this.dataSource = new MatTableDataSource(ret.rows);

      // 検索条件を画面に表示
      this.searchCondition.dispSearchCondition();

    } catch (e: any) {
      console.log(e.message);
    } finally {
      // stop spinner
      this.spinner.close();
    }
  }

  // 追加/更新
  // ※ 引数の data が null なら追加、null でなければ更新する
  async regRoomAccessMng(data: any) {
    // 入退室日時登録用のダイアログ表示
    const dialog = this.simpleDialog.open();
    dialog.title = 'roomAccessMng.register';
    dialog.message = '';
    dialog.items = [
      { label: 'roomAccessMng.room', value: data?.room_cd, inputtype: InputType.Select, required: true, selectList : Enums.Rooms },
      { label: 'roomAccessMng.user', value: data?.user_id, inputtype: InputType.Select, required: true, selectList : this.userList },
      { label: 'roomAccessMng.entryDateTime', value: data?.entry_dt, inputtype: InputType.DateTime, required: true, placeholder: '2020/01/01 09:00' },
      { label: 'roomAccessMng.exitDateTime', value: data?.exit_dt, inputtype: InputType.DateTime, required: false, placeholder: '2020/01/02 18:00' },
      { label: 'note', value: data?.note, inputtype: InputType.TextArea, required: false, placeholder: '' },
    ];
    dialog.buttons = [
      { class: 'btn-left',                    name: 'cancel', click: async () => { dialog.close('cancel'); } },
      { class: 'btn-right', color: 'primary', name: 'ok',     click: async () => { this.regRoomAccessMngExec(data, dialog); } },
    ];

    // ダイアログの実行待ち
    const result = await dialog.wait();
    if (result !== 'ok') { return; }

    // 再検索
    await this.searchRoomAccessMng();
  }
  // 追加/更新（ダイアログ側で実行される処理）
  async regRoomAccessMngExec(data: any, dialog: SimpleDialogComponent) {
    // 入力チェック
    if (dialog.validation() === false) { return; }

    // 確認ダイアログの表示
    const result = await this.simpleDialog.confirm(
      'Confirm',
      'roomAccessMng.registerConfirmMessage');
    if (result !== 'ok') { return; }

    try{
      // show spinner
      this.spinner.show();
      this.spinner.setMessage('registering');

      // APIの呼び出し
      const room_cd = dialog.items[0].value;
      const user_id = dialog.items[1].value;
      const entry_dt = dialog.items[2].value;
      const exit_dt = dialog.items[3].value;
      const note = dialog.items[4].value;

      // 追加/更新のクエリを実行
      let body;
      if (data) {
        body = { sql: 'RoomAccessMng/updRoomAccessMng.sql', values: [room_cd, user_id, entry_dt, exit_dt, note, data.id] };
      } else {
        body = { sql: 'RoomAccessMng/addRoomAccessMng.sql', values: [room_cd, user_id, entry_dt, exit_dt, note] };
      }
      const ret: any = await this.http.post('api/query', body);
      if (ret.message !== null) {
        alert('Register room access datetime failed.\n' + ret.message);
        return;
      }

      dialog.close('ok');

    } catch (e: any) {
      console.log(e.message);
    } finally {
      // stop spinner
      this.spinner.close();
    }
  }

  // 削除
  async delRoomAccessMng(data: any) {
    // 確認ダイアログの表示
    const result = await this.simpleDialog.confirm(
      'Confirm',
      'roomAccessMng.deleteConfirmMessage');
    if (result !== 'ok') { return; }

    try{
      // show spinner
      this.spinner.show();
      this.spinner.setMessage('deleting');

      // 削除のクエリを実行
      const body = { sql: 'RoomAccessMng/delRoomAccessMng.sql', values: [data.id] };
      const ret: any = await this.http.post('api/query', body);
      if (ret.message !== null) {
        alert('Delete room access datetime failed\n' + ret.message);
        return;
      }

    } catch (e: any) {
      console.log(e.message);
    } finally {
      // stop spinner
      this.spinner.close();
    }

    // 再検索
    await this.searchRoomAccessMng();
  }
}
