import { Component, Input } from "@angular/core";

@Component({
    selector: 'category-hierarchy-viewer',
    templateUrl: './category-hierarchy-viewer.component.html',
    styleUrls: ['../style/category-hierarchy-viewer.css'],
    providers: []
})

export class CategoryHierarchyViewerComponent{
    public _hierarchy:any = null;
    public _leaf:any = null;
    public _style:any = null;
    public titleColor:string|null = null;

    @Input() set hierarchy(c:any){
        this._hierarchy = c;
        this.addWhitespaceAtStartOfHierarchyValue();

        if(c !== null && c.length >= 1){
            this._leaf = [this._hierarchy[this._hierarchy.length -1]];
            this._hierarchy.splice(this._hierarchy.length -1, 1);
        }

    }

    @Input() set style(st:any){
         this._style = st;
/*         console.log(this._style);
         console.log(this._style.terminal.color.title);*/
         this.titleColor = this._style.terminal.color.title;
    }

    private addWhitespaceAtStartOfHierarchyValue(){
        if(this._hierarchy !== null){
            for(let i:number = 0;i<this._hierarchy.length;i++){
                this._hierarchy[i][1] = " "+this._hierarchy[i][1];
            }
        }
    }

}
