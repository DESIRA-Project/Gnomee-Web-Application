import { Type } from "@angular/core";
import { BackendService } from "../../backend.service";
import { UserManagementService } from "../../User/ToolSuggestion/user-management.service";
import { DynamicContentService } from "./dynamic-content.service";
import { DynamicItem } from "./dynamic-item.components";

export class DynamicContentItem extends DynamicItem{
    private token:string|null = null;
    constructor(public component: Type<any>, public backend:BackendService, public userManagementService:UserManagementService) {
        super(component,backend);
    }

    setUserToken(token:string){
         this.token = token;
    }

    getUserToken():string|null{return this.token;}

}