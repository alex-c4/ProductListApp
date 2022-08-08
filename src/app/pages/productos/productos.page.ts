import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonItemSliding, IonList, ToastController } from '@ionic/angular';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Button } from 'protractor';
import { ComprasService } from 'src/app/services/compras.service';
import { Lista } from '../../models/lista.model';
import { Productos } from '../../models/productos.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  ColumnMode = ColumnMode;

  lista: Lista;

  nombreProducto: string = '';
  precioDolar: number;
  totalDolares: number;
  totalBolivares: string;
  
  
  constructor(private _comprasService: ComprasService,
              private _activateRoute: ActivatedRoute,
              private _alertCtrl: AlertController,
              private _toastCtrl: ToastController,
              private _router: Router) { 
  }

  ngOnInit() {
    const listaId = this._activateRoute.snapshot.paramMap.get('listaId');
    this.lista = this._comprasService.obtenerProductos(listaId);
    this.calcularTotalDolares(this.lista.productos);

    // console.log(this.lista);
  }
   
  async agregarProducto(){
    const alert = await this._alertCtrl.create({
      header: 'Producto',
      animated: true,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Ingrese la cantidad'
        },
        {
          name: 'unidad',
          type: 'text',
          placeholder: 'Und/Kg/Gr/Lt',
        },
        {
          name: 'nombre',
          value: '',
          type: 'text',
          placeholder: 'Ingrese nombre del producto'
        },
        {
          name: 'costo',
          type: 'text',
          placeholder: 'Costo del producto'
        }
      ],
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data: Productos) => {

            if(data.nombre.trim() == '' || Number(data.cantidad) == 0){
              const toast = await this._toastCtrl.create({
                message: 'Debe ingresar al menos la  Cantidad y el nombre del producto',
                duration: 2000,
                icon: 'information-circle',
                position: 'bottom'
              });

              await toast.present();

              return;
            }

            const producto = new Productos();
            producto.nombre = data.nombre.trim();
            producto.cantidad = Number(data.cantidad);
            producto.unidad = data.unidad;
            if(data.costo.toString().trim() == ''){
              data.costo = 0;
            }
            let costo = this.quitarComa(data.costo)
            producto.costo = parseFloat(costo);
            

            this.lista.productos.push(producto);

            this._comprasService.guardarStorage();

          }
        },
      ]
    });

    alert.present();
    
  }

  async editar(producto: Productos, listaProductos: Productos[], sliding){

    // let producto: Productos = lista.productos.find( p => p.id == productoId);
    // console.log(producto);
    
    sliding.close();

    const alert = await this._alertCtrl.create({
      animated: true,
      inputs: [
        {
          name: 'cantidad',
          placeholder: 'Ingrese la cantidad',
          type: 'number',
          value: producto.cantidad
        },
        {
          name: 'unidad',
          placeholder: 'Und/Kg/Gr/Lt',
          type: 'text',
          value: producto.unidad,
        },
        {
          name: 'nombre',
          placeholder: 'Ingrese nombre del producto',
          type: 'text',
          value: producto.nombre
        },
        {
          name: 'costo',
          placeholder: 'Costo del producto',
          type: 'number',
          value: producto.costo
        }
        
      ],
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Actualizar',
          handler: (data: Productos) => {
            
            if(data.nombre.trim() == ''){
              return;
            }
            debugger
            producto.nombre = data.nombre;
            producto.cantidad = Number(data.cantidad);
            producto.unidad = data.unidad;
            let costo = this.quitarComa(data.costo)
            producto.costo = parseFloat(costo);
            
            // let index = listaProductos.findIndex( i => i.id == producto.id);
            // this.lista.productos[index] = producto;

            this._comprasService.guardarStorage();

          }
        },
      ]
    });

    alert.present();

  }

  async eliminar(producto: Productos, sliding){
    const alert = await this._alertCtrl.create({
      header: 'Eliminar',
      message: `¿Deseal eliminar el producto ${ producto.nombre }?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { sliding.close(); }
        },
        {
          text: 'Eliminar',
          handler: () => {
            const newProduct = this.lista.productos.filter( item => item.id != producto.id);
            this.lista.productos = newProduct;
            this._comprasService.guardarStorage();
            sliding.close();
          }
        }
      ]
    });

    await alert.present();
  }

  total(producto: Productos){
    return (producto.cantidad * producto.costo).toFixed(2);
  }

  actualizarPrecioDolar(event){
    let precioDolar: string = this.quitarComa(event.target.value);
    
    this.lista.precioDolar = parseFloat(precioDolar);
    this.calcularTotalDolares(this.lista.productos);
    this._comprasService.guardarStorage();
  }

  quitarComa(value: any){
    if(value == ''){
      return 0;
    }
    if(typeof value == 'number'){
      return value;
    }

    return value.replaceAll(',', '.');
  }

  comprado(producto: Productos){
    producto.comprado = producto.comprado;

    this.calcularTotalDolares(this.lista.productos);
    this._comprasService.guardarStorage();
  }

  calcularTotalDolares(products: Productos[]){
    let total = 0;
    products.forEach(item => {
      if(item.comprado){
        total = total + Number(this.total(item));
      }
    });

    this.totalDolares = total;
    this.totalBolivares = (total * this.lista.precioDolar).toFixed(2);
  }

  cambiarDeLista(productId: number){
    this._router.navigate(['cambio-lista', productId, this.lista.id]);
  }

  irListaPage(){
    this._router.navigate(['lista']);
  }

  getColor(comprado: boolean){
    return (comprado) ? 'success' : 'light';
  }
  
}
