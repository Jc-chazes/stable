import { trigger, transition, query, stagger, animate, style } from "@angular/animations";

export class RoomLayoutAnimation{

    static mainAnimation = trigger('roomLayoutAnimation',[
        transition(':enter, * => *',[
            query('.roomLayout__position', [
                style({ opacity: 0 }),
                // stagger(15,[
                    animate('0.3s', style({ opacity: 1 }))
                // ])
            ], { optional: true })
        ])
    ])

}