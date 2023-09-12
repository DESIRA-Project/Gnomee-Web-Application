import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AccessibleGrid } from "./accessible-grid";
import { PathViewerComponent } from "./path-viewer.component";

@Component({
    selector: 'node-viewer',
    templateUrl: './node-viewer.component.html',
    styleUrls: ['../style/node-viewer.css'],
    providers: []
})

export class NodeViewerComponent implements AccessibleGrid{

    data:any = null;
    parentNode:AccessibleGrid|null = null;
    r:number = -1;
    c:number = -1;
    //isVisible:boolean = false;
    //isLoaded:boolean = false;
    bgColor:string|null = null;
    index:number = -2;
    currentRow:any = null;
    dataLoaded:boolean = false;
    value:any = null;
    hasSmallStringValue:boolean = false;
    titleColor:any = null;
    descriptionColor:any = null;
    isTerminalNode:boolean = false;
    description:any = null;
    id:any = null;
    link:any = null;
    fullDescription:any = null;
    fullTitle:any = null;

    @Input() set nodeData(data:any){
        this.data = data;
    }

    @Input() set parent(p:PathViewerComponent|null){
        this.parentNode = p;
    }

    @Input() set row(r:number){
        this.r = r;
    }

    @Input() set col(c:number){
        this.c = c;
    }

    constructor(private router:Router){

    }
    

    isLoaded():boolean{
        if(this.dataLoaded === true) return true;
        this.currentRow = this.getDataRow(this.r,this.c);
        if(this.currentRow === null){
            return false;
        }
        this.bgColor = this.currentRow['style'];
        this.fullDescription = this.description = this.currentRow['description'];
        this.descriptionColor = this.currentRow['descriptionColor'];
        this.titleColor = this.currentRow['titleColor'];
        this.fullTitle = this.value = this.currentRow['value'];
        this.id = this.currentRow['id'];
        this.link = this.currentRow['link'];
        this.hasSmallStringValue = this.value.length < 15;
        this.isTerminalNode = this.currentRow['isTerminal'];
        if(this.isTerminalNode && this.value.length > 10){
            // this.value = this.value.substring(0,10)+'...';
        }
        if(this.isTerminalNode && this.description.length > 32){
            // this.description = this.description.substring(0,32) + '...';
        }
        if(this.description !== null && this.isTerminalNode){
           // this.description = this.description.charAt(0).toUpperCase() + this.description.substring(1,this.description.length - 1);
           // this.fullDescription = this.fullDescription.charAt(0).toUpperCase() + this.fullDescription.substring(1,this.fullDescription.length - 1);

        }

        this.dataLoaded = true;
        return true;
    }

    isVisible():boolean{
        //if(this.index !== -2) return this.index === -1;
        this.index = this.getDatumIndex(this.r,this.c);
        return this.index !== -1;
    }

    accessCurrentNode(){
        if(this.isTerminalNode && this.link !== null && this.link !== undefined){
            this.storeBrowserState();
            this.openToolDetailedViewPage();
        }
        else{
            this.accessNode(this.index);
        }
    }

    openToolDetailedViewPage(){
        this.router.navigateByUrl(this.link);
    }

    storeBrowserState(){
        history.pushState({}, "",  ( this.link ) );
    }

    getRows(): number[] {
        return this.parentNode !== null ? this.parentNode.getRows() : [];
    }
    getColumns(): number[] {
        return this.parentNode !== null ? this.parentNode.getColumns() : [];
    }
    getMaxCol(): number {
        return this.parentNode !== null ? this.parentNode.getMaxCol() : 0;
    }

    getDataRow(r: number, c: number) {
        return this.parentNode !== null ? this.parentNode.getDataRow(r,c) : null;
    }
    getDatumIndex(r: number, c: number): number {
        return this.parentNode !== null ? this.parentNode.getDatumIndex(r,c) : -1;
    }

    accessNode(pos: number): void {
         this.parentNode !== null ? this.parentNode.accessNode(pos) : -1;
    }



};
