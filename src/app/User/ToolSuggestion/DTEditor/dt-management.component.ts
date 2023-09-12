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
import { Expression, ExpressionList, ExpressionOperator, SearchField } from "src/app/ToolFilterPage/tool-term-search.component";
import { DigitalToolFormComponent } from "./dt-tool-form.component";


@Component({
    selector: 'dt-management',
    templateUrl: './dt-management.component.html',
    styleUrls:['../../../style/tables.css'],
})

export class DigitalToolManagementComponent extends AlertSupportingComponent implements ModalController, DynamicContent{
    data: any;
    tools:any[] = [];
    ready:boolean = false;
    title = "Digital Tool Management";
    token:string|null = null;
    navigationData:any = null;
    rc:ResolutionAwareComponent = new ResolutionAwareComponent();
    searchTermValue = "";
    expressions: SearchField[] = [];
    searchXpr: ExpressionList;
    from:number = 0;
    public modalIsOpen:boolean = false;
    public content:any;
    public editContent:any;
    public modal:any = null;
    private dependencies:any;
    private latestSearchTerm = '';
    public editDigitalToolModalIsOpen = false;
    
    @Input()  set userToken(token:string){
        this.token = token;
        this.loadData();
    }

    constructor(protected service:BackendService, protected userManagementService:UserManagementService){
        super();
        this.expressions = [];
        this.searchXpr = { exprs: [], globalOperator: ExpressionOperator.MATCH_ANY } as ExpressionList;
    }

    onInputChange(e:any){
        let el = document.getElementById("inputSearchTerm");
        if(el){
            let value = (<HTMLInputElement>el).value ;  
            this.searchTermValue = value;
        }
    }

    searchTerm(){
       // console.log(this.expressions)
       if(this.searchTermValue.trim().length === 0){
            return;
       }
        let e:Expression = {field:{id:this.expressions[0].id,name:this.expressions[0].name},value:this.searchTermValue};
        this.searchXpr = { exprs: [e], globalOperator: ExpressionOperator.MATCH_ANY } as ExpressionList;
        this.latestSearchTerm = '';
        this.ready = false;
        this.loadData();
    }

    clearTerm(){
        this.ready = false;
        this.searchXpr.exprs = [];
        this.searchTermValue = '';
        this.latestSearchTerm = '';
        let el = document.getElementById("inputSearchTerm");
        if(el){
            (<HTMLInputElement>el).value = '';  
        }
        this.loadData();
    }

    getSearchTermValue(){
        let el = document.getElementById("inputSearchTerm");
        if(el){
            let value = (<HTMLInputElement>el).value ;  
            return value;
        }
        return null;
    }

    loadData(){
        if(this.latestSearchTerm !== this.searchTermValue){
            this.from = 0;
        }
        let params:any = {token: this.token};
        if(this.searchXpr.exprs.length !== 0){
           //{ queries: [], queryOperator: expressions.globalOperator }
            params['queries'] = {queries: [ { field:this.expressions[0].id, term:this.searchTermValue } ], queryOperator: this.searchXpr.globalOperator};
            this.latestSearchTerm = this.searchTermValue;
        }

        this.service.getToolsOnBasicView(params, (result:any)=>{
                //console.log(result.responseData);
                for(let i = 0;i<result.responseData.length;i++){
                    if(result.responseData[i].attribute === 'tools'){
                        this.tools = result.responseData[i].data;
                        continue;
                    }
                    if(result.responseData[i].attribute === 'navigation'){
                        this.navigationData = result.responseData[i].data;
                       // console.log(this.navigationData);
                        continue;
                    }
                    if(result.responseData[i].attribute === 'searchQueryFields'){
                        this.expressions = result.responseData[i].data;
                      //  console.log(this.expressions)
                       // console.log(this.navigationData);
                        continue;
                    }
                    
                }
                //console.log(result)
                this.ready = true;
        },this.from);
    }

