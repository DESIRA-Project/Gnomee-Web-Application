import { Component, Input } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { DynamicContent } from "../../../ComponentLibrary/DynamicModal/dynamic-content.component";
import { DynamicContentService } from "../../../ComponentLibrary/DynamicModal/dynamic-content.service";
import { DynamicHTMLContentService } from "../../../ComponentLibrary/DynamicModal/dynamic-html-content.service";
import { DynamicItem } from "../../../ComponentLibrary/DynamicModal/dynamic-item.components";
import { DynamicModalContainer } from "../../../ComponentLibrary/DynamicModal/dynamic-modal-container";
import { ModalController } from "src/app/ComponentLibrary/DynamicModal/modal-controller";
import { AlertSupportingComponent } from "../alert-supporting-component";
import { GnomeeUser } from "../gnomee-user";
import { UserManagementService } from "../user-management.service";
@Component({
    selector: 'users-management-component',
    templateUrl: './users-management.component.html',
    styleUrls:['../../../style/tables.css'],
})
export class UsersManagementComponent extends AlertSupportingComponent implements ModalController, DynamicContent{
    data: any;
    ready = false;
    protected token:string = "";
    users:GnomeeUser[] = [];
    title="Users Management";
    private dependencies:any;
    private selectedUserProfileContent:any;
    private modalTitle = "";
    public modal:any = null;
    public modalIsOpen = false;
    cancellableOperationModalIsOpen = false;
    public cancellableOperationContent:any;

    @Input()  set userToken(token:string){
        this.token = token;
        this.loadData();
    }
    
    constructor(protected service:BackendService, protected userManagementService:UserManagementService){
        super();
        if(this.userManagementService !== null){
            const token = this.userManagementService.getToken();
            if(token !== null){
                this.token = token;
                this.loadData();
            }
        }
    }

    public loadData(){
        this.ready = false;
        this.users = [];
        this.service.isInitialized().subscribe(backendInitialized=>{
            this.service.getUsers(this.token,(results:any)=>{
                let responseData = results;
                for(let i = 0;i<results.responseData.length;i++){
                    let u = new GnomeeUser(results.responseData[i]);
                    this.users.push(u);
                }
            //    console.log(this.users);
               // this.users = results.responseData;
                this.ready = true;
            });
        });
    }

    userCanViewAllUsers(){
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("view_all_users"); 
    }

    userCanEditAllUsers(){
        return this.userManagementService === null ? false : this.userManagementService.userHasPermission("edit_all_users"); 
    }

    initialize(parent: DynamicModalContainer): void {
        //throw new Error("Method not implemented.");
    }
    getUserToken(): string | null {
        throw this.token;
    }

    getDynamicContent(){
        return this.selectedUserProfileContent;
    }
    getModalTitle(){
         return this.modalTitle;
    }

    initializeWithAuthData(userToken: string): void {
       // throw new Error("Method not implemented.");
       this.token = userToken;
       this.users = [];
    }

    getCancellableContent(){
        return this.cancellableOperationContent;
    }

    setDependencies(dependencies: DynamicItem[]): void {
       this.dependencies = dependencies;
       this.cancellableOperationContent = dependencies[0];
       this.selectedUserProfileContent = dependencies[1];
    }

    userIsBlocked(i:number){
        return !this.users[i].isActive;
    }
    userIsActive(i:number){
        return this.users[i].isActive;
    }

    activateUser(i:number){
     
    

/*        this.service.requestUserActivation(params,(results:any)=>{
              this.users = [];
               this.loadData();
        });
*/
        let inst = this;
        let acceptUserActivation = ()=>{
            if(inst.modal !== null){
              //  console.log(inst.modal)
                inst.modal.closeModal();
            }
            let isActive = inst.users[i].isActive;
            let params = {token:inst.token, userId:inst.users[i].id, active: !isActive};

            inst.cancellableOperationModalIsOpen = false;
            inst.modalIsOpen = false;
            
            inst.service.requestUserActivation(params,(results:any)=>{
                inst.users = [];
                inst.loadData();
          });
        };

        let isActive = this.users[i].isActive;
        //construct data for dynamic view
        let objectData = {msg:isActive ? "Would you really like to block the user?" : "Would you really like to activate the user?",  
                          title:isActive ? "Block User" : "Activate User" , onSubmit:acceptUserActivation,acceptButtonText: isActive ?"Block User" :"Activate User" };
        if(this.cancellableOperationContent !== undefined){
             this.cancellableOperationContent.setData(objectData);
             this.cancellableOperationModalIsOpen = true;
        }
    }

    viewUserInfo(i:number){
        this.modalTitle = "View User Information"
        let objectData = {token:this.token, userId:this.users[i].id, edit:false};

        if(this.selectedUserProfileContent !== undefined){
            this.selectedUserProfileContent.setData(objectData);
            this.modalIsOpen = true;
        }
    }

    editUserInfo(i:number){
        this.modalTitle = "Edit User Information"
        let objectData = {token:this.token, userId:this.users[i].id,edit:true};
        
        if(this.selectedUserProfileContent !== undefined){
            this.selectedUserProfileContent.setData(objectData);
            this.modalIsOpen = true;
        }
    }

    openModal(): void {
        throw new Error("Method not implemented.");
    }
    onModalClose(): Function {
        let parentRef = this;

        return (() => {
            parentRef.modalIsOpen = false;
            parentRef.cancellableOperationModalIsOpen = false;
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
    
}