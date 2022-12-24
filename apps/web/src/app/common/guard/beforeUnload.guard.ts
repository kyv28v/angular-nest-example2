import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Router } from '@angular/router';

export interface OnBeforeunload {
    dirtyCheck: () => boolean;
    clearDirty: () => boolean;
}

@Injectable()
export class BeforeUnloadGuard implements CanDeactivate<OnBeforeunload> {
    constructor(private router: Router) {}

    canDeactivate(component: OnBeforeunload) {
        // Check at the time of screen transition.
        // It is also checked by clicking the side menu (sidebar.component.ts), but if the screen transitions by any other method, check here.
        if (component.dirtyCheck()) {
            const msg = 'このページを離れてもよろしいですか？'
              + '\n行った変更が保存されない可能性があります。';
            const ret = confirm(msg);
            if(!ret) return false;

            // Return the page data. (BeforeUnload.guard.ts also has a check process, so don't get caught there.)
            component.clearDirty();
        }
        return true;
    }
}
