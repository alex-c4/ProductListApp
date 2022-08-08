import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { BotonNuevaListaComponent } from './boton-nueva-lista/boton-nueva-lista.component';




@NgModule({
  declarations: [
    BotonNuevaListaComponent
  ],
  imports: [
    CommonModule, 
    IonicModule,
    FormsModule
  ],
  exports: [
    BotonNuevaListaComponent
  ]
})
export class ComponentsModule { }
