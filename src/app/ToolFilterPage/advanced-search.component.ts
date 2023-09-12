import { E } from '@angular/cdk/keycodes';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BackendService } from '../backend.service';
import { PageConfigService } from '../pageconfig.service';
import { AdvancedSearchInitializer } from './advanced-search-initializer';
import { MobileFilterDataLoader } from './mobile-filter-data-loader';
import { ResolutionAwareComponent } from './resolutionaware.component';
import { RuntimeObjectsService } from './runtimeobjects.service';
import { ExpressionList, Expression, ExpressionOperator } from './tool-term-search.component';

@Component({
  selector: 'advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['../style/advanced-search.css','../style/breadcrumb.css'],
  providers: []
})

export class AdvancedSearchComponent extends ResolutionAwareComponent{
  title = 'KnowledgeBaseTool-Frontend';
  private filterData: any = {};
  public children: any = [];
  public currentFilters: any = {};
  public lastChange: any = {};
  public dataReady: boolean = false;
  public lastQuery: any = {};
  paginationReady: boolean = true;
  private lastSearchTerm: string | null = null;
  private configKey: string = "search_page";
  public pageData: any = null;
  public expressions: any = null;
  public filterModalOpen: boolean = false;
  public innerWidth: number = 0;
  private modal: any = null;
  private urlReflectedFilters: any = {};
  private queriesUrl: any = null;
  private resultsSettings: any = {};
  private pageOnResize:boolean = false;
  public viewIsMobile:boolean = false;
  public hasFilterData:boolean = false;

  constructor(private configService: PageConfigService,
              public backendService: BackendService, 
              private route: ActivatedRoute,
              public rts:RuntimeObjectsService) {
    super();
    this.innerWidth = window.innerWidth;
    this.initializeAdvancedSearchPage();
  }

  ngOnInit() {
    this.configService.getConfigData().subscribe((value) => {
      if (value === null) {
        return;
      }
      if (this.configKey in value) {
        this.pageData = value[this.configKey];
        //     console.log(this.pageData);
      }

      this.viewIsMobile = this.isMobile();
     // console.log("is mobile"+this.isMobile());
    });
  }

/*  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
//    console.log(this.children);
    this.children = [];
    if(this.pageOnResize === false){
          this.pageOnResize = true;
          setTimeout(()=>{
              this.handleResize(event);
              this.pageOnResize = false;
          },2000);   
    }
  }*/

  private handleResize(event: any){
    this.innerWidth = event.target.innerWidth;
    this.rts.trigger();

    if (this.innerWidth < 300) {
        if (this.filterModalOpen) {
            this.filterModalOpen = false;
            this.modal.close();
        }
    }
    else {

    }
  }

  toggleFilterModal() {
    //console.log(this.filterModalOpen);
    this.filterModalOpen = !this.filterModalOpen;
    if (this.filterModalOpen === true) {
      this.modal.open();
    }

    if (this.filterModalOpen === false) {
      this.modal.close();
    }
  }

  anotherModalIsOpen(){
    if(this.modal === null){
      return false;
    }
    return this.modal.otherModalsOpen();
  }

  setToggleFilterModal(toggle: boolean) {
    this.filterModalOpen = toggle;
  }

  setModal(modal: any) {
    this.modal = modal;
  }

  public finishedLoading(): boolean {
    return this.dataReady && this.paginationReady;
  }

  public filterDataExist(){
      if(this.expressions !== null && this.expressions.exprs.length > 0){
          this.hasFilterData = true;
          return;
      }
      for(let key in this.currentFilters){
          if(this.currentFilters[key] !== null && this.currentFilters[key].length > 0){
            this.hasFilterData = true;
            return;
          }
      }

      this.hasFilterData  = false;
  }

  private initializeAdvancedSearchPage(): void {
    
    this.route.queryParamMap.subscribe((value) => {
      this.backendService.isInitialized().subscribe((beInitialized) => {
        if (beInitialized === true) {
          if (value.keys.length === 0) {
            this.backendService.fetchData({}, () => {
              this.filterDataExist();
              this.dataReady = true;
             });
          }
          else {
            if (value.has("term")) {
                let term:string|null;
                term = this.lastSearchTerm = value.get("term");

                this.backendService.searchTerm({ term: this.lastSearchTerm }, () => {
                    this.notifyChildForTerm(term);
                    this.filterDataExist();
                    this.dataReady = true;
                    return;
                });
                return;
            }
            else {
              let b: boolean = this.urlQueryShared(value);
              if (b) {
             //   this.rts.storeValue("onInit", true);
                this.initializeAdvancedSearchPageWithParameters(value);                
              }
              else {
                this.backendService.fetchData({}, () => { 
                  this.filterDataExist();
                  this.dataReady = true;
                  return;
                });
              }
            }
          }
       
        }
      })
    });
  }

