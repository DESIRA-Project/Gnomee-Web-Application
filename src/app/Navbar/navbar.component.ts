import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../Auth/auth.service";
import { DynamicContentService } from "../ComponentLibrary/DynamicModal/dynamic-content.service";
import { PageConfigService } from "../pageconfig.service";
import { ResolutionAwareComponent } from "../ToolFilterPage/resolutionaware.component";
import { UserManagementService } from "../User/ToolSuggestion/user-management.service";

@Component({
    selector: 'kbt-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['../style/navbar.css'],
    providers: []
  })
  
  export class NavbarComponent extends ResolutionAwareComponent{
    private configKey: string = "navbar";
    public pageData: any = null;
    public currentPageName:string = "";
    public collapsed:boolean = true;
    public isUserAuthenticated:boolean = false;
    public authenticationObjectIndex = -1;
    public profileObjectIndex = -1;
    public modalIsOpen = false;
    public modalComponent:any = null;

    @Input() public set currentPage(s:string){
          this.currentPageName = s;
    }

    constructor(private configService:PageConfigService, private authService:AuthService, private router:Router, private userManagementService:UserManagementService,private dynContentService:DynamicContentService){
        super();
        this.isUserAuthenticated = this.authService.isAuthenticated();
    }

    openModal(modalClass:string,redirectionLinkOnAuth:string){
      if(this.userManagementService.getUserInfo() !== null){
        window.location.href = redirectionLinkOnAuth;
        return;
      }
      switch(modalClass){
        case "ToolSuggestionCreationModal":{
          this.modalComponent = this.dynContentService.getToolSuggestionCreationComponent();
          this.modalIsOpen = true;
          return;
        }
        default:{break;}
      }
      return;
    }

    toggleNavigation(){
      this.collapsed = !this.collapsed;
    }

    onModalClose(): Function {
      let parentRef = this;
      return (() => {
          if(parentRef.modalIsOpen){
              parentRef.modalIsOpen = false;
          }
      });
  }

    ngOnInit() {
        this.configService.getConfigData().subscribe((value) => {
          if (value === null) {
            return;
          }
          if (this.configKey in value) {
            this.pageData = value[this.configKey];
            for(let i = 0;i<this.pageData.items.length;i++){
              if(this.pageData.items[i].authenticated !== undefined && this.pageData.items[i].name === undefined && this.pageData.items[i].link === undefined){
                this.profileObjectIndex = i;
                continue;
              }

              if(this.pageData.items[i].authenticated !== undefined){
                this.authenticationObjectIndex = i;
                continue;
              }
            }

          }
        });
    }

    signOut(){
          this.userManagementService.clear();
    }
  }