    fetchResultPage(from: number, pageNumber: number){
        this.ready = false;
        this.from = from;
        let params:any = {token: this.token};
        if(this.searchXpr.exprs.length !== 0){
            params['queries'] = {queries: [ { field:this.expressions[0].id, term:this.searchTermValue } ], queryOperator: this.searchXpr.globalOperator};
            this.latestSearchTerm = this.searchTermValue;
        }
        this.service.getToolsOnBasicView(params,(result:any)=>{
               // console.log(result.responseData);
                for(let i = 0;i<result.responseData.length;i++){
                    if(result.responseData[i].attribute === 'tools'){
                        this.tools = result.responseData[i].data;
                        this.ready = true;
                        continue;
                    }
                    if(result.responseData[i].attribute === 'navigation'){
                        this.navigationData = result.responseData[i].data;
                       // console.log(this.navigationData);
                        continue;
                    }
                }
                this.ready = true;
        },from);
        
    }

    addChild(o:any){
        
    }

    initialize(parent: DynamicModalContainer): void {
        throw new Error("Method not implemented.");
    }
    getUserToken(): string | null {
        throw new Error("Method not implemented.");
    }
    initializeWithAuthData(userToken: string): void {
        this.token = userToken;
        this.loadData();
    }
    setDependencies(dependencies: DynamicItem[]): void {
        this.dependencies = dependencies;
        this.content = this.dependencies[0];
        this.editContent = this.dependencies[1];
        console.log(this.editContent)
    }

    openModal(){
        if(this.modalIsOpen){
            return;
        }
        this.modalIsOpen = true;
    }

    onEditModalClose():Function{
        let parentRef = this;
        return (() => {
            parentRef.editDigitalToolModalIsOpen = false;
            this.ready = false;
            parentRef.loadData();
            //  parentRef.cookiesModalIsOpen = false;
        });

    }

    onModalClose(): Function {
        let parentRef = this;
        return (() => {
            parentRef.modalIsOpen = false;
            //  parentRef.cookiesModalIsOpen = false;
        });
    }

    setContent(content: DynamicItem): void {
        throw new Error("Method not implemented.");
    }
    getContentService(): DynamicContentService {
        throw new Error("Method not implemented.");
    }
    setDynamicHTMLContentService(serv: DynamicHTMLContentService): void {
        throw new Error("Method not implemented.");
    }
    getDynamicHTMLContentService(): DynamicHTMLContentService {
        throw new Error("Method not implemented.");
    }
    notifyUser(success: boolean, message: string): void {
        throw new Error("Method not implemented.");
    }

    getDynamicContent(){
        return this.content;
    }

    getEditSuggestedToolContent(){
        return this.editContent;
    }

    getModalTitle(){
        return "";
    }

    getEditSuggestedToolModalTitle(){
        return "Update Digital Tool";
    }

    userCanViewStoredDigitalTools(){
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("view_stored_dts");
    }
    userCanEditStoredDigitalTools(){
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("edit_stored_dts");
    }
    userCanDeleteStoredDigitalTools(){
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("remove_stored_dts");
    }

    viewTool(i:number){
        let tool = this.tools[i];
        console.log(tool);
        let toolId = tool.id;
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

    editSuggestedTool(i:number){
        let objectData = {token:this.token, toolId:this.tools[i].id};
        //console.log(this.editContent);
        if(this.editContent !== undefined){
            this.editContent.setData(objectData);
            this.editDigitalToolModalIsOpen = true;
        }
    }

    deleteSuggestedTool(i:number){
     //   this.currentOperationIsReadonly = false;
        let params:any = {token: this.token,tool:this.tools[i].id};
        //a modal should up here, to ask if the user is sure with the deletion of the suggested tool

        let inst = this;
        let acceptSuggestedToolRemoval = ()=>{
            if(inst.modal !== null){
           //     console.log(inst.modal);
                inst.modal.closeModal();
            }
            inst.modalIsOpen = false;
            this.service.deleteStoredDigitalTool(params,(results:any)=>{
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
        let objectData = {msg:"Would you really like to delete the digital tool?",title:"Delete Suggested Tool",onSubmit:acceptSuggestedToolRemoval,acceptButtonText:"Delete"};
        if(this.content !== undefined){
            this.content.setData(objectData);
            this.openModal();
        }
    }
}