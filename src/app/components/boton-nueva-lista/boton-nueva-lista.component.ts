import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Lista } from 'src/app/models/lista.model';
import { ComprasService } from 'src/app/services/compras.service';
import { Productos } from '../../models/productos.model';

@Component({
  selector: 'app-boton-nueva-lista',
  templateUrl: './boton-nueva-lista.component.html',
  styleUrls: ['./boton-nueva-lista.component.scss'],
})
export class BotonNuevaListaComponent implements OnInit {

  @Input() producto: Productos[];
  @Input() productoIndex: number;

  nombreLista: string = '';

  constructor(private _router: Router,
              private _comprasService: ComprasService,
              private _toastCtrl: ToastController) {}
              
  ngOnInit(): void {
  }

  listas(){
    this._router.navigate(['lista']);
  }

  async crearLista(){
    
    if(this.nombreLista.trim().length == 0){ 
      const toast = await this._toastCtrl.create({
        message: 'Debe ingresar el nombre de la lista.',
        duration: 2000,
        icon: 'information-circle',
        position: 'bottom'
      });

      await toast.present();
      return;
    }

    this._comprasService.crearLista(this.nombreLista, this.producto, this.productoIndex).subscribe( list => {
      this._router.navigate(['productos', list.id]);

    })

  }

}
