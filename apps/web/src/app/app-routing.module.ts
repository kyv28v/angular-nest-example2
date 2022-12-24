import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/guard/auth.guard';
import { BeforeUnloadGuard } from './common/guard/beforeUnload.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./views/layout/layout.module').then(m => m.LayoutModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./views/components/login/login.module').then(m => m.LoginModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
    providers: [
        AuthGuard,
        BeforeUnloadGuard,
    ]
})
export class AppRoutingModule {}
