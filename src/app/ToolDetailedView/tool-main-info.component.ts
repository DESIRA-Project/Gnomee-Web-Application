import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../backend.service";
import { ResolutionAwareComponent } from "../ToolFilterPage/resolutionaware.component";

@Component({
    selector: 'tool-main-info',
    templateUrl: './tool-main-info.component.html',
    styleUrls: ['../style/tool-detailed-view.css'],
    providers: []
})

export class ToolMainInfo extends ResolutionAwareComponent{
    _parent:any = null;
    name:string|null = null;
    description:string|null = null;
    url:string|null = null;
    outcome:string|null = null;

    @Input()
    public set parent(p: any) {
      this._parent = p;
    }

    constructor(private service:BackendService){
        super();
    }


    openBrowserTab(url:string|null){
        if(this._parent && url && url.trim() !== ""){
            let payload:{toolId:number, url:string} = {url:url, toolId:this._parent?.toolId};
            this.service.dtUrlClicked(payload,(response:any)=>{
                super.openBrowserTab(url);
                return;
            });
        }else{
            super.openBrowserTab(url);
        }
    }

    ngOnInit(){
        if(this._parent.dataFetched){
            this.service.getToolDetails().subscribe((value)=>{
                console.log(value);
                this.name = value.data.data.name;
                this.description = value.data.data.intendedOutcome;
                if(this.description !== null){
                    this.description = this.description[0].toUpperCase()+this.description.substring(1);
                }
                this.url = value.data.data.url;
                this.outcome = value.data.data.intendedOutcome;
            });

            this.service.getData().subscribe((value)=>{
                if(value !== null){
                    this.outcome = value[6].data.data;
                }
            });
        }
    }



}
