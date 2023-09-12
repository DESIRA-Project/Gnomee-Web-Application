import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { DynamicContent } from '../ComponentLibrary/DynamicModal/dynamic-content.component';
import { DynamicItem } from '../ComponentLibrary/DynamicModal/dynamic-item.components';
import { DynamicModalContainer } from '../ComponentLibrary/DynamicModal/dynamic-modal-container';
import {PageConfigService} from '../pageconfig.service';
import { AlertSupportingComponent } from '../User/ToolSuggestion/alert-supporting-component';
import { UserManagementService } from '../User/ToolSuggestion/user-management.service';
import {DatepickerRangePopupComponent} from './datepicker-range-popup/datepicker-range-popup.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent extends AlertSupportingComponent  implements OnInit, DynamicContent {

  private configKey = 'analytics';
  public pageData: any;

  data: any;

  @ViewChild(DatepickerRangePopupComponent) datePicker!: DatepickerRangePopupComponent;

  ngOnInit(): void {
    this.pageData = environment.env.analytics;
  }

  constructor(protected service:BackendService, protected userManagementService:UserManagementService,private router: Router){
    super();
}

  initialize(parent: DynamicModalContainer): void {
  }

  getUserToken(): string | null {
      return null;
  }
  initializeWithAuthData(userToken: string): void {

  }
  setDependencies(dependencies: DynamicItem[]): void {

  }

  userHasPermission(perm:string){
    return this.userManagementService === null ? false : this.userManagementService.userHasPermission(perm); 
  }

}
