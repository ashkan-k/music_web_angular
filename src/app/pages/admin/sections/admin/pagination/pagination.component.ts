import {Component, Input, OnInit, OnChanges, SimpleChange, Output, EventEmitter} from '@angular/core';
import {GlobalPropertiesService} from "../../../../../services/global-properties.service";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  offset: number = 0;
  current_page_number: number = 1;
  pages_count: number = 0;

  @Input() meta_data: any;
  @Output() GetPaginatedData = new EventEmitter<any>();

  constructor(private global_properties: GlobalPropertiesService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChange) {
    // @ts-ignore
    if (changes['meta_data'] && this.meta_data) {
      this.GetPages();
    }
  }

  GetNextPage(){
    return this.current_page_number + 1;
  }

  GetPrevPage(){
    return this.current_page_number - 1;
  }

  Paginate(page: number){
    this.offset = (page - 1) * this.global_properties.PAGINATION_NUMBER;
    this.offset = this.offset > 0 ? this.offset : 0;
    this.current_page_number = page;
  }

  GetPages(){
    var pages = [];

    if (this.meta_data && this.meta_data['paging']){
      pages =  new Array(Math.ceil(parseInt(this.meta_data['paging']['total']) / this.global_properties.PAGINATION_NUMBER))
    }

    this.pages_count = pages.length;
    return pages;
  }

  GetData(page: number = 1){
    this.Paginate(page);
    this.GetPaginatedData.emit(this.offset);
  }
}
