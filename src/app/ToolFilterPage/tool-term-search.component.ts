import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { BackendService } from "../backend.service";
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSelectionListChange } from "@angular/material/list";
import { RuntimeObjectsService } from "./runtimeobjects.service";

export interface SearchField {
    id: number;
    name: string;
}
export interface Expression {
    field: SearchField;
    value: string;
}

export enum ExpressionOperator {
    MATCH_ANY = 0,
    MATCH_ALL
}

export interface ExpressionList {
    exprs: Expression[];
    globalOperator: ExpressionOperator;
}

@Component({
    selector: 'tool-term-search',
    templateUrl: './ref-tool-term-search.component.html',
    styleUrls:['../style/tool-term-search.css']
})

export class ToolTermSearch {
    //We need the enum available also in our template, 
    //with the following statement we enable it by 'declaring' it
    ExpressionOperator = ExpressionOperator;
    selectedOperator:ExpressionOperator = 0;
    _parent: any = null;
    expressions: ExpressionList;
    dataFetched: boolean = false;
    searchFieldOptions: SearchField[] = [];
    selectedField: SearchField = {} as SearchField;
    filledText = "";
    defaultFormControl: FormControl;
    alert:any = null;
    alertDismissTimeout = 5000;
    noResultsAlert:any = null;
    currentExpressionShow:boolean = true;
    private invalidCharacters:string[] = ["|","[","]","\\","/"];
    private cbCalled:boolean = false;

    @Input()  set parent(p:any){
        this._parent = p;
        this._parent.addChild(this);
    }

    constructor(private service: BackendService, private rts:RuntimeObjectsService) {
        this.expressions = { exprs: [], globalOperator: ExpressionOperator.MATCH_ANY } as ExpressionList;
        this.defaultFormControl = new FormControl();
        this.rts.storeCallback("tool-expressions",(exprs:ExpressionList)=>{
            this.retrieveData(()=>{

                if(this.cbCalled === true) return;
                this.cbCalled = true;
                if(exprs === null){
                        /*
                        if(this.currentExpressionShow === false){

                             this.currentExpressionShow = true;
                         }*/
                         this.currentExpressionShow = !this.currentExpressionShow;
                         if(this.expressions.exprs.length === 0){
                             this.currentExpressionShow = true;
                         }
                         return;
                     }                    
                     for(let i:number = 0;i<exprs.exprs.length;i++){
                        for(let j:number = 0;j<this.searchFieldOptions.length;j++){
                            if(this.searchFieldOptions[j].id === exprs.exprs[i].field.id){
                                exprs.exprs[i].field.name = this.searchFieldOptions[j].name;
                            }
                        }
                     }

                     //this.expressions.globalOperator = exprs.globalOperator;


                     this.expressions = exprs;
/*                     console.log(exprs);
                     console.log(this.expressions);
                     console.log(this.currentExpressionShow);*/
                     this.selectedOperator = exprs.globalOperator;

                     if(this.expressions !== null && this.expressions.exprs.length >= 1){
                         this.currentExpressionShow = false;
                     }

                     if(this.currentExpressionShow === false && ( ( this.expressions === null) || (this.expressions !== null && this.expressions.exprs.length === 0))  ){
                         this.currentExpressionShow = true;

                     }
                });
        });
    }

    removeCurrentExpression(){
        this.currentExpressionShow = false;
        this.filledText = '';
    }

    public setCurrentExpressionShow(visible:boolean){
        this.currentExpressionShow = visible;
    }

    addCurrentExpression(){
        this.currentExpressionShow = true;
    }

    lastQueryReturnedData():boolean{
        return this.service.lastQueryReturnedData();
    }

    update(){
    }

    private retrieveData(onFinish:Function|null){
        this.service.getQueryData().subscribe((value) => {
            if(value === null){
                return;
            }
            if (value !== null) {
                if (!("searchFields" in value)) {
                    return;
                }
                this.noResultsAlert = null;

                if(!this.service.lastQueryReturnedData()){
                    this.raiseEmptyResultsAlert();
                }
                this.searchFieldOptions = [];
                for (let i: number = 0; i < value['searchFields'].length; i++) {
                    let field: SearchField = {} as SearchField;
                    field.id = value['searchFields'][i]['id'];
                    field.name = value['searchFields'][i]['value'];
                    this.searchFieldOptions.push(field);
                }
                this.selectedField = this.searchFieldOptions[0];
                if (this.expressions.exprs.length === 0) {
                    if(this.currentExpressionShow === false){
                        this.currentExpressionShow = true;
                    }
                }
                else{
                    this.currentExpressionShow = false;
                }



                this._parent.addTerm(this);
                this.dataFetched = true;
                if(onFinish !== null){
                    onFinish();
                }
            }
        });

    }

    ngOnInit() {
        this.retrieveData(null);
    }

    termSet(index:number, value:any):void{
        let id:number = this.expressions.exprs[index].field.id;
        if(this.checkQueryComponentsExist(value, id)){
            if(value=== null){
                return;
            }
            if(value.trim().length === 0){
                return;
            }
            this.raiseAlertWithMessage("Search term '"+value+"' under the category '"+this.expressions.exprs[index].field.name+"' exists!");
            return;
        }
    }

    getExprValue(v:string){
        return ;//this.expressions.exprs[index].value;
    }

    modifyExpressionSearchField(index:number,fieldIndex:number){
        if(index >= 0 && index < this.expressions.exprs.length && fieldIndex >= 0 && fieldIndex < this.searchFieldOptions.length){
            if(this.checkQueryComponentsExist(this.expressions.exprs[index].value, this.searchFieldOptions[fieldIndex].id)){
                if(this.expressions.exprs[index].value === null){
                    return;
                }
                if(this.expressions.exprs[index].value.trim().length === 0){
                    return;
                }
                this.raiseAlertWithMessage("Search term '"+this.expressions.exprs[index].value+"' under the category '"+this.searchFieldOptions[fieldIndex].name+"' exists!");
                return;
            }
            this.expressions.exprs[index].field = {id:this.searchFieldOptions[fieldIndex].id,name:this.searchFieldOptions[fieldIndex].name};
        }
    }

    addExpression() {
       if(this.filledText.trim() === ''){
           this.raiseAlertWithMessage("Please provide a Search Term");
           return;
       }
       if(this.containsInvalidCharacters()){
          this.raiseAlertWithMessage("The term cannot contain characters such as "+this.invalidCharacters.join(',')+", please remove them and try again.");
           return;
       }
       this.currentExpressionShow = true;
       this.addExpressionObject();
       this.filledText = '';
    }

    private containsInvalidCharacters():boolean{
        for(let i:number = 0;i<this.invalidCharacters.length;i++){
            if(this.filledText.indexOf(this.invalidCharacters[i]) !== -1){
                return true;
            }
        }
        return false;
    }

    private addExpressionObject(){
        if(this.filledText.length !== 0){
            let latestQueryExists:boolean = this.checkQueryExists();
            if(latestQueryExists === true){
                this.raiseAlert();
                return;
            }
            this.expressions.exprs.push(
                {
                    field:{id:this.selectedField.id,
                    name:this.selectedField.name},
                    value:this.filledText
                });
        }
    }

    public addTerm(term:string):ExpressionList{
        for(let i:number = 0;i<this.searchFieldOptions.length;i++){
            if(this.searchFieldOptions[i].name.toLowerCase().indexOf("all") !== -1){
                this.expressions.exprs.push({field:{id:this.searchFieldOptions[i].id,name:this.searchFieldOptions[i].name},value:term});
                this.filledText = '';       
                break;
            }
        }
        if(this.expressions.exprs.length !== 0){
            this.currentExpressionShow = false;
        }
        return this.expressions;
    }

    onSearchFieldChange(selected:SearchField){
        this.selectedField = selected;
    }

