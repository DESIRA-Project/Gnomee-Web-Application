import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';

import { DynamicContent } from '../ComponentLibrary/DynamicModal/dynamic-content.component';
import { DynamicItem } from '../ComponentLibrary/DynamicModal/dynamic-item.components';
import { DynamicModalContainer } from '../ComponentLibrary/DynamicModal/dynamic-modal-container';

@Component({
  template: `
    <div class="tool-listing" *ngIf="resp !== null">
        <div *ngIf="resp !== null">
            <div *ngFor="let tool of resp.data">
                <div>
                     <div>
                         <button type="button" class="btn btn-link content" (click)="openToolPage(tool.id)">
                         {{ getAdjustedToolName ( tool.name ) }}
                         </button>
                     </div>
                </div>
            </div>
        </div>
    </div>
  `,
  styleUrls: ['../style/tool-listing.css'],
})
export class ToolListingComponent implements DynamicContent {
    @Input() data: any;
    resp:any = null;
    toolNameLengthThreshold:number = 28;
    onSubmit: Function = ()=>{};

    constructor(private service:BackendService){
       
    }
    
    setDependencies(dependencies: DynamicItem[]): void {
        
    }

    initializeWithAuthData(userToken: string): void {
        
    }
    
    getUserToken(): string | null {
        return null;
    }

    initialize(parent:DynamicModalContainer):void{
         let reqData = {countryId:this.data.id};
         this.service.fetchCountryTools(reqData,(response:any)=>{
             /*console.log(response);*/
             let amountOfTools = "";
             //console.log(response);
             response = response.responseData;
             if(response.data !== null){
                 amountOfTools =  " ("+response.data.length+")";
             }
             parent.setTitle(response.repr + amountOfTools);
             //console.log(response);
             this.resp = response;

         });
    }

    openToolPage(toolId:string){
        let value = environment.env.search_page.tool_detailed_url;
        if(value === null || value === undefined) return;
        let prefix = environment.env.search_page.kbt.link;
        if(prefix.startsWith("/")){
            prefix = prefix.substring(1);
        }
    
        let handle = window.open("/"+prefix+value+"/"+toolId, '_blank');
        if(handle !== null){
            handle.focus();
        }
    }

    getAdjustedToolName(toolName:string){
      if(toolName.length < this.toolNameLengthThreshold) return toolName;
      return toolName.substr(0,this.toolNameLengthThreshold)+"...";
    }
}