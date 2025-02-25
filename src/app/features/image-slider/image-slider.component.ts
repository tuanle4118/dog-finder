import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Vote } from '@app/core/models/enums';
import {
  Actions,
  IDogInformation,
  VotePayload,
} from '@app/core/models/interfaces';
import { ApiService } from '@services/api.service';
import { ButtonModule } from 'primeng/button';
import { Subject, forkJoin } from 'rxjs';
import { ImageInformationComponent } from '../image-information/image-information.component';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [ButtonModule, CommonModule, ImageInformationComponent],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css',
})
export class ImageSliderComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    //Store latest id into local storage
    event.preventDefault();
    localStorage.setItem(
      'latestImageId',
      this.dogInformationList?.[this.currentDisplayIndex]?.id,
    );
  }

  @ViewChild('swipeBox')
  swipeBox!: ElementRef;
  startX = 0;
  currentX = 0;
  isSwiping = false;
  dogInformationList: IDogInformation[] = [];
  currentDisplayIndex = 0;
  voteEvent: Subject<Actions> = new Subject<Actions>();

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    // Check if latest image id exist in local storage
    const latestId = localStorage.getItem('latestImageId');
    if (latestId && latestId !== 'undefined') {
      forkJoin({
        latestDogInfo: this.apiService.getSpecificDog(latestId),
        dogInfoList: this.apiService.getDogInformationList(),
      }).subscribe((res) => {
        this.dogInformationList.push(res.latestDogInfo, ...res.dogInfoList);
      });
      localStorage.removeItem('latestImageId');
      return;
    }

    this.handleFetchData();
  }

  handleFetchData() {
    this.apiService.getDogInformationList().subscribe((res) => {
      this.dogInformationList.push(...res);
    });
  }

  handleVote(action: Actions) {
    const payload: VotePayload = {
      image_id: this.dogInformationList[this.currentDisplayIndex].id,
      sub_id: 'TuanLDN',
      value: Vote[action],
    };
    this.apiService.voteDog(payload).subscribe();
  }

  handleUpdateData(event: 'like' | 'dislike') {
    this.handleVote(event);
    this.currentDisplayIndex++;

    if (this.currentDisplayIndex === this.dogInformationList?.length - 3) {
      this.handleFetchData();
    }
  }

  onClickVote(event: Actions) {
    this.voteEvent.next(event);
  }
}
