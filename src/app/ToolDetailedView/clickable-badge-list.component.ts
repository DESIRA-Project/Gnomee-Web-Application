import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../backend.service";
import { ResolutionAwareComponent } from "../ToolFilterPage/resolutionaware.component";
import { AttributeList } from "./application-scenario-holder.component";

@Component({
    selector: 'clickable-badge-list',
    templateUrl: './clickable-badge-list.component.html',
    styleUrls: ['../style/tool-detailed-view.css'],
    providers: []
})

export class ClickableBadgeList extends ResolutionAwareComponent{
    @Input() data:AttributeList = {attributeName: "",values:[],queryKey:""} as AttributeList;
    @Input() pageData:any = null;

    ngOnInit(){
        //console.log(this.data);
    }

    capitalizeFirstLetter(s:string):string {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    performQuery(value:any){
        let url:string|null = this.getSearchUrl();
        if(url !== null){
            let attributeName = this.data.queryKey;
            let id = value.id;
            url = url+"?"+attributeName+"="+id;
            this.openBrowserTab(url);
        }
    }

    getSearchUrl():string|null{
        if(this.pageData.search_url !== undefined){
             let tokens = window.location.pathname.split("/");
             tokens.pop();
             tokens.pop();

             let newPath = tokens.join("/") + this.pageData.search_url;
             let url = window.location.origin + newPath ;
             return url;
        }
        return null;
    }

}
