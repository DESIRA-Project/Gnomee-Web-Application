import { Component, HostListener, Input } from "@angular/core";
import { BackendService } from "../backend.service";

@Component({
    selector: 'navigation',
    templateUrl: './tool-navigation.component.html',
    styleUrls:['../style/tool-navigation.css']
  })

export class ToolNavigation{
    data:any = [];
    dataFetched:boolean = false;
    _parent:any = null;
    pageEnumeration:number[] = [];
    pageMaxRange:number = 0;
    inputData:any = null;

    @Input() 
    public set parent(p: any) {
      this._parent = p;   
      this._parent.addChild(this);  
    }

    @Input()
    public set setData(d:any){
         this.inputData = d;
    }
    
    constructor(private service: BackendService){
      this.pageMaxRange = this.detectMob() ? 3 : 7;
    }

    detectMob():boolean {
      return ( ( window.innerWidth <= 800 ) && ( window.innerHeight <= 600 ) );
    }

    ngOnInit() {
      if(this.inputData !== null){
        this.data = this.inputData;
        //console.log(value);
        this.calculatePageEnumeration();
        this.dataFetched = true;
        return;
      }
      this.service.getNavigation().subscribe((value) => {
        if(value !== null){
          this.data = value;
          //console.log(value);
          this.calculatePageEnumeration();
          this.dataFetched = true;
        }
      });
    }

    calculatePageEnumeration(){
      if(this.data.totalAmountOfPages < this.pageMaxRange && this.data.totalAmountOfPages > 0){
          for(let i:number = 0;i<this.data.totalAmountOfPages;i++){
            this.pageEnumeration.push(i+1);
          }
          return;
      }
        let amountOfPageGroups:number = this.data.totalAmountOfPages / this.pageMaxRange;
        let currentPageGroup:number = Math.floor ( this.data.currentPageNumber / this.pageMaxRange );
        let min:number = currentPageGroup* this.pageMaxRange;
                
/*        console.log(min+ " "+this.pageMaxRange);
        console.log(this.data.totalAmountOfPages);*/
        for(let i:number = min;i<min + this.pageMaxRange;i++){
          this.pageEnumeration.push(i + 1);
          if(i + 1>= this.data.totalAmountOfPages) break;
          
        }
  //      console.log(this.pageEnumeration);
    }

    update(){
    }

    fetchPreviousResultPage(){
        this._parent.fetchResultPage(this.data.previousPageFromIndex, this.data.currentPageNumber);
    }

    fetchNextResultPage(){
        this._parent.fetchResultPage(this.data.nextPageFromIndex, this.data.currentPageNumber + 2);
    }

    fetchPage(i:number){
//      alert("fetch page "+i);
      /*
      allResultsSize: 633
currentPageNumber: 0
from: 0
hasNextPage: true
hasPreviousPage: false
nextPageFromIndex: 10
previousPageFrom: 0
resultsSize: 10
totalAmountOfPages: 63
      
      */
     this._parent.fetchResultPage(i*this.data.resultsSize, i + 1);
    }

    fetchFirstPage(){
      this._parent.fetchResultPage(0, 1);
    }

    fetchLastPage(){
//      alert(this.data.totalAmountOfPages);
console.log(this.data);

      this._parent.fetchResultPage(  ( this.data.totalAmountOfPages - 1 ) * this.data.resultsSize,this.data.totalAmountOfPages  );
    }

       
}