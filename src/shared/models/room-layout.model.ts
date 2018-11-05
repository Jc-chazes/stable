import { Personal } from "./personal";
import { Client } from "./client";
import { Room } from "./room";

export class RoomLayout{
    rows?: number = 0;
    cols?: number = 0;
    capacity?: number = 0;
    positions?: RoomPosition[] = [];
    room: any;

    constructor(partial?: Partial<RoomLayout>){
        Object.assign(this,partial);
    }
}

export class RoomPosition{
    x?: number = 0;
    y?: number = 0;
    number?: number = 0;
    imageUrl?: string = '';
    ratioSize?: number = 1;

    // occupant?: Personal | Client;
    private _occupant: Personal | Client;
    get occupant(): Personal | Client{        
        return this._occupant;
    }
    set occupant(value: Personal | Client){
        if( value instanceof Personal ){
            this.type = 'teacher';
        }else{
            this.type = 'point';
        }
        if( !value ){
            this.occupied = false;
        }else{
            this.occupied = true;
        }
        this.updateHtmlClass();
        this._occupant = value;
    }

    constructor(partial?: Partial<RoomPosition>){
        Object.assign(this,partial);
    }

    type: string;
    occupied: boolean;

    htmlClass: any = { 'exists': true }; //Por temas de performance, el cálculo de la clase Html se hace en el modelo

    private updateHtmlClass(){
        this.htmlClass = {
            'exists': true,
            'occupied': this.occupied,
            'teacher': this.type == 'teacher'? true : false
        };
    }

    // get type(): string{
    //     if( this.occupant instanceof Personal ){
    //         return 'teacher';
    //     }
    //     return 'point';
    // }

    // get occupied(): boolean{
    //     return !!this.occupant;
    // }
}
