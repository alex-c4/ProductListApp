import { Component, Input, OnInit } from '@angular/core';
import { Lista } from 'src/app/models/lista.model';
import { ComprasService } from 'src/app/services/compras.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {

  
  public get lista() : Lista[]{
    return this._comprasService.lista;
  }
  
  constructor(private _comprasService: ComprasService,
              private _router: Router,
              private _alertCtrl: AlertController) { 
    this._comprasService.cargarStorage();

  }

  ngOnInit() {
  }

  show(lista: Lista){
    this._router.navigate(['productos', lista.id])
  }

  async borrar(index: number, sliding){
    const alert = await this._alertCtrl.create(
      {
        header: 'Borrar lista',
        message: `¿Desea realmente borrar la lista "<strong>${ this.lista[index].nombre }</strong>"?`,
        animated: true,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => { sliding.close(); }
          },
          {
            text: 'Aceptar',
            handler: () => {
              this.lista.splice(index, 1);
              this._comprasService.guardarStorage();
              sliding.close();
            }
          }
        ]
      }
    );

    alert.present();
  }

  async editar(index: number, nombre: string, sliding){
    sliding.close();
    
    const alert = await this._alertCtrl.create({
      header: 'Editar nombre',
      inputs: [
        {
          type: 'text',
          value: nombre,
          name: 'nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Actualizar',
          handler: (data) => {
            
            this.lista[index].nombre = data.nombre;

            this._comprasService.guardarStorage();
          }
        }
      ]
    });

    await alert.present();
  }

  async addLista(){
    const alert = await this._alertCtrl.create({
      header: 'Crear lista',
      inputs: [
        {
          type: 'text',
          name: 'nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            
            this._comprasService.crearLista(data.nombre).subscribe( resp => {
              this._comprasService.guardarStorage();
              this._router.navigate(['productos', resp.id]);
            });

          }
        }
      ]
    });

    await alert.present();
  }

  isFinished(lista: Lista){
    let idx = lista.productos.findIndex( item => item.comprado == false);
    return (idx < 0);
  }
  getColor(lista: Lista){
    let _color: string = ''
    if(this.isFinished(lista)){
      _color = 'success';
    }

    return _color
  }

}
