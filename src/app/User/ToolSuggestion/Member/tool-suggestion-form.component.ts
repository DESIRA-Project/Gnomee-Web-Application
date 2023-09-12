import { Component, Inject, Input } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { ValueContainerComponent } from "src/app/ComponentLibrary/value-container-component";
import { AttachableButton } from "src/app/ComponentLibrary/attachable-button";
import { DynamicContent } from "../../../ComponentLibrary/DynamicModal/dynamic-content.component";
import { DynamicContentService } from "../../../ComponentLibrary/DynamicModal/dynamic-content.service";
import { DynamicItem } from "../../../ComponentLibrary/DynamicModal/dynamic-item.components";
import { DynamicModalContainer } from "../../../ComponentLibrary/DynamicModal/dynamic-modal-container";
import { AlertSupportingComponent } from "../alert-supporting-component";
import { UserManagementService } from "../user-management.service";
import { ReCaptchaService } from "src/app/ReCaptchaService/recaptcha.service";
import { environment } from "src/environments/environment";
import { DynamicModalComponent } from "src/app/ComponentLibrary/DynamicModal/dynamic-modal.component";

@Component({
    selector: 'tool-suggestion-form',
    templateUrl: './tool-suggestion-form.component.html',
    styleUrls:["../../../style/gnomee.css"]
})

export class ToolSuggestionFormComponent extends AlertSupportingComponent implements DynamicContent{

    public checkComponent:any = null;
    public formReady:boolean = false;
    public data:any = [];
    protected token:string = "";
    protected children:ValueContainerComponent[] = [];
    public taxonomyNotPresent:boolean = false;
    public resultsSubmitted:boolean = false;
    public currentToolId:number = -1;
    public title:string|null = "Suggest a new Digital Tool for Gnomee";
    public submitButtonText:string = "Submit";
    public resetButtonText:string = "Reset";
    public onUpdate:boolean = false;
    protected parent:DynamicModalContainer| null = null;
    private permission:string = "create_tool_suggestion";
    public isDirty:boolean = false;
    private initialData:any = [];
    public isReadonly:boolean = false;
    public renderInCard = true;
    protected recaptchaService:ReCaptchaService|null = null;
    public dependencies: DynamicItem[] = [];
    public checkModalIsOpen = false;
    public showRecaptcha = false;
    public recaptchaClicked = false;
    public modal:DynamicModalComponent|any = null;

    @Input() set userToken(token:string){
        this.token = token;
        this.loadData();      
    }

    openModal(){
        this.checkModalIsOpen = true;
    }

    protected loadData(){
        this.service.isInitialized().subscribe(backendInitialized=>{
            this.service.getToolSuggestionDataForm(this.token,(results:any)=>{
                let responseData = results;
                //console.log(results);
                for (const key in responseData['responseData']) {
                    this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
                }
                this.formReady = true;
            });
        });
    }


    constructor(protected service:BackendService,protected userManagementService:UserManagementService){
        super();
        this.recaptchaService = this.service.getRecaptchaService();
        this.showRecaptcha = false;//environment.env.backend.use_recaptcha;

        if(!environment.env.backend.use_recaptcha){
            return;
        }
        let r = this.userManagementService.getRouter();
        let u = r.url;

        let views = environment.env.user_landing_page.views;
        for(let i = 0;i<views.length;i++){
           // console.log(views[i]);
            if(views[i].url === u){
                if(views[i].uses_recaptcha === true){
                    this.showRecaptcha = true;
                    break;
                }
            }
        }
    }
    
    onChange() : boolean{
        //        return this.isDirty;
        
                return this.isDirty && (this.showRecaptcha && this.recaptchaClicked || (this.showRecaptcha === false) );
    }

    reset(){    
        if(!this.isDirty) return; 
         this.isDirty = false;
         this.formReady = false;
         this.children = [];
         this.data = [];
      //   this.data = this.initialData.map((x:any) => Object.assign({}, x) );
         //console.log(this.data);
       //this.formReady = true;
         if(this.currentToolId !== -1){
             this.retrieveSuggestedToolData();
         }
         else{
            this.loadData();             
         }
    }

