import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { UserService } from '../../../common/services/user.service';
import { SimpleDialogComponent, InputType } from '../../components/simpleDialog/simpleDialog.component';
import { Enums } from '../../../common/defines/enums';

interface ColumnDefine {
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
  selector: 'app-room-access-mng',
  templateUrl: './roomAccessMng.component.html',
  styleUrls: ['./roomAccessMng.component.scss'],
  providers: [ HttpRequestInterceptor ],
})
export class RoomAccessMngComponent implements OnInit {

  public enums = Enums;
  public userList: any[] = [];
  public roomAccessMngs: any[];
  public searchList = '';

    // 一覧定義
    // dataSource: MatTableDataSource<XXXModel>;
    dataSource: MatTableDataSource<any>;
    columnDefine: ColumnDefine[] = [
      { type: 'number',   column: 'id',       name: 'ID',             format: '0.0-0'             },
      { type: 'enum',     column: 'room_cd',  name: 'Room',           enum: Enums.Rooms           },
      { type: 'enum',     column: 'user_id',  name: 'User',           enum: this.userList         },
      { type: 'datetime', column: 'entry_dt', name: 'EntryDateTime',  format: 'yyyy/MM/dd HH:mm'  },
      { type: 'datetime', column: 'exit_dt',  name: 'ExitDateTime',   format: 'yyyy/MM/dd HH:mm'  },
      { type: 'string',   column: 'note',     name: 'Note',                                       },
      { type: 'number',   column: 'qty',      name: 'qty',            format: '1.0-0'             },
      { type: 'edit',     column: '__edit',   name: 'Edit',           method: this.regRoomAccessMng },
      { type: 'delete',   column: '__delete', name: 'Delete',         method: this.delRoomAccessMng },
    ];
    dispCol = this.columnDefine.map((t) => t.column);
    @ViewChild("GridSort", { static: true }) gridSort: MatSort;
  
  constructor(
    private http: HttpRequestInterceptor,
    private simpleDialog: SimpleDialogComponent,
    public user: UserService,
  ) { }

  // 画面初期表示
  async ngOnInit() {
    // ユーザ一覧の取得
    const users: any = await this.http.get('api/query?sql=Users/getUsers.sql&values=' + JSON.stringify(['']));
    const userList: any[] = users.rows as any[];
    this.userList = userList.map(({id, name}) => ({id, name}));

    this.columnDefine = [
      { type: 'number',   column: 'id',       name: 'ID',             format: '0.0-0'               },
      { type: 'enum',     column: 'room_cd',  name: 'Room',           enum: Enums.Rooms             },
      { type: 'enum',     column: 'user_id',  name: 'User',           enum: this.userList           },
      { type: 'datetime', column: 'entry_dt', name: 'EntryDateTime',  format: 'yyyy/MM/dd HH:mm'    },
      { type: 'datetime', column: 'exit_dt',  name: 'ExitDateTime',   format: 'yyyy/MM/dd HH:mm'    },
      { type: 'string',   column: 'note',     name: 'Note',                                         },
      { type: 'number',   column: 'qty',      name: 'qty',            format: '1.0-0'               },
      { type: 'button',   column: '__edit',   name: 'Edit',           icon: 'edit',           method: async (data: any) => await this.regRoomAccessMng(data), color: 'primary', auth: 22  },
      { type: 'button',   column: '__delete', name: 'Delete',         icon: 'delete_forever', method: async (data: any) => await this.delRoomAccessMng(data), color: 'warn',    auth: 23  },
    ];

    // 検索
    await this.searchRoomAccessMng();
  }

  // 検索
  async searchRoomAccessMng() {
    // 検索のクエリを実行
    const values = JSON.stringify([this.searchList]);
    const ret: any = await this.http.get('api/query?sql=RoomAccessMng/getRoomAccessMngs.sql&values=' + values);
    if (ret.message !== null) {
      alert('Get room access datetime failed.\n' + ret.message);
      return;
    }

    this.roomAccessMngs = ret.rows;
    this.dataSource = new MatTableDataSource(ret.rows);
    this.dataSource.sort = this.gridSort;
  }

  // 追加/更新
  // ※ 引数の data が null なら追加、null でなければ更新する
  async regRoomAccessMng(data: any) {
    // 入退室日時登録用のダイアログ表示
    const dialog = this.simpleDialog.open();
    dialog.title = 'Register room access datetime';
    dialog.message = '';
    dialog.items = [
      { label: 'Room', value: data?.room_cd, inputtype: InputType.Select, required: true, selectList : Enums.Rooms },
      { label: 'User', value: data?.user_id, inputtype: InputType.Select, required: true, selectList : this.userList },
      { label: 'EntryDateTime', value: data?.entry_dt, inputtype: InputType.DateTime, required: true, placeholder: '2020/01/01 09:00' },
      { label: 'ExitDateTime', value: data?.exit_dt, inputtype: InputType.DateTime, required: false, placeholder: '2020/01/02 18:00' },
      { label: 'Note', value: data?.note, inputtype: InputType.TextArea, required: false, placeholder: '' },
    ];
    dialog.buttons = [
      { class: 'btn-left',                    name: 'Cancel', click: async () => { dialog.close('cancel'); } },
      { class: 'btn-right', color: 'primary', name: 'OK',     click: async () => { this.regRoomAccessMngExec(data, dialog); } },
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
      'Do you want to register room access datetime?');
    if (result !== 'ok') { return; }

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
  }

  // 削除
  async delRoomAccessMng(data: any) {
    // 確認ダイアログの表示
    const result = await this.simpleDialog.confirm(
      'Confirm',
      'Do you want to delete room access datetime?');
    if (result !== 'ok') { return; }

    // 削除のクエリを実行
    const body = { sql: 'RoomAccessMng/delRoomAccessMng.sql', values: [data.id] };
    const ret: any = await this.http.post('api/query', body);
    if (ret.message !== null) {
      alert('Delete room access datetime failed\n' + ret.message);
      return;
    }

    // 再検索
    await this.searchRoomAccessMng();
  }
}