  private initializeAdvancedSearchPageWithParameters(params: ParamMap) {
    let init = new AdvancedSearchInitializer(this);
    init.execute(params);
    return;
  }

  public sanitizeUrl(values:any){
    return;
 //   alert("sanitize url");
/*    console.log(values);
    console.log(this.currentFilters);
    return;*/

    this.currentFilters = values;
    
    let paramStrings:any[] = [];
    let url: string = window.location.href.indexOf('?') === -1 ? window.location.href : window.location.href.split('?')[0];
    url += paramStrings.length !== 0 ? "?" + paramStrings.join("&") : "";

    let filterStrings: any = this.objectToUrlParameterList(this.currentFilters);//[];

    if (filterStrings.length !== 0) {
        url = this.joinUrlParameter(url, filterStrings.join("&"));
    }

    url = this.urlAddQueryParameters(url);
    this.queriesUrl = this.buildQueriesUrl(this.expressions);
   // this.updateUrl(this.urlAddQueryParameters(url) );
  }

  private urlQueryShared(value: ParamMap): boolean {
    if ((value.has("term") === true && value.keys.length === 1) || (value.keys.length === 0)) {
      return false;
    }
    return true;
  }

  notifyChildForTerm(term: string | null) {
    if (term !== null) {
      //alert("add term "+this.lastSearchTerm);

      for (let i: number = 0; i < this.children.length; i++) {
        if (typeof this.children[i].addTerm !== 'undefined') {
          this.expressions = this.children[i].getExpressions();
          this.lastQuery = this.buildSearchQuery(this.expressions);
          break;
        }
      }

      for (let i: number = 0; i < this.children.length; i++) {
        if (typeof this.children[i].update !== 'undefined'){
           this.children[i].update();
        }
      }
    }

    this.updateUrl(window.location.href.split("?")[0]);
    this.queriesUrl = this.buildQueriesUrl(this.expressions);
    this.updateUrlQuery(null, null);

  }


  addTerm(child: any) {
    if (this.lastSearchTerm !== null) {      
      let expressions: ExpressionList = child.addTerm(this.lastSearchTerm);
      this.lastQuery = this.buildSearchQuery(expressions);
      this.lastSearchTerm = null;
      //          history.pushState({}, "", window.location.href.split("?")[0]);
      this.updateUrl(window.location.href.split("?")[0]);
    }
/*    if(child.setCurrentExpressionShow !== undefined){
      child.setCurrentExpressionShow(false);
    }*/
  }

  addChild(child: any) {
    this.children.push(child);
  }

  getLastChange() {
    return this.lastChange;
  }

  public addFilter(change: any) {
    /*      console.log("Adding change");
          console.log(change);*/
    let attributeName: string = change.name;
    let options: any = change.options;
//    console.log(change);
    if (options === null || (options !== null && options.length === 0)) {
      if (attributeName in this.currentFilters) {
        delete this.currentFilters[attributeName];
        //    this.updateUrlQuery( null, null);
        return;
      }
    }
    this.currentFilters[attributeName] = options;
    //  console.log(this.currentFilters);
    //  this.updateUrlQuery( null, null);
  }

  private updateUrl(url: string) {
    history.pushState({}, "",  ( url ) );
  }

  private objectToUrlParameterList(o: any): Array<string> {
    let results: any = [];
    for (let key in o) {
      let values: any = o[key];
      if (values.length === 0) continue;
      results.push(key + "=" + values.join("+"));
    }
    return results;
  }

  private updateUrlQuery(attribute: any, value: any) {
      if (attribute !== null) {
          //Parameter Value Change
          this.urlReflectedFilters[attribute] = value;
      }

      let paramStrings: any = this.objectToUrlParameterList(this.urlReflectedFilters);
      let url: string = window.location.href.indexOf('?') === -1 ? window.location.href : window.location.href.split('?')[0];
      url += paramStrings.length !== 0 ? "?" + paramStrings.join("&") : "";

      let filterStrings: any = this.objectToUrlParameterList(this.currentFilters);//[];

      if (filterStrings.length !== 0) {
          url = this.joinUrlParameter(url, filterStrings.join("&"));
      }

      url = this.urlAddQueryParameters(url);
      this.updateUrl(url);
  }

  private urlAddQueryParameters(url: string): string {
    if (this.queriesUrl !== null) {
      if (Array.isArray(this.queriesUrl[0]) && Array.isArray(this.queriesUrl[1]) && this.queriesUrl[0].length > 0 && this.queriesUrl[0].length === this.queriesUrl[1].length) {
        let attribute = this.queriesUrl[0];
        let value = this.queriesUrl[1];
        let queryStrings: any = [];

        for (let i: number = 0; i < attribute.length; i++) {
          queryStrings.push(attribute[i] + "=" + value[i].join("+"));
        }

        url = this.joinUrlParameter(url, queryStrings.join("&"));
      }
    }
    return url;
  }

