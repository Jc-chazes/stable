import {Component, Injector} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RoomLayout, RoomPosition } from '../../models/room-layout.model';
import { ViewChild, ElementRef, Output, EventEmitter, ApplicationRef } from '@angular/core';


import { RoomLayoutAnimation } from './_animations/room-layout.animation';
import {Personal} from "../../models/personal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'page-room-layout',
  templateUrl: 'room-layout.html',
  animations: [
    // RoomLayoutAnimation.mainAnimation
  ]
})
export class RoomLayoutComponent implements OnInit, OnChanges {

  @Input('roomLayout') roomLayout: RoomLayout;
  @Input('mode') mode: 'create' | 'show' | 'reserve' = 'show';
  @ViewChild('positionTypeSelect') positionTypeSelect: ElementRef;
  @ViewChild('roomLayoutJSON') roomLayoutJSONElm: ElementRef
  @Output('positionSelect') positionSelect = new EventEmitter<RoomPosition>();
  adding: boolean = false;
  removing: boolean = false;
  roomLayoutFG: FormGroup;
  private fb: FormBuilder;
  get addingPositionType(): string{
    return this.positionTypeSelect.nativeElement.value;
  }
  rowsArray: any[] = [];
  colsArray: any[] = [];
  roomLayoutCapacity: number = 0;

  constructor( public appRef: ApplicationRef,private injector: Injector){
    this.roomLayout = new RoomLayout({ positions: [] });
  }

  ngOnInit() {
    if( this.mode == 'reserve' ){
      this.fb = this.injector.get(FormBuilder);
      this.roomLayoutFG = this.fb.group({
        position: [null,[Validators.required]]
      });
      this.roomLayoutFG.get('position').valueChanges.subscribe( (position: RoomPosition) => {
        this.positionSelect.emit(position);
      })
    }
  }

  updateRows(rowsCount: number){
    this.roomLayout.rows = rowsCount;
    this.rowsArray = new Array( Number( rowsCount || 0 ) );
  }

  updateCols(colsCount: number){
    this.roomLayout.cols = colsCount;
    this.colsArray = new Array( Number( colsCount || 0 ) );
  }

  onAddPosition(){
    this.adding = !this.adding;
  }

  onRoomPositionClick(position: RoomPosition | any){
    if(position && position instanceof RoomPosition){
      if( this.mode == 'reserve'){
        if( !position.occupied ){
          this.positionSelect.emit( position );
        }
      }else{
        this.positionSelect.emit( position );
      }
    }
    if( this.adding ){
      this.roomLayout.positions.push( new RoomPosition({
        x: position.x,
        y: position.y,
        occupant: this.addingPositionType == '1' ? new Personal() : null
      }) );
      this.adding = false;
    }
    if( this.removing && position instanceof RoomPosition ){
      this.roomLayout.positions.splice( this.roomLayout.positions.indexOf( position ), 1 );
      this.removing = false;
    }
  }

  onRemovePosition(){
    this.removing = true;
  }

  exportLayout(){
    this.roomLayoutJSONElm.nativeElement.value = JSON.stringify({
      rows: Number(this.roomLayout.rows),
      cols: Number(this.roomLayout.cols),
      positions: this.roomLayout.positions.map(  position => ({
        x: position.x,
        y: position.y,
        number: position.number,
        type: position.occupant && position.occupant instanceof Personal ? '1' : null
      }))
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    let roomLayout = changes.roomLayout.currentValue;
    if( roomLayout ){
      this.colsArray = new Array( Number( this.roomLayout.cols || 0 ) );
      this.rowsArray = new Array( Number( this.roomLayout.rows || 0 ) );
      this.roomLayoutCapacity = (this.roomLayout.positions || []).length;
    }
  }

  getPosition(x,y): RoomPosition{
    return ( this.roomLayout.positions || [] ).find( p => p.x == x && p.y == y);
  }

  get availablePositionList(): RoomPosition[]{
    if( !this.roomLayout ) return [];
    return (this.roomLayout.positions || []).filter( position => !position.occupied );
  }

}