    ngAfterViewInit(){
        if(this.recaptchaService === null) return;
        let inst = this;
        if(!this.showRecaptcha) return;
        this.recaptchaService.isInitialized().subscribe(rcInit=>{
            if(rcInit !== true){
                return;
            }

            this.recaptchaService?.isInjected().subscribe((val:any)=>{
                //alert(val)
                 if(val === true){
                    inst.recaptchaService?.execute(()=>{
                        inst.recaptchaClicked = true;
                        //alert("ok")
                    });
    
                 }
            });
            this.recaptchaService?.injectPluginScript();
        });

    }

    ngOnInit(){
/*        if(this.recaptchaService === null) return;
        this.recaptchaService.isInitialized().subscribe(rcInit=>{
            if(rcInit !== true){
                return;
            }
            this.recaptchaService?.injectPluginScript();
            this.recaptchaService?.execute(()=>{
                alert("recaptcha clicked")
            });
        });
*/
    }

    setDependencies(dependencies: DynamicItem[]): void {
        if(dependencies !== undefined && dependencies.length > 0){
            this.checkComponent = dependencies[0];
            this.dependencies = dependencies;
        }
    }

    public userCanSuggestTool():boolean{
        return this.userManagementService === null ? false : this.userManagementService?.userHasPermission(this.permission);
    }
    
    getUserToken(): string | null {
        return this.token;
    }

    initializeWithAuthData(userToken:string){
        this.token = userToken;
        this.data = [];
        this.loadData();
    }

