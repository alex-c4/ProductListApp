import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambioListaPageRoutingModule } from './cambio-lista-routing.module';

import { CambioListaPage } from './cambio-lista.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambioListaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CambioListaPage]
})
export class CambioListaPageModule {}
