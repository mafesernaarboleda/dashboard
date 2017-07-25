import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListThemesComponent } from './components/themes/themes.component';

export const AppRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'themes', component: ListThemesComponent},
];
