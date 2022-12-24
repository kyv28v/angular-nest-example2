import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Pipe({ name: 'enumChange' })
export class EnumChangePipe implements PipeTransform {
  constructor(
    public translate: TranslateService,
  ) { }

  transform(id: any, enums: any): string {
    let dispStr: string = '';
    for (let i = 0; i < enums.length; i++) {
      if (enums[i].id === id) {
        // 多言語対応
        this.translate.get(enums[i].name).subscribe((res: string) => {
          dispStr = enums[i].id + ':' + res;
        });
        return dispStr;
      }
    }
    return '';
  }
}

export namespace Enums {
  // Converts an array of only selected values ​​to an array of true / false.
  // * Generate checkbox value from DB setting value.
  // Example:[1,2,5] -> [true, true, false, false, true]
  export function getSelectedList(enumList: any, valueList: any) {
    let selectedList: boolean[] = [];
    if (!valueList) return selectedList;
    enumList.forEach((e: any) => {
      selectedList.push(valueList.indexOf(e.id) !== -1);
    });
    return selectedList;
  }

  // Converts ​​an array of true / false ​​to an array of only selected values.
  // * Generate DB setting value from checkbox value.
  // Example:[true, true, false, false, true] -> [1,2,5]
  export function getSelectedValue(enumList: any, valueList: any) {
    let selectedValue: any[] = [];
    valueList.forEach((v: any, index: number) => {
      if (v) {
        selectedValue.push(enumList[index].id);
      }
    });
    return selectedValue;
  }

  // Authority
  export const Auth = [
    // Menu
    { id: 10, name: 'enums.auth.menu.view' },
    { id: 11, name: 'enums.auth.menu.add' },
    { id: 12, name: 'enums.auth.menu.edit' },
    { id: 13, name: 'enums.auth.menu.delete' },
    { id: 14, name: 'enums.auth.menu.append' },
    // Page
    { id: 20, name: 'enums.auth.page.view' },
    { id: 21, name: 'enums.auth.page.add' },
    { id: 22, name: 'enums.auth.page.edit' },
    { id: 23, name: 'enums.auth.page.delete' },
    // User
    { id: 30, name: 'enums.auth.user.view' },
    { id: 31, name: 'enums.auth.user.add' },
    { id: 32, name: 'enums.auth.user.edit' },
    { id: 33, name: 'enums.auth.user.delete' },
  ];
  // 性別
  export const Sex = [
    { id: 1, name: 'Man' },
    { id: 2, name: 'Woman' },
  ];
  // 部屋
  export const Rooms = [
    { id: '101', name: 'Controll Room' },
    { id: '102', name: 'Test Room' },
    { id: '103', name: 'Experimental Room' },
    { id: '201', name: 'Work Room' },
    { id: '301', name: 'Storage Room' },
  ];
}
