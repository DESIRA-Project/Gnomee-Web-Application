import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BackendService } from "../backend.service";
import { PageConfigService } from "../pageconfig.service";
import { PathIterator } from "./path-iterator";
import { AttributePathIterator } from "./attribute-path-iterator";
import { BehaviorSubject, Observable } from "rxjs";
import { URLPath } from "./URLPath";

@Component({
    selector: 'tool-browser',
    templateUrl: './tool-browser.component.html',
    styleUrls: ['../style/about.css'],
    providers: []
})
  
export class ToolBrowserComponent {
  public pageData:any = null;
  public dataReady:boolean = false;
  private configKey:string = "browse";
  private data:any = null;
  public iterator:AttributePathIterator|null = null;
  private urlPath:URLPath|null = null;
  public isOnPath:boolean = false;

  constructor(private configService:PageConfigService,
              private backend: BackendService, 
              private router: Router){        
  }

  ngOnInit(){

    this.configService.getConfigData().subscribe((value) => {
        if(value === null){
            return;
        }
        if(this.configKey in value){
            this.pageData = value[this.configKey];
        }
        this.backend.isInitialized().subscribe((isBackendInitialized)=>{
            if(isBackendInitialized === null){
              return;
            }
            if(isBackendInitialized === true){
              //lets do the call
              this.backend.browseToolsPath({}, () => { 

                this.backend.getData().subscribe((value) => {
                  //console.log("Data should be ready");
                  this.data = value;

                  this. isOnPath =  this.browserHasPath();
                  this.data.style = this.pageData;
                  let iterator = new PathIterator(this.data,this.getFetchDataSingleLevelCB(), this.getFetchDataMultiLevelCB() );
                  if(this.isOnPath && this.urlPath !== null){
                     iterator.traverse(this.urlPath, ()=>{
                          this.iterator = iterator;
                          this.dataReady = true;
                     },()=>{
                       //initialize url
                       this.iterator?.reset();
                       this.navigateToPagesBaseUrl();
                       this.dataReady = true;
                     })
                  }
                  else{
                      this.iterator = iterator;
                      this.dataReady = true;
                  }
                });
              });
            }
        });
    });
   }

   private navigateToPagesBaseUrl() {
       let url = this.router.url;
       let tokens = url.split("/");
//       console.log()
       let u:URLPath = new URLPath(url);
/*       console.log(u.getBasePath());
       console.log(url);*/
       this.router.navigateByUrl("/"+u.getBasePath() );
//       history.pushState({}, "",  ( url ) );
   }


   private browserHasPath(){
       this.urlPath = new URLPath(this.router.url);
       return this.urlPath.onAccessedPath();
   }

   getFetchDataSingleLevelCB():Function{
     let inst = this;
     return (attributeName:string,id:number,from:number, updater:BehaviorSubject<any>) =>{
      let config : {[key: string]: number} = {};
       config[attributeName] = id;
       inst.backend.getBrowsedTools(config,from, updater);
     };
   }

   getFetchDataMultiLevelCB():Function{
    let inst = this;
    return (attributeName:string[],id:number[],from:number, updater:BehaviorSubject<any>) =>{
      let config : {[key: string]: number} = {};
      
      for(let i:number = 0;i<attributeName.length;i++){
        config[attributeName[i]] = id[i];
      }
      inst.backend.getBrowsedTools(config,from, updater);
    };
  }


}