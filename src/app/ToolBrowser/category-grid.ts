import { AccessibleGrid } from "./accessible-grid";

export class CategoryGrid implements AccessibleGrid{
    private data:any = null;
    private cols:number[] = [];
    private rows:number[] = [];

    constructor(){

    }
    accessNode(pos: number): void {
    }

    setCategories(data:any){
        this.data = data;
        this.calculateGrid();
    }

    private calculateGrid():void{
        if(this.data.length <= 3){
            this.rows = [0];
            this.cols = this.getArrayFilledUntilValue(this.data.length);
            return;
        }
        if(this.data.length === 4){
            this.rows = [0,1];
            this.cols =  [0,1];
            return;
        }
        if(this.data.length > 3){
            this.rows = this.getArrayFilledUntilValue(this.data.length / 3);
            this.cols =  this.getArrayFilledUntilValue(3);
            return;
        }
    }

    private getArrayFilledUntilValue(value:number):number[]{
        let a:number[] = [];
        for(let i:number = 0;i<value;i++){
            a.push(i);
        }
         return a;
    }

    getRows():number[]{
        return this.rows;
    }


    getColumns():number[]{
        return this.cols;
    }

    getMaxCol():number{
        return this.cols[this.cols.length -1] + 1;
    }

    getDataRow(r:number, c:number):any{
        //console.log(r,c);
        let maxCol = this.getMaxCol();
        let index = r * maxCol + c;
        return this.data[index];
//        return index;
    }

    getDatumIndex(r:number, c:number):number{
        let maxCol = this.getMaxCol();
        let index = r * maxCol + c;
        if(index > this.data.length - 1) return -1;
        return index;
    }


};
