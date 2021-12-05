import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";
import * as Hammer from 'hammerjs';

@Injectable()
export class AppHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    pan: { direction: Hammer.DIRECTION_HORIZONTAL }
  }

  buildHammer(element: HTMLElement) {
      let config = new Hammer(element, {
          touchAction: 'pan-y'
      });
      return config;
  }
}
