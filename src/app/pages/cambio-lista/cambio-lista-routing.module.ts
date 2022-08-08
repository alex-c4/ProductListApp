import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioListaPage } from './cambio-lista.page';

const routes: Routes = [
  {
    path: '',
    component: CambioListaPage
  },
  {
    path: ':productId/:listId',
    component: CambioListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambioListaPageRoutingModule {}
