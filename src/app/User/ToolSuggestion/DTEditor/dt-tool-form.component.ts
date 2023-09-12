import { Component } from "@angular/core";
import { DynamicItem } from "src/app/ComponentLibrary/DynamicModal/dynamic-item.components";
import { ToolSuggestionFormComponent } from "../Member/tool-suggestion-form.component";

@Component({
    selector: 'digital-tool-form',
    templateUrl: '../Member/tool-suggestion-form.component.html',
    styleUrls:["../../../style/gnomee.css"]
})

export class DigitalToolFormComponent extends ToolSuggestionFormComponent{

   
    protected loadData(){
        this.service.isInitialized().subscribe(backendInitialized=>{
            this.service.getDigitalToolDataForm(this.token,(results:any)=>{
                let responseData = results;
                //console.log(results);
                for (const key in responseData['responseData']) {
                    this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
                }
                //console.log(this.data);

                this.formReady = true;
            });
        });
    }

    protected retrieveSuggestedToolData(){
        this.data = [];
        this.formReady = false;
        this.onUpdate = true;
        this.submitButtonText = "Update";   
        let params = {token:this.token, tool:this.currentToolId};

        this.service.getDigitalToolDataForm(params,(result:any)=>{
            let responseData = result;
            this.data = [];
            for (const key in responseData['responseData']) {
                 this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
            }
            this.formReady = true;
        });
    }

    public submit(){
        
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
            let inst = this;

            let verifiedSuggestedToolAction = ()=>{
            
                let submitSuggestedTool = ()=>{
                let params:any = {token: inst.token,tool:values,id:inst.currentToolId};
                /*console.log(params)*/
                inst.service.updateDigitalTool(params,(results:any)=>{
                    if(results.responseData[0].data === true){
                        inst.raiseAlertWithMessage(results.responseData[0].description);
                        if(this.parent){
                            this.parent.closeModal();
                        }
                        //inst.navigateToSuggestionsPage();
                    }
                    else{
                        inst.raiseErrorAlertWithMessage(results.responseData[0].description);                    
                    }
                });
            };
            submitSuggestedTool();
             //inst.recaptchaService?.execute(submitSuggestedTool);
          }
           //construct data for dynamic view
           let objectData = {msg:"Would you really like to update the stored Digital Tool?",title:"Update Digital Tool",onSubmit:verifiedSuggestedToolAction,acceptButtonText:"Update"};
           if(this.checkComponent !== undefined){
               this.checkComponent.setData(objectData);
               this.openModal();
           }
        }          
    }
}