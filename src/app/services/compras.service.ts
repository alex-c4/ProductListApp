import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Lista } from '../models/lista.model';
import { Productos } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  storageName: string = 'listaCompras'

  private _lista: Lista[] = [];
  public get lista() : Lista[] {
    return this._lista;
  }
  
  public set lista(v : Lista[]) {
    this._lista = v;
  }

  constructor() { 
    this.cargarStorage();
  }

  crearNuevaLista(lista: Lista, producto: Productos[], productoIndex: number){
    
    this.lista.push(lista);
    if(producto != null){
      this.cambiarProducto(producto, productoIndex, lista.id);
    }
    this.guardarStorage();
  }

  guardarStorage(){
    localStorage.setItem(this.storageName, JSON.stringify(this.lista))
  }

  cargarStorage(){
    if(localStorage.getItem(this.storageName)){
      this.lista = JSON.parse(localStorage.getItem(this.storageName))
    }else{
      this.lista = [];
    }
  }

  obtenerProductos(listaId: string){
    return this.lista.find( item => item.id == Number(listaId));
  }

  crearLista(nombreLista: string, _producto: Productos[] = null, _productoIndex: number = null){

    const _lista = new Lista(nombreLista);
    
    this.crearNuevaLista(_lista, _producto, _productoIndex);

    return of(_lista )
  }

  cambiarProducto(product, index, listId){
    // Elimina el producto de su lista actual
    let productToMove: Productos = product.splice(index, 1)[0];
  
    // Agrega el producto a la nueva lista
    this.lista.find( item => item.id == Number(listId)).productos.push(productToMove);
    this.guardarStorage();
    return of( true );
  }
}