    initialize(parent:DynamicModalContainer):void{
        // this.msg = this.data.msg;      
        this.parent = parent;
        if(this.data.token !== undefined){
//            this.token = this.data.token;
            this.currentToolId = this.data.toolId;
            this.title = null;
            this.renderInCard = false;
            this.token = this.data.token;
            if(this.data.readonly !== undefined){
                this.isReadonly = true;
            }
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

                let resetButton:AttachableButton = new AttachableButton(this.resetButtonText, onChange,reset,"btn gnomee-button-in-toolbar-gap  btn-secondary");
                let submitButton:AttachableButton = new AttachableButton(this.submitButtonText, onChange,submit,"btn btn-primary gnomee-button");
           
                this.parent.addButton(resetButton);
                this.parent.addButton(submitButton);
            }          
           this.retrieveSuggestedToolData();
       }
   }

   protected retrieveSuggestedToolData(){
    this.data = [];
    this.formReady = false;
    this.onUpdate = true;
    this.submitButtonText = "Update";   
    let params = {token:this.token, tool:this.currentToolId};
    this.service.getSuggestedTool(params,(result:any)=>{
        let responseData = result;
        this.data = [];
        for (const key in responseData['responseData']) {
             this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
        }
        this.formReady = true;        
    });
   }


    public addChild(c:any):void{
        this.children.push(c);
        if(c.setUserToken !== undefined){
            c.setUserToken(this.token);
        }
    }

    triggerChange(x:any){
        this.notifyForChange();
    }

    notifyForChange(){
        this.isDirty = false;

        let pageIsDirty = false;
        for(let i = 0;i<this.children.length;i++){
            if(this.children[i].valueHasChanged()){
              //  console.log(this.children[i]);
//                this.isDirty = true;
                pageIsDirty = true;
                break;
            }
        }
        

       // if(this.isDirty === true) return;
        //check if input valid
        let pageIsValid = true;
        for(let i = 0;i<this.children.length;i++){
            if(this.children[i]/*.valueHasChanged()*/){
                //console.log(this.children[i]);
                let v = this.children[i].getValue();
                //console.log(v);
                if(v.valid !== undefined){
                    if(!v.valid){
                      //  console.log(v)
                        pageIsValid = false;
                        //this.isDirty = false;
                        break;
                    }
                    else{
                       // this.isDirty = true;
                    }
                }
                /*this.isDirty = true;
                break;*/
            }
        }

/*        console.log(pageIsDirty)
        console.log(pageIsValid)*/

        this.isDirty = pageIsDirty && pageIsValid;

        
    }

    protected performValidation(){
        let forms = document.getElementsByClassName('needs-validation');
        let formIsValid = true;        
        for(let i:number = 0;i<forms.length;i++){
            let form = <HTMLFormElement>forms[i];
            let isValid:boolean = form.checkValidity();
            if (isValid === false) {
              form.classList.add("invalid")  ;
              if(formIsValid === true){
                  formIsValid = false;
              }
            }
            else{
                form.classList.add("valid");  
            }
            form.classList.add('was-validated');
        }
        return formIsValid;
    }

    public update(values:any[]){

        let inst = this;
        let actualUpdate = ()=>{
        let params:any = {token: this.token, tool:values, id:inst.currentToolId};   
        inst.service.updateDigitalToolSuggestion(params,(results:any)=>{
            if(results.responseData[0].data === true){
                inst.raiseAlertWithMessage(results.responseData[0].description);
                //close the modal
                if(this.parent !== null){
                    inst.parent?.closeModal();
                }       
            }
            else{
                inst.raiseErrorAlertWithMessage(results.responseData[0].description);                    
            }
        });
       };

       let objectData = {msg:"Would you really like to update the suggested Tool?",title:"Update Suggested Tool",onSubmit:actualUpdate,acceptButtonText:"Update"};
      

       if(this.checkComponent){
            this.checkComponent.setData(objectData);
            this.openModal();
       }
    }

    submit(){
        
        if(!this.isDirty) return; 
        let values:any[] = [];

        let e = document.getElementById("taxonomyMissing");
        if(e){
           e.classList.remove("invalid");
        }
        this.taxonomyNotPresent = false;

        for(let i  = 0;i<this.children.length;i++){
            let value = this.children[i].getValue();
             values.push(value);
/*           console.log(this.children[i]);
             console.log(value);*/
             
             if(value.type && value.type === 'tree' && Object.keys ( value.options ).length === 0){
                 this.taxonomyNotPresent = true;
                 //console.log(value);
                 let e = document.getElementById("taxonomyMissing");
                 if(e){
                    e.classList.add("invalid");
                 }
             }
             else if(value.type && ( value.type === 'url' || value.type === 'interactive-string') && value.valid !== undefined && value.valid === false){
                let e = document.getElementById("invalidValue")?.parentElement;
                if(e){
                    //console.log(e);
                   e.classList.add("invalid");
                }
             }
             else if(value.valid === false){
               //  console.log("whaat")
             }
        }
    
        let validationResult = this.performValidation();
        this.resultsSubmitted = true;
        
        if(!this.taxonomyNotPresent && validationResult){
            if(this.onUpdate === true){
                this.update(values);
                return;
            }
            let inst = this;
            let submitSuggestedTool = ()=>{
                let params:any = {token: inst.token,tool:values};
                /*console.log(params)*/
                inst.service.suggestDigitalTool(params,(results:any)=>{
                    inst.checkModalIsOpen = false;
                    if(results.responseData[0].data === true){
                        inst.raiseAlertWithMessage(results.responseData[0].description);
                        inst.navigateToSuggestionsPage();
                    }
                    else{
                        inst.raiseErrorAlertWithMessage(results.responseData[0].description);                    
                    }
                });
            };
            if(this.checkComponent){
                this.checkModalIsOpen = true;
                //construct data for dynamic view
                let objectData = {msg:"Would you really like to submit your tool suggestion?",title:"Submit Suggested Tool",onSubmit:submitSuggestedTool,acceptButtonText:"Submit"};
                this.checkComponent.setData(objectData);
            }
            else{
                 submitSuggestedTool();
            }
        }
    }

    public ngOnDestroy(){
         this.onModalClose()();
    }

    onModalClose(): Function {
        let parentRef = this;
        return (() => {
            if(parentRef.showRecaptcha){
                parentRef.recaptchaService?.removePluginScript();
            }

            parentRef.checkModalIsOpen = false;
        //    parentRef.modalIsOpen = false;
            //  parentRef.cookiesModalIsOpen = false;
        });
    }

    navigateToSuggestionsPage(){
        let umanagement = this.userManagementService;
        umanagement.getNGZone().runTask(()=>{
            console.log("navigateToSuggestionsPage")

            setTimeout(()=>{
                window.location.href = environment.env.client.prefix+'my-suggestions'
                return true;
            },100);

        });
    }
}