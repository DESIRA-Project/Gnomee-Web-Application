import { Component, Input } from "@angular/core";
import { DynamicContentService } from "../../ComponentLibrary/DynamicModal/dynamic-content.service";
import { DynamicItem } from "../../ComponentLibrary/DynamicModal/dynamic-item.components";
import { ActivatedItem } from "./activated-item";
import { PageFunction } from "./page-function";
import { UserListManager } from "./user-list-manager";

@Component({
    selector: 'user-function-content',
    templateUrl: './user-function-content.component.html',
})

export class UserFunctionContentComponent implements ActivatedItem{

    view:PageFunction[]|null = null;
    activeItem:number = -1;
    manager:UserListManager|null = null;
    token:string|null = null;
    tokenFetched:boolean = false;
    viewLoaded:boolean = false;

    activeComponent:DynamicItem|null = null;

    @Input() set setView(view:PageFunction[]|null){
        this.view = view;
        if(this.view !== null){
            this.activeItem = 0;
            this.setActiveComponent();
            this.viewLoaded = true;
        }
    }

    @Input() set setParent(manager:UserListManager){
        this.manager = manager;
        this.manager.setFunctionContentComponent(this);
    }

    @Input() set setToken(token:string){
        this.token = token;
        this.tokenFetched = true;
        this.setActiveComponent();
    }

    constructor(private dynContentService:DynamicContentService){

    }


    getToken():string{
        if(this.token !== null){
            return this.token;
        }
        return '';
    }

    setActiveItem(i:number){
        this.activeComponent = null;
        this.viewLoaded = false;  
         this.activeItem = i;
         this.setActiveComponent();

         setTimeout(()=>{
             this.viewLoaded = true;       
        },10);
    }

    setActiveComponent(){
        if(this.view === null) return;
        if(this.token !== null){
            this.activeComponent = this.dynContentService.getUserAuthorizedComponent(this.view[this.activeItem].name);
            return;
        }
        return;
    }
}