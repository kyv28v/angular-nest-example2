import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { FlatpickrModule } from 'angularx-flatpickr';
import { AngularResizeEventModule } from 'angular-resize-event';

import { SidebarComponent } from './sidebar/sidebar.component';
import { TopnavComponent } from './topnav/topnav.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { EnumChangePipe } from '../../common/defines/enums';
import { SimpleGridComponent } from '../components/simpleGrid/simpleGrid.component';
import { SearchConditionComponent } from '../components/searchCondition/searchCondition.component';

import { HomeComponent } from '../pages/home/home.component';
import { UserMngComponent } from '../pages/userMng/userMng.component';
import { RoomAccessMngComponent } from '../pages/roomAccessMng/roomAccessMng.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        MatDialogModule,
        MatSortModule,
        MatTableModule,
        MatProgressSpinnerModule,
        TranslateModule,
        FormsModule,
        ToastrModule.forRoot(),
        FlatpickrModule.forRoot(),
        AngularResizeEventModule,
    ],
    declarations: [
        LayoutComponent,
        TopnavComponent,
        SidebarComponent,
        EnumChangePipe,
        SimpleGridComponent,
        SearchConditionComponent,
        HomeComponent,
        UserMngComponent,
        RoomAccessMngComponent,
    ]
})
export class LayoutModule { }
