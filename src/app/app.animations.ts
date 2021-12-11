import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

let transitionStyle = '500ms cubic-bezier(0.2, 0.5, 0.4, 1)';
let transitionFn = 'cubic-bezier(0.2, 0.5, 0.4, 1)';

export var appAnimations = [
  trigger('routerAnimation', [

    // on increment / on slide to right

    transition(':increment', [
      style({
        position: 'relative'
      }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: 'var(--bg-color-1)'
        })
      ]),
      query(':enter', [
        style({
          left: '100%',
          zIndex: 1,
          //boxShadow: '-101vw 0 0 1vw rgba(0, 0, 0, 0)'
        })
      ]),
      query(':leave', [
        style({
          zIndex: 0
        })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate(transitionStyle, style({
            left: '-20%',
            zIndex: 0
          }))
        ]),
        query(':enter', [
          animate(transitionStyle, style({
            left: '0%',
            //boxShadow: '-101vw 0 0 1vw rgba(0, 0, 0, 0.7)'
          }))
        ])
      ]),
      query(':enter', animateChild()),
      // workaround to not destroy child router outlet
      query(
        'router-outlet ~ *',
        animate(500, style({})),
        { optional: true }
      )
    ]),

    // on decrement / on slide to left

    transition(':decrement', [
      style({
        position: 'relative'
      }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: 'var(--bg-color-1)'
        })
      ]),
      query(':enter', [
        style({
          left: '-20%',
          zIndex: 0
        })
      ]),
      query(':leave', [
        style({
          left: '0%',
          zIndex: 1,
          boxShadow: '-101vw 0 0 1vw rgba(0, 0, 0, 0.7)'
        })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate(transitionStyle, style({
            left: '100%',
            boxShadow: '-101vw 0 0 1vw rgba(0, 0, 0, 0)'
          }))
        ]),
        query(':enter', [
          animate(transitionStyle, style({
            left: '0%'
          }))
        ])
      ]),
      query(':enter', animateChild()),
      // workaround to not destroy child router outlet
      query(
        'router-outlet ~ *',
        animate(500, style({})),
        { optional: true }
      )
    ])
  ]),

  // window pop up animation

  trigger('popUpAnimation', [
    transition('void => *', [
      group([
        query('.overlay', [
          style({
            opacity: 0
          }),
          animate(`170ms ${transitionFn}`, style({
            opacity: '*'
          }))
        ]),
        query('.window', [
          style({
            opacity: 0,
            transform: 'scale(0.6)'
          }),
          animate(`300ms ${transitionFn}`, style({
            opacity: 1,
            transform: 'scale(1)'
          }))
        ])
      ])
    ]),
    transition('* => void', [
      group([
        query('.overlay', [
          style({
            opacity: '*'
          }),
          animate(`170ms ${transitionFn}`, style({
            opacity: 0
          }))
        ]),
        query('.window', [
          style({
            opacity: 1,
            transform: 'scale(1)'
          }),
          animate(`200ms ${transitionFn}`, style({
            opacity: 0,
            transform: 'scale(0.6)'
          }))
        ])
      ])
    ])
  ])
]
