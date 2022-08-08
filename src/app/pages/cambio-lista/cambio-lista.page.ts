import { Component, OnInit } from '@angular/core';
import { Lista } from 'src/app/models/lista.model';
import { ComprasService } from 'src/app/services/compras.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Productos } from '../../models/productos.model';

@Component({
  selector: 'app-cambio-lista',
  templateUrl: './cambio-lista.page.html',
  styleUrls: ['./cambio-lista.page.scss'],
})
export class CambioListaPage implements OnInit {

  showNuevo: boolean = false;

  productId: string = '';
  listIdOld: string = '';
  listaLocal: Lista[] = [];
  producto: Productos[];
  productoIndex: number;

  public get lista() : Lista[] {
    return this._comprasService.lista;
  }

  constructor(private _comprasService: ComprasService,
              private _router: Router,
              private _toastCtrl: ToastController,
              private _activateRoute: ActivatedRoute) { 

    this.productId = this._activateRoute.snapshot.paramMap.get('productId');
    this.listIdOld = this._activateRoute.snapshot.paramMap.get('listId');
  }

  ngOnInit() {
    this.listaLocal = [... this.lista.filter( item => item.id != Number(this.listIdOld)) ];
  }

  async mostrarNuevo(value){
    const listId: string = value.target.value;
    let product: Productos[];

    if(listId == '0'){
      this.showNuevo = true;
      let result = this.getIndex();
      this.producto = result.producto;
      this.productoIndex = result.index;
      // this.cambiarProducto(product, index, listId);
      
    }else{
      // Mover producto a nueva lista
      debugger
      // Busca el producto en su lista actual
      let index: number = -1;
      let result = this.getIndex();
      index = result.index;
      product = result.producto;

      if(index >= 0){
        this.cambiarProducto(product, index, listId);
        return;
      }

      const toast = await this._toastCtrl.create({
        message: 'No se encontró una lista con ese identificador',
        duration: 2000,
        icon: 'information-circle',
        position: 'bottom'
      });
      
      await toast.present();
      this.showNuevo = false;

    }
  }

  irListaPage(){
    this._router.navigate(['lista']);
  }

  getIndex(){
    let idx: number = -1;
    let product: Productos[];
    this.lista.forEach(item => {
      let index = item.productos.findIndex( (item) => item.id == Number(this.productId) );
      if(index >= 0){
        idx = index;
        product = item.productos;
      }
    });

    return {index: idx, producto: product};
  }

  cambiarProducto(product, index, listId){
    this._comprasService.cambiarProducto(product, index, listId).subscribe( result => {
      this._router.navigate(['productos', listId]);
    })
  }


}
