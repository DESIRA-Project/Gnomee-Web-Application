import { Component, Inject, Input } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { DynamicContent } from "../../../ComponentLibrary/DynamicModal/dynamic-content.component";
import { DynamicContentService } from "../../../ComponentLibrary/DynamicModal/dynamic-content.service";
import { DynamicHTMLContentService } from "../../../ComponentLibrary/DynamicModal/dynamic-html-content.service";
import { DynamicItem } from "../../../ComponentLibrary/DynamicModal/dynamic-item.components";
import { DynamicModalContainer } from "../../../ComponentLibrary/DynamicModal/dynamic-modal-container";
import { ModalController } from "src/app/ComponentLibrary/DynamicModal/modal-controller";
import { environment } from "src/environments/environment";
import { AlertSupportingComponent } from "../alert-supporting-component";
import { UserManagementService } from "../user-management.service";
import { ResolutionAwareComponent } from "src/app/ToolFilterPage/resolutionaware.component";

@Component({
    selector: 'user-tool-suggestions',
    templateUrl: './user-tool-suggestions.component.html',
    styleUrls:['../../../style/tables.css'],
})

export class UserToolSuggestionsComponent extends AlertSupportingComponent implements ModalController, DynamicContent{
    protected token:string = "";
    public ready:boolean = false;
    public tools:any[] = [];
    public modalIsOpen:boolean = false;
    public content:any;
    protected editContent:any;
    public modal:any = null;
    public rc:ResolutionAwareComponent = new ResolutionAwareComponent();
    public editSuggestedToolModalIsOpen:boolean = false;
    private dependencies:any;
    data: any;
    title="My Tool Suggestions";
    currentOperationIsReadonly = false;

    @Input()  set userToken(token:string){
        this.token = token;
        this.loadData();
    }
    
    constructor(protected service:BackendService, protected userManagementService:UserManagementService){
        super();
    }
    setDependencies(dependencies:DynamicItem[]){
        this.dependencies = dependencies;
        this.content = this.dependencies[0];
        this.editContent = this.dependencies[1];

    }

    userCanViewSuggestedTools():boolean{
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("view_my_suggested_tools"); 
    }

    userCanEditSuggestedTool():boolean{
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("update_my_suggested_tools");
    }

    userCanRemoveSuggestedTool():boolean{
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("update_my_suggested_tools");
    }

    initialize(parent: DynamicModalContainer): void {
        
    }

    notifyUser(success:boolean, message:string):void{
        if(success === true){
            this.raiseAlertWithMessage(message);
        }
        else{
            this.raiseErrorAlertWithMessage(message);
        }
    }

    getUserToken(): string | null {
        return this.token;
    }
    initializeWithAuthData(userToken: string): void {
        this.token = userToken;
        this.loadData();
    }

    openModal(){
        if(this.modalIsOpen){
            return;
        }
        this.modalIsOpen = true;
    }

    onModalClose(): Function {
        let parentRef = this;
        return (() => {
            parentRef.modalIsOpen = false;
            //  parentRef.cookiesModalIsOpen = false;
        });
    }

    onEditModalClose():Function{
        let parentRef = this;
        return (() => {
            parentRef.editSuggestedToolModalIsOpen = false;
            parentRef.loadData();
            //  parentRef.cookiesModalIsOpen = false;
        });
    }

    setContent(content: DynamicItem): void {
        throw new Error("Method not implemented.");
    }
    getContentService(): DynamicContentService {
        throw new Error("Method not implemented.");
    }

    getEditSuggestedToolContent():DynamicItem{
        return this.editContent;
    }

    getDynamicContent():DynamicItem{
        return this.content;
    }
    setDynamicHTMLContentService(serv: DynamicHTMLContentService): void {
        throw new Error("Method not implemented.");
    }
    getDynamicHTMLContentService(): DynamicHTMLContentService {
        throw new Error("Method not implemented.");
    }

/*    editSuggestedTool(i:number){
        let params:any = {token: this.token,tool:this.tools[i].id};
        //a modal should up here, to ask if the user is sure with the deletion of the suggested tool

        let inst = this;
        let acceptSuggestedToolEdit = ()=>{
            if(inst.modal !== null){
                inst.modal.closeModal();
            }
            inst.actualEditSuggestedTool(i);
        };
            

        //construct data for dynamic view
        let objectData = {msg:"Would you really like to accept your changes for the suggested tool?",title:"Update Suggested Tool",onSubmit:acceptSuggestedToolEdit};
        if(this.content !== undefined){
            this.content.setData(objectData);
            this.openModal();
        }
        
    }*/

    editSuggestedTool(i:number){
        this.currentOperationIsReadonly = false;
        //construct data for dynamic view
        let objectData = {token:this.token, toolId:this.tools[i].id};
        if(this.editContent !== undefined){
            //console.log(this.editContent)
            this.editContent.setData(objectData);
            this.editSuggestedToolModalIsOpen = true;
        }
    }

    getEditSuggestedToolModalTitle(){
        return this.currentOperationIsReadonly ? "View Suggested Tool" : "Edit Suggested Tool";
    }

    getModalTitle(){
        return "Reject Suggested Tool";
    }

    deleteSuggestedTool(i:number){
        this.currentOperationIsReadonly = false;
        let params:any = {token: this.token,tool:this.tools[i].id};
        //a modal should up here, to ask if the user is sure with the deletion of the suggested tool

        let inst = this;
        let acceptSuggestedToolRemoval = ()=>{
            if(inst.modal !== null){
           //     console.log(inst.modal);
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
        let objectData = {msg:"Would you really like to remove your suggested tool?",title:"Remove Suggested Tool",onSubmit:acceptSuggestedToolRemoval,acceptButtonText:"Remove"};
        if(this.content !== undefined){
            this.content.setData(objectData);
            this.openModal();
        }
    }

    public loadData(){
        this.ready = false;
        this.service.isInitialized().subscribe(backendInitialized=>{
            this.service.getSuggestedDigitalTools(this.token,(results:any)=>{
                let responseData = results;
              //  console.log(results.responseData[0].data);
                this.tools = results.responseData[0].data;
                this.ready = true;
            });
        });
    }

    
    private openToolPage(toolId:string){
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

    public viewSuggestedTool(i:number){
        //console.log(this.tools[i]);
        this.currentOperationIsReadonly = true;
        //alert("view");
        if(this.tools[i].viewId === undefined || this.tools[i].viewId === null){
            //open the form in view mode
            let objectData = {token:this.token, toolId:this.tools[i].id, readonly:true};
            if(this.editContent !== undefined){
                this.editContent.setData(objectData);
                //console.log(this.editContent)
                this.editSuggestedToolModalIsOpen = true;
            }

        }
        else{
            this.openToolPage(this.tools[i].viewId);
        }
     }
}