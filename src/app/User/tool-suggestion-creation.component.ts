import { Component, Inject, Input, NgZone } from "@angular/core";
import { DynamicContent } from "../ComponentLibrary/DynamicModal/dynamic-content.component";
import { AlertSupportingComponent } from "./ToolSuggestion/alert-supporting-component";
import { DynamicItem } from "../ComponentLibrary/DynamicModal/dynamic-item.components";
import { DynamicModalContainer } from "../ComponentLibrary/DynamicModal/dynamic-modal-container";
import { AttachableButton } from "../ComponentLibrary/attachable-button";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { UserManagementService } from "./ToolSuggestion/user-management.service";

@Component({
    selector: 'tool-suggestion-creation',
    templateUrl: './tool-suggestion-creation.component.html',
    styleUrls:["../style/gnomee.css"]
})

export class ToolSuggestionCreationComponent extends AlertSupportingComponent implements DynamicContent{
    data: any;
    parent:DynamicModalContainer|null = null;
    constructor(     private router: Router, private ngZone: NgZone, private userManagement:UserManagementService
        ){
        super();
    }
    
    initialize(parent: DynamicModalContainer): void {
        let inst = this;
        this.parent = parent;        
        console.log(this.userManagement.getUserInfo() === null);
        let label:string = this.userManagement.getUserInfo() === null ? "Sign in" : "Visit Home Profile";
        let loginButton:AttachableButton = new AttachableButton(label,()=>{
            return true;
        
        },()=>{
            inst.ngZone.run(() => {
                inst.parent?.closeModal();
                inst.router.navigateByUrl(environment.env.signIn.redirectionLink);
            });
        },"btn gnomee-button-in-toolbar-gap gnomee-button btn-primary");

        this.parent.addButton(loginButton);
    }
    getUserToken(): string | null {
        return null;
    }
    initializeWithAuthData(userToken: string): void {

    }
    
    setDependencies(dependencies: DynamicItem[]): void {
    }
}