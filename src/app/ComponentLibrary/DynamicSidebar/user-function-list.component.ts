import { Component, Input } from "@angular/core";
import { ActivatedItem } from "./activated-item";
import { PageFunction } from "./page-function";
import { UserListManager } from "./user-list-manager";
import { UserManagementService } from "../../User/ToolSuggestion/user-management.service";

@Component({
    selector: 'user-function-list',
    templateUrl: './user-function-list.component.html',
    styleUrls:['../../style/user-function-list.css']
})

export class UserFunctionListComponent implements ActivatedItem{
    view:PageFunction[]|null = null;
    activeItem:number = -1;
    manager:UserListManager|null = null;

    @Input() set setView(view:PageFunction[]|null){
        this.view = view;
        if(this.view !== null){
            this.activeItem = 0;
        }
    }

    @Input() set setParent(manager:UserListManager){
        this.manager = manager;
        this.manager.setFunctionList(this);
    }

    constructor(private userManagementService:UserManagementService){

    }

    itemCanBeViewed(func:PageFunction):boolean{
        if(func === null) return false;
        if(func.permissions == undefined || func.permissions.length === 0) return true;
        return this.userManagementService.userHasAdequatePermissions(func.permissions);
    }

    setActiveItem(i:number){
        this.activeItem = i;
        if(this.manager){
            this.manager.setActiveItem(i);
        } 
    }
}