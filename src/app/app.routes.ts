import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListThemesComponent } from './components/themes/themes.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'themes', component: ListThemesComponent},
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules });

