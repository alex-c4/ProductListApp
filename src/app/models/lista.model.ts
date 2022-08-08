import { Productos } from "./productos.model";

export class Lista{
    id: number;
    nombre: string;
    precioDolar: number;
    productos: Productos[];

    constructor(nombre: string){
        this.nombre = nombre;
        this.id = new Date().getTime();
        this.precioDolar = 0;
        this.productos = [];
    }
}