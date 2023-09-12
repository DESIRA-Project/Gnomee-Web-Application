import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BackendService } from "src/app/backend.service";
import { DynamicContentService } from "../../../ComponentLibrary/DynamicModal/dynamic-content.service";
import { DynamicItem } from "../../../ComponentLibrary/DynamicModal/dynamic-item.components";
import { UserManagementService } from "../user-management.service";
import { UserToolSuggestionsComponent } from "../Member/user-tool-suggestions.component";

@Component({
    selector: 'user-tool-suggestions',
    templateUrl: './admin-tool-suggestions.component.html',
    styleUrls:['../../../style/tables.css','../../../style/gnomee.css'],
})
export class  AdminToolSuggestionsComponent extends UserToolSuggestionsComponent{

    title = "Moderate Suggestions";

    constructor(protected service:BackendService, protected userManagementService:UserManagementService,private router: Router){
        super(service, userManagementService);
    }

    public loadData(){
        this.ready = false;
        this.service.isInitialized().subscribe(backendInitialized=>{
            this.service.getAllSuggestedDigitalTools(this.token,(results:any)=>{
                let responseData = results;
              //  console.log(results.responseData[0].data);
                this.tools = results.responseData[0].data;
                this.ready = true;
            });
        });
    }

    userCanViewAllSuggestedTools():boolean{
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("view_suggested_tools"); 
    }

    canRollbackTool():boolean{
         return this.userManagementService === null ? false : this.userManagementService.userHasPermission("rollback_suggested_tools"); 
    }

    deleteSuggestedTool(i:number){
        this.currentOperationIsReadonly = false;
        let params:any = {token: this.token,tool:this.tools[i].id};
        //a modal should up here, to ask if the user is sure with the deletion of the suggested tool

        let inst = this;
        let acceptSuggestedToolRemoval = ()=>{
            if(inst.modal !== null){
                inst.modal.closeModal();
            }
            inst.modalIsOpen = false;
            this.service.deleteSuggestedDigitalTool(params,(results:any)=>{
                if(results.responseData[0].data === true){
                    this.raiseAlertWithMessage(results.responseData[0].description);
                }
                else{
                    this.raiseErrorAlertWithMessage(results.responseData[0].description);                    
                }
                this.loadData();
            }); 
        };
            

        //construct data for dynamic view
        let objectData = {msg:"Would you really like to reject the suggested tool?",title:"Reject Digital Tool Suggestion",onSubmit:acceptSuggestedToolRemoval,acceptButtonText:"Reject"};
        if(this.content !== undefined){
            this.content.setData(objectData);
            this.openModal();
        }
    }
    commit(i:number){
        this.currentOperationIsReadonly = false;
    
       // this.currentOperationIsReadonly = false;
        //let params:any = {token: this.token,tool:this.tools[i].id};
        //a modal should up here, to ask if the user is sure with the deletion of the suggested tool

        let inst = this;
        let acceptSuggestedToolCommit = ()=>{
            if(inst.modal !== null){
                inst.modal.closeModal();
            }
            inst.modalIsOpen = false;
            //inst.loadData();
            inst.actualCommit(i);
/*            this.service.deleteSuggestedDigitalTool(params,(results:any)=>{
                if(results.responseData[0].data === true){
                    this.raiseAlertWithMessage(results.responseData[0].description);
                }
                else{
                    this.raiseErrorAlertWithMessage(results.responseData[0].description);                    
                }
                this.loadData();
            }); */
        };
            

        //construct data for dynamic view
        let objectData = {msg:"Would you really like to add the suggested tool to Gnomee Knowledge Base?",title:"Accept Digital Tool Suggestion for Gnomee",onSubmit:acceptSuggestedToolCommit};
        if(this.content !== undefined){
            this.content.setData(objectData);
            this.openModal();
        }

    }

    actualCommit(i:number){
        let params = {token:this.token, tool:this.tools[i].id};
        this.ready = false;
        this.service.commitSuggestedTool(params,(results:any)=>{
            let msg = results.responseData[0].description;
            if(results.responseData[0].data === true){
                this.raiseAlertWithMessage(results.responseData[0].description);
            }
            else{
                this.raiseErrorAlertWithMessage(results.responseData[0].description);                    
            }
            this.loadData();
        });

    }
}