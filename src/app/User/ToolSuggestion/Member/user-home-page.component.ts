import { Component } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { DynamicContent } from "src/app/ComponentLibrary/DynamicModal/dynamic-content.component";
import { DynamicItem } from "src/app/ComponentLibrary/DynamicModal/dynamic-item.components";
import { DynamicModalContainer } from "src/app/ComponentLibrary/DynamicModal/dynamic-modal-container";
import { AlertSupportingComponent } from "../alert-supporting-component";
import { UserManagementService } from "../user-management.service";

@Component({
    selector: 'user-home-page',
    templateUrl: './user-home-page.component.html',
    styleUrls:["../../../style/gnomee.css"]
})

export class UserHomePageComponent extends AlertSupportingComponent implements DynamicContent{
    data: any;
    title="Home";
    renderInCard = false;
    ready = false;
    
    constructor(protected service:BackendService,protected userManagementService:UserManagementService){
        super();
        this.ready = true;
    }
    initialize(parent: DynamicModalContainer): void {
        this.renderInCard = true;
    
    }
    getUserToken(): string | null {
        return this.userManagementService.getToken();
    }

    initializeWithAuthData(userToken: string): void {
        this.renderInCard = true;
    }

    setDependencies(dependencies: DynamicItem[]): void {

    }

    userCanAccessPage(){
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("create_tool_suggestion"); 
    }
}