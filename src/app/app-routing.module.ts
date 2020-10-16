import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from './error-page/error-page.component';
import {PwaStartComponent} from './pwa-start/pwa-start.component';
import {ImageListComponent} from './image-list/image-list.component';
import {SettingsComponent} from './settings/settings.component';
import {MenuOverviewComponent} from './menu-overview/menu-overview.component';
import {CampusListComponent} from './campus-list/campus-list.component';
import {DebugComponent} from './debug/debug.component';
import {CampusDayMenuComponent} from './campus-day-menu/campus-day-menu.component';
import {CampusDaysListComponent} from './campus-days-list/campus-days-list.component';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {LoginGuard} from './service-login/login.guard';
import {LoginComponent} from './login/login.component';


const routes: Routes = [
  {path: '', component: CampusListComponent, pathMatch: 'full'},
  {path: 'pwa_start', component: PwaStartComponent, pathMatch: 'full'},
  {path: 'debug', component: DebugComponent},
  // {path: 'error-page', component: ErrorPageComponent},
  {path: 'images', component: ImageListComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'overview/:date', component: MenuOverviewComponent},
  {path: 'campus/:campus/d/:date', component: CampusDayMenuComponent},
  {path: 'campus/:campus/w/:week', component: CampusDaysListComponent},
  {path: 'campus/:campus', component: CampusDaysListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'admin', component: AdminPanelComponent, canActivate: [LoginGuard]},
  {path: '**', component: ErrorPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
