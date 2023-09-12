import { Injectable } from '@angular/core';
import { BackendService } from '../../backend.service';
import { AdminToolSuggestionModerationFormComponent } from '../../User/ToolSuggestion/Admin/admin-tool-suggestion-moderation-form.component';
import { AdminToolSuggestionsComponent } from '../../User/ToolSuggestion/Admin/admin-tool-suggestions.component';
import { CancellableOperationComponent } from './cancellable-operation.component';
import { ToolSuggestionFormComponent } from '../../User/ToolSuggestion/Member/tool-suggestion-form.component';
import { UserEditProfileComponent } from '../../User/ToolSuggestion/Member/user-edit-profile.component';
import { UserManagementService } from '../../User/ToolSuggestion/user-management.service';
import { UserToolSuggestionsComponent } from '../../User/ToolSuggestion/Member/user-tool-suggestions.component';
import { UsersManagementComponent } from '../../User/ToolSuggestion/Admin/users-management.component';
import { DynamicContentItem } from './dynamic-content-item.component';
import { DynamicItem } from './dynamic-item.components';
import { ToolListingComponent } from '../../Visualize/tool-listing.component';
import { UserHomePageComponent } from 'src/app/User/ToolSuggestion/Member/user-home-page.component';
import { ReCaptchaService } from 'src/app/ReCaptchaService/recaptcha.service';
import { DigitalToolManagementComponent } from 'src/app/User/ToolSuggestion/DTEditor/dt-management.component';
import { DigitalToolFormComponent } from 'src/app/User/ToolSuggestion/DTEditor/dt-tool-form.component';
import { ToolSuggestionCreationComponent } from 'src/app/User/tool-suggestion-creation.component';
import { AnalyticsComponent } from 'src/app/Analytics/analytics.component';

@Injectable()
export class DynamicContentService {
  constructor(private service: BackendService, private userManagementService:UserManagementService) {

  }

  public getUserManagementService():UserManagementService{
    return this.userManagementService;
  }

  getContent() {
    return [
      new DynamicItem(
        ToolListingComponent, this.service
      )
    ];
  }

  getToolListingComponent(): DynamicItem {
    return new DynamicItem(
      ToolListingComponent, this.service
    );
  }

  getCancellableOperationComponent(): DynamicItem {
    return new DynamicItem(
      CancellableOperationComponent, this.service
    );
  }

  getToolSuggestionFormComponent(): DynamicItem {
    return new DynamicItem(
      ToolSuggestionFormComponent, this.service
    );
  }

  getDigitalToolFormComponent(): DynamicItem{
    let inst = new DynamicItem(
      DigitalToolFormComponent, this.service
    );

    let cancellable = this.getCancellableOperationComponent();
    inst.setDependencies([cancellable]);
    return inst;
  }

  getAdminToolSuggestionModerationFormComponent(): DynamicItem {
    return new DynamicItem(
      AdminToolSuggestionModerationFormComponent, this.service
    );
  }

  getUserEditProfileFormComponent():DynamicItem{
    let inst = new DynamicItem(UserEditProfileComponent, this.service);
    let cancellable = this.getCancellableOperationComponent();
    inst.setDependencies([cancellable]);
    return inst;
  }

  getToolSuggestionCreationComponent():DynamicItem{
    let inst = new DynamicContentItem(
      ToolSuggestionCreationComponent, this.service, this.userManagementService
    );

    return inst;
  }

  getUserAuthorizedComponent(componentName: string): DynamicItem | null {
    switch (componentName) {
      case "toolSuggestion": {
        let inst = new DynamicContentItem(
          ToolSuggestionFormComponent, this.service, this.userManagementService
        );
        inst.setDependencies([this.getCancellableOperationComponent()]);
        return inst;

      }
      case "showUserToolSuggestions": {
        let inst = new DynamicContentItem(
          UserToolSuggestionsComponent, this.service, this.userManagementService
        );

        let cancellable = this.getCancellableOperationComponent();
        let form = this.getToolSuggestionFormComponent();
        form.setDependencies([cancellable]);
        
        inst.setDependencies([this.getCancellableOperationComponent(), form]);
        return inst;
      }
      case "editUserProfile": {
        let inst = new DynamicContentItem(UserEditProfileComponent, this.service, this.userManagementService);
        inst.setDependencies([this.getCancellableOperationComponent()]);
        return inst;
      }
      case "usersManagement": {
        let inst =  new DynamicContentItem(UsersManagementComponent, this.service, this.userManagementService);
        inst.setDependencies([this.getCancellableOperationComponent(),this.getUserEditProfileFormComponent()]);
        return inst;
      }
      case "viewAllSuggestedTools": {
        let inst = new DynamicContentItem(
          AdminToolSuggestionsComponent, this.service, this.userManagementService
        );
        inst.setDependencies([this.getCancellableOperationComponent(), this.getAdminToolSuggestionModerationFormComponent()]);

        let form = this.getAdminToolSuggestionModerationFormComponent();
        let cancellable = this.getCancellableOperationComponent();
        form.setDependencies([cancellable]);

        inst.setDependencies([this.getCancellableOperationComponent(), form]);

        return inst;
      }
      case "userHomePage":{
        return new DynamicContentItem(UserHomePageComponent, this.service, this.userManagementService);
      }
      case "dtManagement":{
        let inst = new DynamicContentItem(DigitalToolManagementComponent, this.service, this.userManagementService);
        inst.setDependencies([this.getCancellableOperationComponent(), this.getDigitalToolFormComponent()]);
        return inst;
      }

      case "userAnalytics":{
        return new DynamicContentItem(AnalyticsComponent, this.service, this.userManagementService);
      }
      
      default: return null;
    }
    return null;
  }


}