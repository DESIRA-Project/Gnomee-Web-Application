import {Component, Input, OnInit} from '@angular/core';
import {ResolutionAwareComponent} from '../../ToolFilterPage/resolutionaware.component';
import {BackendService} from '../../backend.service';

@Component({
  selector: 'app-general-info-block-b',
  templateUrl: './general-info-block-b.component.html',
  styleUrls: ['../../style/tool-detailed-view.css']
})
export class GeneralInfoBlockBComponent extends ResolutionAwareComponent implements OnInit {

  @Input() pageData: any = null;

  _parent:any = null;
  ready = false;

  targetUsersIndex = 3;
  digitalTechnologyUsedIndex = 11;
  digitalTechnologiesIndex = 1;
  maturityLevelIndex = 4;
  usesSensitiveDataIndex = 14;
  requiresInternetToOperateIndex = 7;
  collectsDataFromUsersIndex = 8;

  targetUsers: any;
  digitalTechnologyUsed: any;
  digitalTechnologies: any;
  maturityLevel: any;
  usesSensitiveData: any;
  requiresInternetToOperate: any;
  collectsDataFromUsers: any;

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
        this.targetUsers = value[this.targetUsersIndex];
        this.digitalTechnologyUsed = value[this.digitalTechnologyUsedIndex];
        this.digitalTechnologies = value[this.digitalTechnologiesIndex];
        this.maturityLevel = value[this.maturityLevelIndex];
        this.usesSensitiveData = value[this.usesSensitiveDataIndex];
        this.requiresInternetToOperate = value[this.requiresInternetToOperateIndex];
        this.collectsDataFromUsers = value[this.collectsDataFromUsersIndex];
        this.ready = true;
      }
    });
  }


}
