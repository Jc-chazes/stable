export class Room {
	id: number;
	name: string;
	description: string;
	establishmentId: any;
	ocupacy: string;
	insDate: string;
  insUser: string;
  updDate: string;
  updUser: string;
  disDate: string;
	disUser: string;
	
	constructor(partial?: Partial<Room>){
		Object.assign(this,partial);
	}
}
