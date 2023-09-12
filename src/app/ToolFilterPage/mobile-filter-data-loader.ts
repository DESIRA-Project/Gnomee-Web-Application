import { Observable } from "rxjs";
import { BackendService } from "../backend.service";
import { RuntimeObjectsService } from "./runtimeobjects.service";

export class MobileFilterDataLoader{
    cbs:Function[] = [];
    data:any[] = [];
    activeCBs:number = 0;
    parentFilters:any = {};
    selectedChanges:any = {};
    selectedChangesMinimal:any = {};

    constructor(private service:BackendService, parentFilters:any, private rts: RuntimeObjectsService, private onFinish:Function){
        this.parentFilters = parentFilters;
        this.loadData();
    }

    private reduceCBCnt(){
        this.activeCBs--;
        if(this.activeCBs === 0){
            //initiate search term init
            this.rts.storeValue("mobileSelectedAttributes", this.selectedChanges);
            this.rts.triggerAndForget("mobileSelectedAttributes");
            if(this.onFinish){
                this.onFinish(this.selectedChangesMinimal);
            }
        }
    }

    private loadData(){
        this.service.getData().subscribe((value:any)=>{

            if(value === null){
                return;
            }
            for(let i:number = 0;i<value.length;i++){
                //console.log(value[i].data);
                switch(value[i].data.type){
                    case "list":{
                        //console.log("list");
                        this.cbs.push(this.getListCallback());
                        this.data.push(value[i]);
                        this.activeCBs ++;
                        break;
                    }
                    case "tree":{
                        //console.log("tree");                        
                        this.cbs.push(this.getTreeCallback());
                        this.data.push(value[i]);
                        this.activeCBs ++;
                        break;
                    }
                    default:break;
                }
            }
            for(let i:number = 0;i<this.cbs.length;i++){
                this.cbs[ i ](this,  this.data[i]);                   
            }
            return;

        });
    }

    getTreeCallback():Function{
        return (inst:MobileFilterDataLoader, data:any)=>{
            // do work
            let attrs = data.data.attribute;
            let tree = data.data.data;
            let addSelectedChange = (inst:MobileFilterDataLoader, key:string, level:number) => {
                if(inst.parentFilters[attrs[level]] === undefined) return;
                if(inst.parentFilters[attrs[level]].indexOf(Number(key)) === -1) {
                    return;
                }
                

                if(inst.selectedChanges[attrs[level]] === undefined){
                   inst.selectedChanges[attrs[level]] = [];
                   inst.selectedChangesMinimal[attrs[level]] = [];
                }

                //console.log("what thf " +key + " level = "+level);

                inst.selectedChangesMinimal[attrs[level]].push(Number(key));
                inst.selectedChanges[attrs[level]].push({
                    id:Number(key),
                    value:data.data.mappedAttributes[key],
                    attributeName:attrs[level]
                })
           };


            let visitTree = (inst:MobileFilterDataLoader, node:any, level:number) =>{
                if(typeof node === 'object'){
                    for(let key in node){
                        //console.log("Key = "+key);
                        addSelectedChange(inst, key, level  );
                        visitTree(inst, node[key], level + 1 );
                    }    
                }

            };

            for(let key in tree){
                   addSelectedChange(this, key, 0);
                   visitTree(inst, tree[key], 1);
            }

            inst.reduceCBCnt();
        };
    }

    getListCallback():Function{
        return (inst:MobileFilterDataLoader, data:any)=>{
            // do work
           // let selectedChanges = [];
            let attributeName = data.data.attribute;
            if(inst.parentFilters === null || inst.parentFilters[attributeName] === undefined){
                inst.reduceCBCnt();
                return;
            }

            this.selectedChanges[attributeName] = [];
            for(let i:number = 0;i<data.data.data.length;i++){

                let id = data.data.data[i].id;
                if(inst.parentFilters[attributeName].indexOf(id) !== -1){

                        this.selectedChanges[attributeName].push({
                            id: data.data.data[i].id,
                            value:data.data.data[i].name,
                            attributeName:attributeName
                        });
                       // console.log(data.data.data[i]);
                    }
            }

            //
            inst.reduceCBCnt();

        };
    }

};