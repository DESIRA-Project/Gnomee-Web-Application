import { Component } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { AttachableButton } from "src/app/ComponentLibrary/attachable-button";
import { DynamicContentService } from "../../../ComponentLibrary/DynamicModal/dynamic-content.service";
import { DynamicModalContainer } from "../../../ComponentLibrary/DynamicModal/dynamic-modal-container";
import { ToolSuggestionFormComponent } from "../Member/tool-suggestion-form.component";
import { UserManagementService } from "../user-management.service";

@Component({
    selector: 'tool-suggestion-form',
    templateUrl: './admin-tool-suggestion-moderation-form.component.html',
    styleUrls:['../../../style/gnomee.css'],
})
export class AdminToolSuggestionModerationFormComponent extends ToolSuggestionFormComponent{
    public title:string|null = "Suggested Tool Moderation";
    public isReadonly:boolean = false;
    constructor(protected service:BackendService, protected userManagementService: UserManagementService){
        super(service, userManagementService);
    }
    
    initialize(parent:DynamicModalContainer):void{
        // this.msg = this.data.msg;      
        if(this.data.token !== undefined){
            this.token = this.data.token;
            this.currentToolId = this.data.toolId;
            this.renderInCard = false;
            if(this.data.readonly !== undefined){
                this.isReadonly = this.data.readonly;
                if(this.isReadonly){
                  //  this.title = "View Suggested Tool"
                }
                else{
                  //  alert("else")
                }
            }           
            else{
                //alert("readonly undefined")
            }
            //this.title = null;
            this.data = [];
            let params = {token:this.token, tool:this.currentToolId};
            this.formReady = false;
            this.onUpdate = true;
            this.submitButtonText = "Update";
            this.parent = parent;
            if(!this.isReadonly && !this.renderInCard){
                let inst = this;
                let onChange = ()=>{
                    return inst.onChange();
                };
                let reset = ()=>{
                    inst.reset();
                };
                let submit = ()=>{
                    inst.submit();
                }
                let commit = ()=> {
                    inst.commit();
                }
                let submitButton:AttachableButton = new AttachableButton(this.submitButtonText, onChange,submit,"btn gnomee-button-in-toolbar-gap  btn-primary gnomee-button");
              //  let acceptButton:AttachableButton = new AttachableButton("Accept", onChange,commit,"btn btn-primary gnomee-button");
           
                this.parent.addButton(submitButton);
              //  this.parent.addButton(acceptButton);
            }  


            this.service.getSuggestedTool(params,(result:any)=>{
                let responseData = result;
                this.data = [];
                for (const key in responseData['responseData']) {
                     this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
                }
                this.formReady = true;
            });
        }
    }

    commit(){
        let params = {token:this.token, tool:this.currentToolId};
        this.formReady = false;
        this.service.commitSuggestedTool(params,(results:any)=>{
            let msg = results.responseData[0].description;
            if(results.responseData[0].data === true){
                //close the modal
                if(this.parent !== null){
                    this.parent.closeModal();
                }       

                this.notifyModalController(true, msg);
            }
            else{
                this.notifyModalController(false, msg);
                this.formReady = true;
            }
        });
    }

    notifyModalController(result:boolean, message:string){
         if(this.parent !== null){
             let p = this.parent.getParent();
             if(p !== null){
                 p.notifyUser(result, message);
             }
         }
    }
}