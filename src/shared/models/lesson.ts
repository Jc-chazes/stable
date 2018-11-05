import { Personal } from "./personal";
import { Discipline } from "./discipline";
import { Room } from "./room";
import { BaseModel } from "./base/base.model";

export class Lesson extends BaseModel<Lesson>{
    id: number;
    dateLesson: string;
    romId: number;
    romName: number;
    startTime: string;
    endTime: string;
    userId: number;
    userName: string;
    membershipId: number;
    instructorName: string;
    lessonId: number;
    status: number;
    statusLesson: number;
    disciplineName: string;
    establishmentName: string;

    disciplineId: number;
    occupancy: number;
    qReserves: number; 
    

    personal: Personal[];
    discipline: Discipline;
    room: Room;
    startDate: Date; //Usado para construcción de lecciones desde disponibilidades de un plan
    endDate: Date; //Usado para construcción de lecciones desde disponibilidades de un plan
    weekdays?: { code: string, checked: boolean, name: string }[]; //Usado para construcción de lecciones desde disponibilidades de un plan
    code: string; //Usado para construcción de lecciones desde disponibilidades de un plan

    get displayWeekdays(): string{
      if( !this.weekdays || this.weekdays.length == 0  ) return '-';
      return (this.weekdays || [])
      .filter( w => w.checked )
      .map( day => day.name.substr(0,3) ).join(' - ');
    }
}