  private joinUrlParameter(url: string, parameterString: string) {
    if (url.indexOf("?") == -1) {
      url += "?" + parameterString;
    }
    else {
      url += "&" + parameterString;
    }
    return url;
  }

  getCurrentFilters() {
    return this.currentFilters;
  }

  getExpressions() {
    return this.expressions;
  }

  changeAmountOfResults(amount: number) {
    this.updateUrlQuery("results", [amount]);
    this.backendService.setAmountOfResults(amount);
    this.fetchResultPage(0, 1);
  }

  changeSortingOption(option: number) {
    this.updateUrlQuery("sort", [option]);
    this.backendService.setSortingOption(option);
    this.fetchResultPage(0, 1);
    this.rts.storeValue("sort",option);
  }

  triggerChange(globalChange: any, change: any) {
    this.addFilter(globalChange);

    this.updateUrlQuery("page", [1]);
    this.lastChange = change;
    this.dataReady = false;

    this.backendService.fetchDataWithParameters(this.currentFilters, this.lastQuery, () => {
      for (let i: number = 0; i < this.children.length; i++) {
        if(typeof this.children[i].update !== 'undefined')
        this.children[i].update();
      }
      this.filterDataExist();
      // this.children = [];
      this.dataReady = true;
    });
  }

  triggerUpdate(change: any) {
/*    console.log("triggerUpdate");
    console.log(change);*/
    let attributeName: string = change.attributeName;
    let id: number = change.id;

    if (!(attributeName in this.currentFilters)) {
      return;
    }
/*    console.log("trigger update");
    console.log(this.currentFilters);*/
    this.currentFilters[attributeName].splice(this.currentFilters[attributeName].indexOf(id), 1);
  //  console.log(this.currentFilters);

    this.updateUrlQuery(null, null);

    this.lastChange = change;
    this.dataReady = false;
    this.backendService.fetchDataWithParameters(this.currentFilters, this.lastQuery, () => {
      for (let i: number = 0; i < this.children.length; i++) {
        if(this.children[i].update !== undefined){
            this.children[i].update();
        }
      }
      this.filterDataExist();
      // this.children = [];
      this.dataReady = true;
    });
  }


  fetchResultPage(from: number, pageNumber: number) {
    this.updateUrlQuery("page", [pageNumber]);

    //console.log("fetch result page-----------------------");
    let pageFilters = Object.assign({}, this.currentFilters);
    pageFilters.from = [from];
    this.lastChange = {};
    this.paginationReady = false;

    this.backendService.fetchDataWithParameters(pageFilters, this.lastQuery, () => {
      for (let i: number = 0; i < this.children.length; i++) {
        if(this.children[i].update !== undefined){
            this.children[i].update();
        }
        //console.log(this.children[i]);
      }
      this.filterDataExist();
      this.paginationReady = true;
    });
  }

  private buildQueriesUrl(expressions: ExpressionList) {
    if(expressions === null){
      return null;
    }
    if (expressions.exprs.length === 0) {
      return null;
    }
    let attributes: any = [];
    let values: any = [];

    attributes.push("terms");
    attributes.push("types");
    attributes.push("operator");

    let terms: any = [];
    let types: any = [];
    let operator: any = [];

    for (let i: number = 0; i < expressions.exprs.length; i++) {
      terms.push(expressions.exprs[i].value);
      types.push(expressions.exprs[i].field.id);
    }

    operator.push(expressions.globalOperator);

    values.push(terms);
    values.push(types);
    values.push(operator);
    return [attributes, values];
  }

  searchByQuery(expressions: ExpressionList) {
//    console.log("searchByQuery");
    this.queriesUrl = this.buildQueriesUrl(expressions);
    this.updateUrlQuery(null, null);
    this.lastQuery = this.buildSearchQuery(expressions);

    //console.log(expressions);
    this.lastChange = {};
    this.expressions = expressions;

    this.dataReady = false;
    this.backendService.fetchDataWithParameters(this.currentFilters, this.lastQuery, () => {
      for (let i: number = 0; i < this.children.length; i++) {
        if(this.children[i].update !== undefined){
            this.children[i].update();
        }
      }
      this.filterDataExist();
      // this.children = [];
      this.dataReady = true;
    });
  }

  public buildSearchQuery(expressions: ExpressionList): any {
    if (expressions.exprs.length === 0) {
      return {};
    }

    let query: any = { queries: [], queryOperator: expressions.globalOperator }
    for (let i: number = 0; i < expressions.exprs.length; i++) {
      let expr: Expression = expressions.exprs[i];
      query.queries.push({ field: expr.field.id, term: expr.value });
    }
    return query;
  }
}