    removeExpression(i:number){
        this.expressions.exprs.splice(i,1);
        this.performQuery();

/*        if(this.expressions.exprs.length === 0){
            this.currentExpressionShow = true;
        }*/

        if(this.expressions.exprs.length === 0){
        this.currentExpressionShow = true;
        }

    }

    clearExpressions(){
        this.expressions.exprs = [];
        this.selectedOperator  =  this.expressions.globalOperator = ExpressionOperator.MATCH_ANY;

        this.performQuery();
        this.currentExpressionShow = true;
    }

    getExpressions(){
        return this.expressions;
    }

    cleanDuplicateExpressions(){
        if(this.expressions.exprs.length <= 1) return;
        var unique = this.expressions.exprs.filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
        this.expressions.exprs = unique;        
    }

    private cleanEmptyExpressions():ExpressionList{
        if(this.expressions.exprs.length === 0) return this.expressions;
        let nonEmpty:ExpressionList =  { exprs: [], globalOperator: this.expressions.globalOperator} as ExpressionList;
        for(let i:number = 0;i<this.expressions.exprs.length;i++){
            let term = this.expressions.exprs[i].value;
            if(term === null || (term !== null && term.trim().length === 0)){
                console.log("cleaned empty")
                continue;
            }
            else{
                nonEmpty.exprs.push(this.expressions.exprs[i]);
            }
        }
        return nonEmpty;
    }


    performQuery():void{
        //console.log(this.expressions);
        if(this.filledText.length !== 0){
            if(this.containsInvalidCharacters()){
                this.raiseAlertWithMessage("The term cannot contain characters such as "+this.invalidCharacters.join(',')+", please remove them and try again.");
                 return;
             }
            let latestQueryExists:boolean = this.checkQueryExists();
            if(latestQueryExists === true){
                this.raiseAlert();
                return;
            }
            this.expressions.exprs.push(
                {
                    field:{id:this.selectedField.id,
                    name:this.selectedField.name},
                    value:this.filledText
                });
        }
        this.cleanDuplicateExpressions();
        this.expressions = this.cleanEmptyExpressions();
        this.expressions.globalOperator = this.selectedOperator;
//        console.log(this.expressions);
        this.filledText = "";
        this.selectedField = this.searchFieldOptions[0];
        console.log(this.expressions)
        this._parent.searchByQuery(this.expressions);

        this.currentExpressionShow = false;
    }

    private raiseAlertWithMessage(msg:string){       
        if(this.alert !== null){
            return;
        } 
        this.alert = {msg: msg};
        setTimeout(()=>{ 
            this.alert = null;
       }, this.alertDismissTimeout);
    }

    private raiseAlert(){        
        if(this.alert !== null){
            return;
        } 
        if(this.filledText.trim().length === 0){
            return;
        }
        this.alert = {msg: "Search term '"+this.filledText+"' under the category '"+this.selectedField.name+"' exists!"};
        setTimeout(()=>{ 
            this.alert = null;
       }, this.alertDismissTimeout);
    }

    private raiseEmptyResultsAlert(){
        this.noResultsAlert = {msg:"No results found!"};        
    }

    selectQueryOperator(selectedOperator:ExpressionOperator){
        this.selectedOperator = selectedOperator;
    }

    private checkQueryExists():boolean{
        if(this.expressions.exprs.length === 0) return false;
         let id:number = this.selectedField.id;
         let value:string = this.filledText;
         for(let i:number = 0;i<this.expressions.exprs.length;i++){
             if(this.expressions.exprs[i].field.id === id && this.expressions.exprs[i].value === value){
                 return true;
             }
         }
         return false;
    }

    private checkQueryComponentsExist(text:string, fieldId:number):boolean{
        if(this.expressions.exprs.length === 0) return false;
         let id:number = fieldId;
         let value:string = text;
         for(let i:number = 0;i<this.expressions.exprs.length;i++){
             if(this.expressions.exprs[i].field.id === id && this.expressions.exprs[i].value === value){
                 return true;
             }
         }
         return false;
    }


}