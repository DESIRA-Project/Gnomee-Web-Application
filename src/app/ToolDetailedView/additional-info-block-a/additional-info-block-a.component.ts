import {Component, Input, OnInit} from '@angular/core';
import {BackendService} from '../../backend.service';
import {ResolutionAwareComponent} from '../../ToolFilterPage/resolutionaware.component';

@Component({
  selector: 'app-additional-info-block-a',
  templateUrl: './additional-info-block-a.component.html',
  styleUrls: ['../../style/tool-detailed-view.css']
})
export class AdditionalInfoBlockAComponent extends ResolutionAwareComponent implements OnInit {

  @Input() pageData: any = null;
  _parent:any = null;
  ready = false;

  physicalDigitalConnectionsIndex = 2;
  humanWorkReplacementExtendIndex = 12;
  interactionsBetweenHumanAndToolIndex = 13;
  dateAddedIndex = 15;
  dateModifiedIndex = 16;

  physicalDigitalConnections: any;
  humanWorkReplacementExtend: any;
  interactionsBetweenHumanAndTool: any;
  dateAdded: any;
  dateModified: any;

  @Input()
  public set parent(p: any) {
    this._parent = p;
  }

  constructor(private service: BackendService){
    super();
  }

  ngOnInit(): void {
    this.service.getData().subscribe((value)=>{
      if(value !== null){
        console.log("value");
        console.log(value);
        this.physicalDigitalConnections = value[this.physicalDigitalConnectionsIndex];
        this.humanWorkReplacementExtend = value[this.humanWorkReplacementExtendIndex];
        this.interactionsBetweenHumanAndTool = value[this.interactionsBetweenHumanAndToolIndex];
        this.dateAdded = value[this.dateAddedIndex];
        this.dateModified = value[this.dateModifiedIndex];
        this.ready = true;
      }
    });
  }

}
