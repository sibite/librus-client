import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class ClickEffectService {
  onPointerDown = new Subject<PointerEvent>();
  onPointerUp = new Subject<PointerEvent>();

  constructor() {
    document.addEventListener('pointerdown', event => {
      this.onPointerDown.next(event);
    });

    document.addEventListener('pointerout', event => {
      this.onPointerUp.next(event);
    });

    document.addEventListener('pointerup', event => {
      this.onPointerUp.next(event);
    });

    document.addEventListener('pointercancel', event => {
      this.onPointerUp.next(event);
    });
  }
}
