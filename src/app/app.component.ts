import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageSliderComponent } from './features/image-slider/image-slider.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageSliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
