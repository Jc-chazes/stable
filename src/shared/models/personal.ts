export class Personal {

  id: number;
  establishmentId: string;
  roleId: number;
  typeUser: string;
  code: string;
  nroUser: string;
  dni: string;
  name: string;
  lastName: string;
  email: string;
  photo: string;
  emergencyPhone: string;
  emergencyName: string;
  status: string;
  districtId: number;
  birthDate: string;
  gender: string;
  roleName: string;
  phone: string;
  celPhone: string;
  alert: string;
  insDate: string;
  insUser: string;
  updDate: string;
  updUser: string;
  disDate: string;
  disUser: string;
  insUserName: string;
  updUserName: string;
  address: string;
  fingerprint: any;


  constructor(partial? : Partial<Personal>){
    Object.assign(this,partial);
  }
}
