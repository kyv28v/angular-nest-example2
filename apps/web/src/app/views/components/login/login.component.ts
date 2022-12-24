import { Component, OnInit, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';

import { HttpRequestInterceptor } from '../../../common/services/http';
import { SharedService } from '../../../common/services/shared.service';
import { UserService } from '../../../common/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [ HttpRequestInterceptor ],
})
export class LoginComponent implements OnInit {
    @HostBinding('class') componentCssClass: any;

    public userId = '';
    public password = '';

    constructor(
        public overlayContainer: OverlayContainer,
        private translate: TranslateService,
        public shared: SharedService,
        private user: UserService,
    ) {}

    ngOnInit() {
        // set language
        this.translate.use(this.shared.language);

        // set theme
        this.onThemeChange(this.shared.theme);
    }

    // login
    async onLogin() {
        await this.user.login(this.userId, this.password);
    }
    async onAdminLogin() {
        await this.user.login('admin', '123456');
    }
    async onGuestLogin() {
        await this.user.login('guest', '123456');
    }

    // change theme
    public onThemeChange(theme: string) {
        this.overlayContainer.getContainerElement().classList.add(theme);
        this.componentCssClass = theme;
        this.shared.setTheme(theme);
    }
}
