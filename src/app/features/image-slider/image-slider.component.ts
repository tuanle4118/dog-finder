import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { IDogInformation } from '@app/core/models/interfaces';
import { ApiService } from '@services/api.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css',
})
export class ImageSliderComponent implements OnInit {
  @ViewChild('swipeBox') swipeBox!: ElementRef;
  startX = 0;
  currentX = 0;
  isSwiping = false;
  dogInformation: IDogInformation[] = [];
  test_image: IDogInformation | undefined;

  constructor(
    private apiService: ApiService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.apiService.getDogImages().subscribe((res) => {
      this.dogInformation = res;
    });

    // this.apiService
    //   .getDogDetails('32')
    //   .subscribe((res) => (this.test_image = res));
  }

  onPanStart(event: any) {
    this.startX = event.center.x;
    this.isSwiping = true;
  }

  onPanMove(event: any) {
    if (this.isSwiping) {
      this.currentX = event.center.x - this.startX;
      this.renderer.setStyle(
        this.swipeBox.nativeElement,
        'transform',
        `translateX(${this.currentX}px)`,
      );
    }
  }

  onPanEnd(event: any) {
    this.isSwiping = false;

    // Animate back to original position if swipe distance is small
    if (Math.abs(this.currentX) < 100) {
      this.renderer.setStyle(
        this.swipeBox.nativeElement,
        'transition',
        'transform 0.3s ease-out',
      );
      this.renderer.setStyle(
        this.swipeBox.nativeElement,
        'transform',
        `translateX(0px)`,
      );
    } else {
      // Animate slide-out effect
      const direction = this.currentX > 0 ? '100vw' : '-100vw';
      this.renderer.setStyle(
        this.swipeBox.nativeElement,
        'transition',
        'transform 0.3s ease-out',
      );
      this.renderer.setStyle(
        this.swipeBox.nativeElement,
        'transform',
        `translateX(${direction})`,
      );

      // Reset position after animation
      setTimeout(() => {
        this.renderer.setStyle(
          this.swipeBox.nativeElement,
          'transition',
          'none',
        );
        this.renderer.setStyle(
          this.swipeBox.nativeElement,
          'transform',
          'translateX(0px)',
        );
      }, 300);
    }
  }
}
