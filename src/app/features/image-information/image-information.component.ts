import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Actions, Breed } from '@app/core/models/interfaces';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { Subject, skip } from 'rxjs';

@Component({
  selector: 'app-image-information',
  standalone: true,
  imports: [ButtonModule, SkeletonModule, CommonModule, DividerModule],
  templateUrl: './image-information.component.html',
  styleUrl: './image-information.component.css',
})
export class ImageInformationComponent implements OnInit {
  @Input() imageUrl: string | undefined = '';
  @Input() bredInfo: Breed | undefined;
  @Input() zIndex = 10;
  @Input() event!: Subject<Actions>;
  @Output() action = new EventEmitter<Actions>();

  @ViewChild('swipeBox')
  swipeBox!: ElementRef;
  @ViewChild('detailBox')
  detailBox!: ElementRef;
  @ViewChild('subDetail')
  subDetail!: ElementRef;

  startX = 0;
  currentX = 0;
  isSwiping = false;
  isOpenDetail = false;

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    this.event?.pipe(skip(1)).subscribe((e) => this.handleAction(e));
  }

  onPanStart(event: any) {
    if (this.isOpenDetail) return;
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

  onPanEnd() {
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
      const direction = this.currentX > 0 ? 'like' : 'dislike';
      this.handleAction(direction);
    }
  }

  handleAction(action: Actions) {
    if (this.isOpenDetail) this.handleTap();
    this.renderer.setStyle(
      this.swipeBox.nativeElement,
      'transition',
      'transform 0.3s ease-out',
    );
    this.renderer.setStyle(
      this.swipeBox.nativeElement,
      'transform',
      `translateX(${action === 'like' ? '100vw' : '-100vw'})`,
    );
    this.action.emit(action);

    this.renderer.setStyle(this.swipeBox.nativeElement, 'transition', 'none');
    this.renderer.setStyle(
      this.swipeBox.nativeElement,
      'transform',
      'translateX(0px)',
    );
  }

  handleTap() {
    this.renderer.setStyle(this.subDetail.nativeElement, 'display', 'grid');
    const height = this.isOpenDetail ? `8rem` : '100%';

    this.renderer.setStyle(
      this.detailBox.nativeElement,
      'transition',
      'height 0.3s ease-out',
    );

    this.renderer.setStyle(this.detailBox.nativeElement, 'height', height);
    this.isOpenDetail = !this.isOpenDetail;
  }
}
