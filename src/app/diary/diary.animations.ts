import { animate, animateChild, query, style, transition, trigger } from "@angular/animations";

export var diaryAnimations = [
  trigger('routerAnimation', [
    transition(':increment, :decrement', [
      style({
        position: 'relative'
      }),
      query(':enter', [
        style({
          position: 'absolute',
          transform: 'scale(0.93)',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: 0
        })
      ]),
      query(':leave', [
        style({
          position: 'absolute',
          transform: 'scale(1)',
          left: '0',
          height: '100%',
          width: '100%',
          opacity: 1,
        })
      ]),
      query(':leave', animateChild()),
      query(':leave', [
        animate('120ms ease-in', style({
          transform: 'scale(0.93)',
          opacity: 0
        }))
      ]),
      query(':enter', [
        animate('120ms ease-out', style({
          transform: 'scale(1)',
          opacity: 1,
        }))
      ]),
      query(':enter', animateChild()),
      // workaround to not destroy child router outlet
      query(
        'router-outlet router-outlet ~ *',
        animate('240ms', style({})),
        { optional: true }
      )
    ])
  ])
]
