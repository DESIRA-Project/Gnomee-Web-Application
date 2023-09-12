import { Component, HostListener, Input } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { ResolutionAwareComponent } from "../ToolFilterPage/resolutionaware.component";
import { AttributePathIterator } from "./attribute-path-iterator";
import { CategoryGrid } from "./category-grid";
import { PathIterator } from "./path-iterator";

@Component({
    selector: 'path-viewer',
    templateUrl: './path-viewer.component.html',
    styleUrls: ['../style/path-viewer.css'],
    providers: []
})

export class PathViewerComponent extends ResolutionAwareComponent{
    public _pathIterator:AttributePathIterator|null = null;
    public viewLoaded:boolean = true;
    public values:any = null;
    public currentPath:string|null = "";
    public currentCategory:string|null = null;
    public currentHierarchy:any = null;
    public canVisitParent:boolean = false;
    private grid:CategoryGrid = new CategoryGrid();
    public mobile:boolean = this.isMobile();
    public hasNextPage:boolean = false;
    public currentDataIndex:number = -1;
    public nextDataIndex:number = -1;
    public isTraversed:boolean = false;
    public allResultsSize:number = -1;

    @Input() set pathIterator(p:AttributePathIterator){
        this._pathIterator = p;
        let inst = this;
        this._pathIterator.setOnLoadCB(()=>{
            inst.viewLoaded = false;
        });
    }

    @Input() set traversed(t:boolean){
        this.isTraversed = t;
        if(t === true){
            this.canVisitParent = true;
        }
        this.getValues();
    }

    getStyle(){
        if(this._pathIterator !== null){
            return this._pathIterator.getData().style;
        }
        return null;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event:any) {
        this.mobile = this.isMobileScreen();
/*        console.log("resize")*/
    }

    getCurrentHierarchy(){
        if(this.currentHierarchy === null && this._pathIterator !== null){
            this.currentHierarchy = this._pathIterator.getHierarchy();
        }
        return this.currentHierarchy;
    }

    getRows():number[]{
        return this.grid.getRows();
    }

    getColumns():number[]{
        return this.grid.getColumns();
    }

    getColumn(row:number):number[]{
        return this.grid.getColumns();
    }

    getDataRow(r:number,c:number):any{
        return this.grid.getDataRow(r,c);
    }

    getDatumIndex(r:number, c:number):number{
        return this.grid.getDatumIndex(r,c);
    }

    getMaxCol(){
        return this.grid.getMaxCol();
    }

    getValues(){
        if(this.values === null && this._pathIterator !== null){
            this.values = this._pathIterator.next();
            this.updateUrlFromIterator();
            this.isTraversed = false;

            if ( this.values  instanceof  BehaviorSubject){
              //  this.viewLoaded = false;

                 this.values.subscribe((value)=>{
                     if(value === null || value === false){
                         return;
                     }
                     let v = this.prepareTerminalNodes(value);
                     this.prepareNavigation(value);
                     this.grid.setCategories(v);
                     this.values = v;
                     //console.log(this.values.length);
                     this.viewLoaded = true;                     
                     return;
                 });
                 return null;
            }
            this.currentPath = this._pathIterator.getPath();
            this.grid.setCategories(this.values);
        }
        return this.values;
    }

    private updateUrlFromIterator(){
        //alert("update")
        if(this._pathIterator !== null && this.isTraversed === false){
            //console.log("update url")
            let subject = this._pathIterator.getSubject();
            /*console.log("Subject = "+subject)*/
            let currentUrl = window.location.href;
            this.updateUrl(currentUrl+(currentUrl.endsWith('/') ?  "" : "/")+subject);    
        }
    }

    private updateUrl(url: string) {
        history.pushState({}, "",  ( url ) );
    }
    
    private prepareNavigation(values:any){
        let actual =  values[1].data.data;
        //console.log(actual);
        this.currentDataIndex = actual.from;
        this.allResultsSize = actual.allResultsSize;
        this.nextDataIndex = actual.nextPageFromIndex;
        this.hasNextPage = actual.hasNextPage;
        this._pathIterator?.setNextDataIndex(this.nextDataIndex);
    }

