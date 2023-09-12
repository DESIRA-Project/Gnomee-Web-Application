import {Component, Input, OnInit} from '@angular/core';
import {BackendService} from '../backend.service';
import {ResolutionAwareComponent} from '../ToolFilterPage/resolutionaware.component';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['../style/tool-detailed-view.css'],
})
export class KeywordsComponent extends ResolutionAwareComponent implements OnInit {

  @Input() pageData: any = null;
  _parent:any = null;
  ready = false;
  keywordsIndex = 9;
  keywords: any;

  constructor(private service: BackendService){
    super();
  }

  @Input()
  public set parent(p: any) {
    this._parent = p;
  }

  ngOnInit(): void {
    this.service.getData().subscribe((value)=>{
      if(value !== null){
        this.keywords = value[this.keywordsIndex];
        this.ready = true;
      }
    });
  }

}
