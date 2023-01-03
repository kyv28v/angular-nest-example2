import { Component, OnInit, NgZone, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ResizedEvent } from 'angular-resize-event';

import { TranslateService } from '@ngx-translate/core';

import { SharedService } from '../../common/services/shared.service';

import '../../common/extensions/number.extensions';
import '../../common/extensions/string.extensions';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    public sidenavOpened = true;
    @HostBinding('class') componentCssClass: any;

    sidebarWidth = '265px';

    constructor(
        private ngZone: NgZone,
        public overlayContainer: OverlayContainer,
        private translate: TranslateService,
        private shared: SharedService,
    ) {
        window.onresize = (e) => {
            ngZone.run(() => {
                this.resizeWindow(window.innerWidth);
            });
        };
    }

    ngOnInit() {
        console.log('layout.ngOnInit start.')

        // ウインドウサイズの調整
        this.resizeWindow(window.innerWidth);

        // set sidebar width, if the width is straged.
        if (localStorage.getItem('sidebar.width')) {
            this.sidebarWidth = localStorage.getItem('sidebar.width') || '';
            console.log("set init sidebar width:" + this.sidebarWidth);
        }

        // set language
        this.translate.use(this.shared.language);

        // set theme
        this.onThemeChange(this.shared.theme);

        console.log('layout.ngOnInit end.')
    }

    // ウインドウサイズの調整
    private resizeWindow(width: number) {
        // ウインドウ幅が狭いときは、自動的にメニューを隠す
        if (800 < width) {
          this.sidenavOpened = true;
        } else {
          this.sidenavOpened = false;
        }
    }

    // resize sidebar width
    onResized(event: ResizedEvent) {
        const sidebarWidth = (event.newRect.width + 1).toString() + 'px';       // 1pxずれてしまうのでここで補正する
        localStorage.setItem('sidebar.width', sidebarWidth);
        console.log("set sidebar width:" + sidebarWidth);
    }

    // change theme
    public onThemeChange(theme: string) {
        this.overlayContainer.getContainerElement().classList.add(theme);
        this.componentCssClass = theme;
        this.shared.setTheme(theme);
    }
}
