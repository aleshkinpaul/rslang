import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { WrapperComponent } from './wrapper/wrapper.component';

const routes: Routes = [
{
  path: '',
  component: WrapperComponent,
  children: [
    {
      path:'',
      component:MainPageComponent,
    },
    {
      path:'mainpage',
      component:MainPageComponent,
    }
  ]
},
{
  path: '**',
  redirectTo: '/mainpage',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
