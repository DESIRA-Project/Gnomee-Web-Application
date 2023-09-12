import { ParamMap } from "@angular/router";
import { AdvancedSearchComponent } from "./advanced-search.component";
import { MobileFilterDataLoader } from "./mobile-filter-data-loader";
import { ExpressionList, ExpressionOperator } from "./tool-term-search.component";

export class AdvancedSearchInitializer{
    
    constructor(public inst:AdvancedSearchComponent){
        
    }

    execute(params:ParamMap){
       this.initializeAdvancedSearchPageWithParameters(params);
    }

    private getIntegerOrDefault(value:any,def:number):number{
        let n = Number(value);
        if(Number.isNaN(n)){
          return def;
        }
        return n;
    }

    private handleAdditionalAttributeParameters(params:ParamMap,knownAttrs:string[]){
        let allAttrs = params.keys;
        for(let i:number = 0;i<allAttrs.length;i++){
            if(knownAttrs.indexOf ( allAttrs[i]) === -1){
              //new attribute
              let valuesString = params.get(allAttrs[i]);
              let values:number[] = [];
             // console.log(valuesString);
              if(valuesString !== null && valuesString.indexOf("+") !== -1){
                  let valuesStr = valuesString.split("+");
                  for(let j:number = 0 ;j<valuesStr.length;j++){
                     values.push(Number(valuesStr[j]));
                  }
              }
              else{
                if(valuesString !== null){
                    values.push(Number ( valuesString) );
                }
              }
              this.inst.addFilter({name:allAttrs[i], options:values});            
            }
        }
   }

   private numberStringArrayToArray(s:string|null):string[]{
    if(s === null){
      return [];
    }
    let tokens:string[] = s.split("+");      
    return tokens;
  }


   private buildExpressionsFromParameters(params: ParamMap){
    let operator = this.getIntegerOrDefault(params.get("operator"), 0);
    let e = { exprs: [], globalOperator: operator === 0 ? ExpressionOperator.MATCH_ANY : ExpressionOperator.MATCH_ALL } as ExpressionList;
    let types = this.numberStringArrayToArray (params.get("types") );
    let terms = this.numberStringArrayToArray ( params.get("terms") );
/*      console.log(terms);
    console.log(types);
    console.log(operator);*/
/*      console.log(terms);
    console.log( types);*/
    for(let i:number = 0 ;i<terms.length;i++){
        e.exprs.push({
          field:{ 
            id: this.getIntegerOrDefault(types[i], 0),
            name:"*"},
            value:terms[i]
        });
    }

    //console.log(e);
    return e;
}
    

    private initializeAdvancedSearchPageWithParameters(params: ParamMap) {
        let defaultAttributes = ["results","sort", "page", "terms", "types", "operator"];
     
    
        if (params.has("results")) {
            let amountOfResults:any = this.getIntegerOrDefault(params.get("results"), 10);
            this.inst.backendService.setAmountOfResults(amountOfResults);
            this.inst.rts.storeValue("results", amountOfResults);
        }
    
        if (params.has("sort")) {
          let sorting:any = this.getIntegerOrDefault(params.get("sort"), 1);
          this.inst.backendService.setSortingOption(sorting);
          this.inst.rts.storeValue("sort", sorting);
        }

        if(params.has("terms") && params.has("types") && params.has("operator")){
            this.inst.expressions = this.buildExpressionsFromParameters(params);
            /*console.log(this.inst.expressions);*/
            this.inst.lastQuery = this.inst.buildSearchQuery(this.inst.expressions);
        }
    
        this.handleAdditionalAttributeParameters(params, defaultAttributes);
        
        let page:any = -1;
        let extraFilters = Object.assign({}, this.inst.currentFilters);
    
        if(params.has("page")){
           //page = params.get("page");
           page = this.getIntegerOrDefault(params.get("page"), 1);
           extraFilters.from = [ (page - 1 ) *10];          
        }

        this.inst.lastChange = {};
        this.inst.paginationReady = false;
    
        this.inst.backendService.fetchDataWithParameters(extraFilters, this.inst.lastQuery, () => {
          for (let i: number = 0; i < this.inst.children.length; i++) {
            if(typeof this.inst.children[i].update !== 'undefined'){
                this.inst.children[i].update();
            }  
            this.inst.filterDataExist();
          }
          let loader:MobileFilterDataLoader = new MobileFilterDataLoader(this.inst.backendService, this.inst.currentFilters,
             this.inst.rts,(values:any)=>{
                this.inst.sanitizeUrl(values);    
                this.inst.dataReady = true;
                this.inst.paginationReady = true; 
          });

          this.inst.rts.storeValue("tool-expressions",this.inst.expressions);
          this.inst.rts.triggerAndForget("tool-expressions");
    
          this.inst.rts.trigger();    

        });
    
      }
}