    private prepareTerminalNodes(values:any){
        let st = this._pathIterator?.getData().style;
        let actual =  values[0].data.data;
        let v =  [];
        for(let i:number = 0;i<actual.length;i++){
            v.push({
            'value':actual[i]['name'],
            'description':actual[i]['description'],
            'style':st.terminal.color.bg,
            'descriptionColor':st.terminal.color.description,
            'id':actual[i]['id'],
            'link':st.terminal.link+"/"+actual[i]['id'],
            'titleColor':st.terminal.color.title,"isTerminal":true})
        }
        return v;
    }

    private concatenateTerminalNodes(values:any):void{
        let st = this._pathIterator?.getData().style;
        let actual =  values[0].data.data;

        for(let i:number = 0;i<actual.length;i++){
            this.values.push({'value':actual[i]['name'],
            'description':actual[i]['description'],
            'id':actual[i]['id'],
            'style':st.terminal.color.bg,
            'descriptionColor':st.terminal.color.description,
            'link':st.terminal.link+"/"+actual[i]['id'],
            'titleColor':st.terminal.color.title,"isTerminal":true})
        }
    }

    getCurrentCategory(){
        if(this.currentCategory === null && this._pathIterator !== null){
            this.currentCategory = this._pathIterator.getCategory();
        }
        return this.currentCategory;
    }

    getCurrentPath(){
        if(this.currentPath === null && this._pathIterator !== null){
            this.currentPath = this._pathIterator.getPath();
        }
        return this.currentPath;
    }
      
    accessNode(i:number){
        if(this._pathIterator === null){
            return;
        }
        this.viewLoaded = false;
        this.values = null;
        this.currentPath = null;
        this.currentCategory = null;
        this.currentHierarchy = null;
        this.canVisitParent = true;

        setTimeout(
            ()=>{
                 let it = this._pathIterator as PathIterator;
                 it.setCurrentIterator(i);
                 let res = this.getValues();
                 if(res !== null){
                     this.viewLoaded = true;
                 }
            },100
        );
    }

    onDataNode(){
        return !this._pathIterator?.hasNext();
    }

    getParentValues(){
        if(this.values === null && this._pathIterator !== null){
            this.canVisitParent = this._pathIterator.hasPrev();
            this.popLastUrlEntity();
            this.values = this._pathIterator.prev();
            this.currentPath = this._pathIterator.getPath();
            this.grid.setCategories(this.values);
        }
        return this.values;
    }

    private popLastUrlEntity(){
        if(this._pathIterator !== null){
            let currentUrl = window.location.href;
            let tokens = currentUrl.split("/");
            //console.log(tokens);
            let lastToken = tokens[tokens.length - 1];

            let newUrl = currentUrl.substring(0, currentUrl.length - lastToken.length - 1);
            //console.log(newUrl)
            this.updateUrl(newUrl);    
        }
    }

    nodeIsTerminal():boolean{
        if(this._pathIterator === null){
            return false;
        }
        return !this._pathIterator.hasNext();
    }

    fetchNextBatch(){
        if(this._pathIterator !== null){
            let subject:BehaviorSubject<any>|null  = this._pathIterator?.fetchNextBatch();
            if(subject !== null){
                subject.subscribe((value)=>{
                    if(value === null || value === false){
                        return;
                    }
                    this.concatenateTerminalNodes(value);
                    this.prepareNavigation(value);
                    this.grid.setCategories(this.values);
                    this.viewLoaded = true;                     
                    return;
                });
            }
        }
    }

    accessParent(){
        if(this._pathIterator === null){
            return;
        }
        this.viewLoaded = false;
        this.values = null;
        this.currentPath = null;
        this.currentCategory = null;
        this.currentHierarchy = null;
        this.canVisitParent = false;
        this.hasNextPage = false;
        this.currentDataIndex = 0;
        this.nextDataIndex = 0;
        this._pathIterator?.setNextDataIndex(this.nextDataIndex);
        setTimeout(
            ()=>{
                 let it = this._pathIterator as PathIterator;
                 this.getParentValues();

                 this.viewLoaded = true;
            },100
        );

    }

    canGoBack(){
        return history.length > 2;
    }

};
