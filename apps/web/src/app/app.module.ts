import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FlatpickrModule } from 'angularx-flatpickr';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule, registerLocaleData } from '@angular/common';

import localeJa from '@angular/common/locales/ja';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpRequestInterceptor } from './common/services/http';

import { SimpleDialogComponent } from './views/components/simpleDialog/simpleDialog.component';
import { TableDialogComponent } from './views/components/tableDialog/tableDialog.component';
import { ProgressSpinnerComponent } from './views/components/progressSpinner/progressSpinner.component';

import { UserService } from './common/services/user.service'

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

// wait for services Initialize
export function initApp(user: UserService){
    return async () => {
        console.log('initApp start.');

        const userId = localStorage.getItem('userId');
        if (!userId) {
            // auto login, if not logged in.
            await user.login('admin', '123456', { dispHome: false });
        } else {
            // get user info, if logged in.
            await user.getUser(userId);
        }

        console.log('initApp end.');
    }
}

registerLocaleData(localeJa);

@NgModule({
    declarations: [
        AppComponent,
        SimpleDialogComponent,
        TableDialogComponent,
        ProgressSpinnerComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        OverlayModule,
        FormsModule,
        ReactiveFormsModule,
        FlatpickrModule.forRoot(),
        ToastrModule.forRoot(),
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        DragDropModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        CommonModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initApp,
            deps: [UserService],
            multi: true
        },
        HttpRequestInterceptor,
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        SimpleDialogComponent,
        TableDialogComponent,
    ],
})
export class AppModule {}
