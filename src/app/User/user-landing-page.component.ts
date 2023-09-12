import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";
import { PageFunction } from "../ComponentLibrary/DynamicSidebar/page-function"
import { UserFunctionContentComponent } from "../ComponentLibrary/DynamicSidebar/user-function-content.component";
import { UserFunctionListComponent } from "../ComponentLibrary/DynamicSidebar/user-function-list.component";
import { UserListManager } from "../ComponentLibrary/DynamicSidebar/user-list-manager";
import { UserManagementService } from "./ToolSuggestion/user-management.service";
import {Location} from '@angular/common'; 
import { BreadcrumbController } from "../Breadcrumb/breadcrumb-controller";
import { BreadcrumbComponent } from "../Breadcrumb/breadcrumb.component";
@Component({
    selector: 'user-landing',
    templateUrl: './user-landing-page.component.html',
})

export class UserLandingPageComponent implements UserListManager, BreadcrumbController{

    public firstName:string = "";
    public lastName:string = "";
    public tokenFetched:boolean = false;
    private token:string|null = null;
    public activeItem:number = 0;
    //private configKey: any = "user_landing_page";
    private pageViews: PageFunction[] = [];
    private currentUserRole:string = "";
   // private currentUserView:number = -1;
    private userFunctionList:UserFunctionListComponent|null = null;
    private userFunctionContent:UserFunctionContentComponent|null = null;
    private breadcrumb:BreadcrumbComponent|null = null;

    constructor(private jwtHelper:JwtHelperService, 
                private route: ActivatedRoute, 
                private router: Router, 
                private userManagementService:UserManagementService,
                private location: Location){

        this.token = this.userManagementService.getToken();

        if(this.token !== null){
            let s  = this.userManagementService.getUserInfo();
            this.firstName = s.firstName;
            this.lastName = s.lastName;
            this.currentUserRole = s.role;
            this.initializePageViews();
            this.tokenFetched = true;          
        }
    }
    setLabel(label: string): void {
        if(this.breadcrumb !== null){
            this.breadcrumb.setLabel(label);
        }
    }

    setPath(path:any[]|undefined):void{
        if(this.breadcrumb !== null){
            if(path === undefined){
                this.breadcrumb.setPath(null);
            }
            else{
                 this.breadcrumb.setPath(path);
            }
        }
    }

    setBreadcrumb(inst: BreadcrumbComponent): void {
         if(inst !== null){
             this.breadcrumb = inst;
         }
    }

    identifyCurrentView(){
         let url = this.router.url;
         for(let i = 0;i<this.pageViews.length;i++){
             if(url === this.pageViews[i].url){
                 this.setLabel(this.pageViews[i].breadcrumb_label);
                 this.setPath(this.pageViews[i].breadcrumb_path);
                 this.setActiveItem(i);
                 break;
             }
         }

    }

    setFunctionList(u: UserFunctionListComponent): void {
        this.userFunctionList = u;
        this.identifyCurrentView();
        this.userFunctionList.setActiveItem(this.activeItem)
    }
    setFunctionContentComponent(c:UserFunctionContentComponent): void {
        this.userFunctionContent = c;
        this.identifyCurrentView();
        this.userFunctionContent.setActiveItem(this.activeItem);
    }

    getToken():string{
        if(this.token !== null){
            return this.token;
        }
        return '';
    }

    setActiveItem(i:number){
        this.activeItem = i;
        let url = this.pageViews[this.activeItem].url;
        this.setLabel(this.pageViews[this.activeItem].breadcrumb_label);
        this.setPath(this.pageViews[this.activeItem].breadcrumb_path);
        this.location.replaceState(url);
        if(this.userFunctionContent !== null){
            this.userFunctionContent.setActiveItem(i);
        }
    }

    private initializePageViews(){
         if("user_landing_page" in environment.env){
            this.pageViews = environment.env.user_landing_page.views;             
         }  
    }

    public getCurrentUserView():PageFunction[]|null{
        return this.pageViews;
    }
}