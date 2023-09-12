import {animate, state, style, transition, trigger} from '@angular/animations';

export const myInsertRemoveTrigger = trigger('myInsertRemoveTrigger', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms', style({ opacity: 0 }))
  ])
]);

export const my180RotationTrigger = trigger('my180RotationTrigger', [
  state('initial', style({ transform: 'rotate(0)' })),
  state('rotated', style({ transform: 'rotate(180deg)'})),
  transition('initial => rotated', [
    animate('300ms')
  ]),
  transition('rotated => initial', [
    animate('300ms')
  ])
]);
