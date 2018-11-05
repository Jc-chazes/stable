export class Discipline {
    id: number;
    name: string;
    color: string;
    description: string;
    establishmentId: any;
    status: string;
    byDefault: string;
    planId: number;
    establishmentName: string;
    insDate: string;
    insUser: string;
    updDate: string;
    updUser: string;
    disDate: string;
    disUser: string;
    insUserName: string;
    updUserName: string;
    type: string;

    constructor( partial?: Partial<Discipline> ){
        Object.assign(this,partial);
    }
}
