import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class GeoCountryService {
    private configData: any = {};
    private configDataRead: boolean = false;
    private configDataListener: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private continentListener: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);

    private serviceReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private europeIndices:number[] = [];
    private africaIndices:number[] = [];
    private latinAmericaIndices:number[] = [];
    private centralAmericaIndices:number[] = [];
    private balticStateIndices:number[] = [];    

    constructor(private http: HttpClient) {
        console.log("GeoCountryService is instantiated");
       // this.readConfiguration();
    }

    private readConfiguration(): void {
        var startTime = performance.now();

        let isProduction:boolean = false;
        if(window.location.hostname.indexOf("localhost") === -1){
            isProduction = true;
        }
        let inst = this;
        console.log("read  geojson file")
        this.http.get(isProduction === true ? "./assets/countries.geojson" : "./assets/countries.geojson").subscribe(data => {
            //console.log(data);
            this.configData = data;
            this.configDataRead = true;  
            var endTime = performance.now()

            console.log(`Call to readConfiguration took ${endTime - startTime} milliseconds`);
            this.collectRegionalIndices().subscribe((value)=>{
                inst.serviceReady.next(true);
            });
           // this.getCountry("Greece");
           // this.configDataListener.next(this.configData);
        });
    }

    public getEuropeIndices():any[]{
        let features:any[] = [];
        for(let i:number = 0;i<this.europeIndices.length;i++){
            features.push(this.configData.features[this.europeIndices[i]]);
        }
        return features;
    }

    public getAfricaIndices():any[]{
        let features:any[] = [];
        for(let i:number = 0;i<this.africaIndices.length;i++){
            features.push(this.configData.features[this.africaIndices[i]]);
        }
        return features;
    }

    public getLatinAmericaIndices():any[]{
        let features:any[] = [];
        for(let i:number = 0;i<this.latinAmericaIndices.length;i++){
            features.push(this.configData.features[this.latinAmericaIndices[i]]);
        }
        return features;
    }

    public getCentralAmericaIndices():any[]{
        let features:any[] = [];
        for(let i:number = 0;i<this.centralAmericaIndices.length;i++){
            features.push(this.configData.features[this.centralAmericaIndices[i]]);
        }
        return features;
    }

    public getBalticStateIndices():any[]{
        let features:any[] = [];
        for(let i:number = 0;i<this.balticStateIndices.length;i++){
            features.push(this.configData.features[this.balticStateIndices[i]]);
        }
        return features;
    }


    private collectRegionalIndices():Observable<boolean>{
        for(let i:number = 0;i<this.configData.features.length;i++){
            if(this.configData.features[i].properties.continent === "europe"){
               this.europeIndices.push(i);
               //continue;
            }
            if(this.configData.features[i].properties.continent === "africa"){
                this.africaIndices.push(i);
                //continue;
             }
             if(this.configData.features[i].properties.region !== undefined && this.configData.features[i].properties.region.indexOf('latin america') !== -1){
                this.latinAmericaIndices.push(i);
                //continue;
             }

             if(this.configData.features[i].properties.region !== undefined && this.configData.features[i].properties.region.indexOf('central america') !== -1){
                this.centralAmericaIndices.push(i);
                //continue;
             }    
             if(this.configData.features[i].properties.region !== undefined && this.configData.features[i].properties.region.indexOf('baltic states') !== -1){
                this.balticStateIndices.push(i);
                //continue;
             }
         
        }

         this.continentListener.next(true);
         return this.continentListener;
    }

    public getConfigData(): Observable<any> {
        return this.configDataListener.asObservable();
    }

    public getServiceIsReady(): Observable<boolean> {
        return this.serviceReady.asObservable();
    }

    public getCountry(key:string):any{
        if(!this.configDataRead) return null;
        for(let i:number = 0;i<this.configData.features.length;i++){
            if(this.configData.features[i].properties.ADMIN === key){
                //console.log(this.configData.features[i]);
                return this.configData.features[i];
            }
        }
        return null;
    }

}