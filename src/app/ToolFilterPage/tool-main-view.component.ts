import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BackendService } from "../backend.service";
import { PageConfigService } from "../pageconfig.service";

@Component({
    selector: 'tool-main-view',
    templateUrl: './tool-main-view.component.html',
    styleUrls:['../style/tool-main-view.css']
  })

export class ToolMainView{
    data:any = [];
    dataFetched:boolean = false;
    _parent:any = null;
    domainNames:any = {};
    @Input() pageData:any;

    @Input()
    public set parent(p: any) {
      this._parent = p;
      this._parent.addChild(this);
    }

    constructor(private service: BackendService,private router: Router){
    }

    getParent(){
        return this._parent;
    }

    getDomainNameImg(labelId:number) : string|null{
        if(this.domainNames[labelId] === undefined){
          return null;
        }
        let domainName = this.domainNames[labelId];
        for(let i:number = 0 ;i<this.pageData.imgs.length;i++){
          if(this.pageData.imgs[i].id === domainName){
            return this.pageData.imgs[i].file;
          }
        }
        return null;

    }

    openToolDetailedViewPage(id:string){
        if(this.pageData.tool_detailed_url !== undefined){
             this.router.navigateByUrl(this.pageData.tool_detailed_url+"/"+id);
        }
    }

    getDomainName(labelId:number) : string|null{
      if(this.domainNames[labelId] === undefined){
        return null;
      }
      return this.domainNames[labelId];
  }


    lastQueryReturnedData(){
      return this.service.lastQueryReturnedData();
    }

    private loadData(){
      this.service.getTools().subscribe((value) => {
        if(value !== null){
         console.log(value.data.data);
          this.data = value.data.data;
          this.domainNames = value.data.attributes;
          this.dataFetched = true;
        }
      });
    }

    ngOnInit() {
      this.loadData();
    }

    update(){
        this.data = [];
        this.dataFetched = false;
        this.loadData();
    }

    openBrowserTab(url:string){
      if(url !== null && url.length !== 0){
          window.open(url);
      }
  }
}
