export interface AccessibleGrid{
    getRows():number[];
    getColumns():number[];
    getMaxCol():number;
    getDataRow(r:number, c:number):any;
    getDatumIndex(r:number, c:number):number;
    accessNode(pos:number):void

};