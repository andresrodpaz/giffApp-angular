import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <div class="search-box">
      <input
        type="text"
        class="form-control"
        placeholder="Buscar gifs..."
        (keyup.enter)="searchTag()"
        #txtTagInput
      >
    </div>
  `,
  styles: [`
    .search-box {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
    }
  `]
})
export class SearchBoxComponent {

  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;

  constructor(private gifsService: GifsService) { }

  searchTag() {
    const newTag = this.tagInput.nativeElement.value;

    this.gifsService.searchTag(newTag);

    this.tagInput.nativeElement.value = '';
  }
}
