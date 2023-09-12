import { Component, Input } from "@angular/core";
import { PageConfigService } from "../pageconfig.service";
import { ResolutionAwareComponent } from "../ToolFilterPage/resolutionaware.component";
import { BreadcrumbController } from "./breadcrumb-controller";

@Component({
    selector: 'kbt-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['../style/breadcrumb.css'],
    providers: []
  })
  
  export class BreadcrumbComponent extends ResolutionAwareComponent{
    private configKey: string = "breadcrumb";
    public pageData: any = null;
    public currentPageName:string|null = null;
    public gapBottom:boolean = false;
    public ready = false;
    public controller:BreadcrumbController|null = null;
    public controllerLabel:string|null = null;
    public path:any[] = [];

    @Input() public set currentPage(s:string){
          this.currentPageName = s;
    }

    @Input() public set hasGapBottom(gapBottom:boolean){
      this.gapBottom = gapBottom;
    }

    @Input() public set setController(controller:BreadcrumbController){
      this.controller = controller;
      this.controller.setBreadcrumb(this);
    }

    constructor(private configService:PageConfigService){
        super();
    }

    labelIsLink(component:any){
      let key = component.key;
      if(key === "") return false;
      return (this.pageData.items[key] != undefined);
    }

    getLabelLink(component:any):string{
      let key = component.key;
      if(key === "") return "";
     // console.log(this.pageData.items);
      if(this.pageData.items[key] !== undefined){
        return this.pageData.items[key].link;
      }
      return "";

    }

    setPath(path:any[]|null){
      if(path === null){
        this.path = [];
        return;
      }
     // console.log(path);
      this.path = path;
    }

    setLabel(label:string){
      this.controllerLabel = label;
    }

    ngOnInit() {
        this.configService.getConfigData().subscribe((value) => {
          if (value === null) {
            return;
          }
          if (this.configKey in value) {
            this.pageData = value[this.configKey];
            //console.log(this.pageData);
          }    
          this.ready = true;

        });
      }
  }