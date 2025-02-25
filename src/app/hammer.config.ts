import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class CustomHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: 31 }, // Allow only horizontal swipes
    pan: { threshold: 10 }, 
    pinch: { enable: true },
    rotate: { enable: true },
  };
}
