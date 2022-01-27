import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from 'src/app/features/pages/main-page/main-page.component';
import { PagesModule } from 'src/app/features/pages/pages.module';

import { WrapperComponent } from './wrapper/wrapper.component';

const routes: Routes = [
{
  path: '',
  component: WrapperComponent,
  children: [
    {
      path: '',
      loadChildren: () => import ('./../../../features/pages/pages.module').then(m => m.PagesModule)
    },
    {
      path: 'mainpage',
      loadChildren: () => import ('./../../../features/pages/pages.module').then(m => m.PagesModule)
    }

  ]
},
{
  path: '**',
  redirectTo: '',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
