import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AuthService } from "./auth.service";
import { AppService } from "./app.service";
import {Room} from "../shared/models/room";
import {RoomLayout, RoomPosition} from "../shared/models/room-layout.model";
import { Personal } from "../shared/models/personal";
import {Client} from "../shared/models/client";
import { Lesson } from "../shared/models/lesson";
import { ApiUtil } from "../shared/utils/api.util";
import { HttpParams } from "@angular/common/http";

@Injectable()
export class RoomsLayoutsService {
  constructor(
    private api: ApiUtil
  ) {

  }

  findOne(room, lesson?: Lesson): Observable<RoomLayout> {
    // let url = `${this.app.gateway}/api/rooms/${room.id}/layout`;
    let params = lesson ? new HttpParams({fromObject: {lesson: lesson.id + ''}}) : new HttpParams();
    return this.api.get(`rooms/${room.id}/layout`, {params}).map(resp => {
      console.log('respuestaa',resp)
      let rawLayout = JSON.parse(resp.data[0].layout);
      let clientsPositions: any[] = resp.data.slice(1).map(roomLayoutPosition => ({
        x: roomLayoutPosition.layoutPositionX,
        y: roomLayoutPosition.layoutPositionY,
      }))
      let allPositions: RoomPosition[] = (rawLayout.positions || [])
        .map(pos => new RoomPosition({
          x: pos.x,
          y: pos.y,
          ratioSize: pos.ratioSize,
          number: pos.number || 0,
          occupant: pos.type == '1' ?
            new Personal() :
            clientsPositions.find(clientPosition => clientPosition.x == pos.x && clientPosition.y == pos.y) ?
              new Client() : null
        }));
      allPositions = allPositions.sort((prev, curr) => {
        if (prev.number > curr.number) return 1
        else if (prev.number < curr.number) return -1;
        return 0;
      })
      let roomLayout = new RoomLayout({
        room: room,
        cols: rawLayout.cols,
        rows: rawLayout.rows,
        capacity: Number(room.ocupacy),
        positions: allPositions
      });
      return roomLayout;
    })
      .catch(err => {
        console.error('RoomsLayoutsService.findOne::', err);
        return Observable.of(null);
      })
  }
}
// @Injectable()
// export class RoomsLayoutsService{
//   constructor(
//     private auth: AuthService,
//     private app: AppService
//   ){
//
//   }
//
//   findOne( room: Room ): Observable<RoomLayout>{
//     // let url = `${this.app.gateway}/api/rooms/${room.id}/layout`;
//     // return this.auth.get(url).map( resp => {
//     //   let respData = resp.json().data;
//     //   let layout = JSON.parse(respData.layout);
//     //   return new RoomLayout({
//     //     room: room,
//     //     cols: layout.cols,
//     //     rows: layout.rows,
//     //     positions: (layout.positions || []).map( pos => new RoomPosition({ ...pos }))
//     //   });
//     // })
//     //   .catch(err=>{
//     //     console.error('RoomsLayoutsService.findOne::',err);
//     //     return Observable.of(null);
//     //   })
//      // @ts-ignore
//     return Observable.of<RoomLayout>({
//          rows: 5,
//          cols: 13,
//          positions: [
//              new RoomPosition({ x: 0, y: 0, number: 1 }),
//              new RoomPosition({ x: 1, y: 0, number: 2 }),
//              new RoomPosition({ x: 2, y: 0, number: 3 }),
//             new RoomPosition({ x: 6, y: 0, occupant: new Personal(), ratioSize: 2 }),
//            new RoomPosition({ x: 10, y: 0, number: 4 }),
//              new RoomPosition({ x: 11, y: 0, number: 5 }),
//              new RoomPosition({ x: 12, y: 0, number: 6 }),
//              new RoomPosition({ x: 0, y: 1, number: 7 }),
//              new RoomPosition({ x: 1, y: 1, number: 8 }),
//              new RoomPosition({ x: 2, y: 1, number: 9 }),
//              new RoomPosition({ x: 10, y: 1, number: 10 }),
//              new RoomPosition({ x: 11, y: 1, number: 11 }),
//              new RoomPosition({ x: 12, y: 1, number: 12 }),
//              new RoomPosition({ x: 0, y: 2, number: 13 }),
//              new RoomPosition({ x: 1, y: 2, number: 14 }),
//              new RoomPosition({ x: 2, y: 2, number: 15 }),
//              new RoomPosition({ x: 3, y: 2, number: 16 }),
//             new RoomPosition({ x: 4, y: 2, number: 17 }),
//              new RoomPosition({ x: 5, y: 2, number: 18 }),
//              new RoomPosition({ x: 6, y: 2, occupant: new Client(), number: 19 }),
//              new RoomPosition({ x: 7, y: 2, occupant: new Client(), number: 20 }),
//              new RoomPosition({ x: 8, y: 2, number: 21 }),
//             new RoomPosition({ x: 9, y: 2, occupant: new Client(), number: 22 }),
//             new RoomPosition({ x: 10, y: 2, number: 23 }),
//              new RoomPosition({ x: 11, y: 2, number: 24 }),
//              new RoomPosition({ x: 12, y: 2 , number: 25}),
//              new RoomPosition({ x: 3, y: 3, number: 26 }),
//             new RoomPosition({ x: 4, y: 3, number: 27 }),
//              new RoomPosition({ x: 5, y: 3, number: 28 }),
//             new RoomPosition({ x: 6, y: 3, occupant: new Client(), number: 29 }),
//              new RoomPosition({ x: 7, y: 3, number: 30 }),
//            new RoomPosition({ x: 8, y: 3, number: 31 }),
//            new RoomPosition({ x: 9, y: 3, number: 32 }),
//            new RoomPosition({ x: 10, y: 3, number: 33 }),
//           new RoomPosition({ x: 2, y: 4, number: 34 }),
//             new RoomPosition({ x: 3, y: 4, number: 35 }),
//            new RoomPosition({ x: 4, y: 4, number: 36 }),
//             new RoomPosition({ x: 5, y: 4, number: 37 }),
//             new RoomPosition({ x: 6, y: 4, number: 38 }),
//           new RoomPosition({ x: 7, y: 4, occupant: new Client(), number: 39 }),
//             new RoomPosition({ x: 8, y: 4, number: 40 }),
//           new RoomPosition({ x: 9, y: 4, number: 41 }),
//           new RoomPosition({ x: 10, y: 4, number: 42 }),
//           new RoomPosition({ x: 11, y: 4, number: 43 }),
//         ]
//     });
//   }
// }
