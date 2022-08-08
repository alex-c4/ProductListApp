export class Productos{
    id: number;
    nombre: string;
    cantidad: number;
    unidad: Unidad;
    costo: number;
    comprado: boolean;

    constructor(){
        this.id = new Date().getTime();
        this.costo = 0;
        this.comprado = false;
    }
}

export enum Unidad {
    KG = "Kg",
    LT = "Lt",
    CAJA = "Caja"
}