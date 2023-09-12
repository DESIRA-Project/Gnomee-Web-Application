export class URLPath{
    private pathBase:string = "";
    private fullPath:string[] = [];
    private empty:boolean = false;
    private path:string[] = [];

    constructor(private currentUrl:string){
        if(currentUrl === null){
            this.empty = true;
            return;
        }
        if(currentUrl.trim().length === 0){
            this.empty = true;
            return;
        }
        this.fullPath = currentUrl.split('/').filter(function(i){return i});
        this.pathBase = this.fullPath[0];

        this.path  = Object.assign([], this.fullPath);
        this.path.splice(0,1);
    }

    getBasePath():string{
        return this.pathBase;
    }

    onAccessedPath():boolean{
        return !this.empty && this.path.length > 0;
    }

    getToken(i:number):string|null{
        if(this.empty === true){
            return null;
        }
        if(i < 0 || i >= this.path.length){
            return null;
        }
        return this.path[i];
    }

    popHead():string|null{
        if(this.empty === true){
            return null;
        }
        if(this.path.length === 0){
            return null;
        }
        let tok = this.path.splice(0,1)[0];
        /*console.log("After splice ");
        console.log(this.path)*/
        if(this.path.length === 0){
            this.empty = true;
        }
        return tok;
    }

    isEmpty(){
        return this.empty;
    }
}