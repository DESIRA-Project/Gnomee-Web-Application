
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { ReCaptchaService } from './ReCaptchaService/recaptcha.service';

@Injectable({
    providedIn:"root"
})
export class BackendService {
    private configData: any = {};
    private configDataRead: boolean = false;
    private data: any = [];
    private dataInfo: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    private tools: any = {};
    private toolsInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private queryData: any = {};
    private queryDataInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private toolDetails: any = {};
    private toolDetailsInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private contact: any = {};
    private contactInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private navigationData: any = {};
    private navigationDataInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private defaultAmountOfResults:number = 10;
    private currentAmountOfResults:number = this.defaultAmountOfResults;

    private totalAmountOfResults:number = 0;
    private totalAmountOfResultsInfo: BehaviorSubject<number> = new BehaviorSubject<any>(-1);


    private initializationInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private sortOptions:any = [];
    private sortOptionsInfo:BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private sortingOption:number = 0;

    private lastQueryContainedResults:boolean = false;

    private sharedDataBuffer:any = {};


    private searchFields:any = {
        searchFields:[
            {id:0, name:'all fields'},
            {id:1,name:'title'},
            {id:2,name:'description'},
            {id:3, name:'keywords'},
            {id:4,name:'users'},
            {id:5,name:'technology usage'}],
        expressions:[]
    };

    private filterIndicesUsage: any = null;

    constructor(private http: HttpClient, private router:Router, private recaptchaService:ReCaptchaService) {
        console.log("BackendService is instantiated");
        this.readConfiguration();
    }

    public getRecaptchaService():ReCaptchaService{
        return this.recaptchaService;
    }

    public getConfigValue(key:string):string|null{
        if(this.configData === null || this.configData === undefined){
            return null;
        }
        if(this.configData[key] === undefined) return null;
        return this.configData[key];
    }

    public lastQueryReturnedData():boolean{
     //   console.log(this.lastQueryContainedResults);
        return this.lastQueryContainedResults;
    }

    private readConfiguration(): void {
        let isProduction:boolean = environment.production;
        this.configData = environment.env.backend;
        this.configDataRead = true;
        this.initializationInfo.next(true);
    }

    private getUrl(protocol: string, host: string, port: string, endpoint: string): string {
        return protocol + "://" + host + (port !== "" ? ":" + port : "") + "/" + endpoint;
    }

    public fetchData(body:any, onFinish: Function): void {
        let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
            this.configData['port'], this.configData['get_tool_data_service']);

//        console.log(url);
        this.data = [];
        url += "?size="+this.currentAmountOfResults;
        //alert(url);
        this.http.post(url,body).subscribe(data => {
            let responseData: any = data;
        //    console.log(responseData['responseData'])
            for (const key in responseData['responseData']) {
                if (responseData['responseData'][key]['type'] === 'table') {
                    this.tools = { name: 'tools', data: responseData['responseData'][key] };
                    continue;
                }
                if (responseData['responseData'][key]['type'] === 'object') {
                    this.searchFields = { searchFields: responseData['responseData'][key]['data'], expressions:[] };
                    continue;
                }
                if (responseData['responseData'][key]['type'] === 'navigation-object') {
                    this.navigationData = responseData['responseData'][key]['data'];
                    continue;
                }
                if (responseData['responseData'][key]['type'] === 'sort-object') {
                    this.sortOptions = responseData['responseData'][key];
                    continue;
                }

                this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
            }
            this.lastQueryContainedResults = this.tools.data.data.length !== 0;
           // console.log(this.mockQueryData);
            this.navigationDataInfo.next(this.navigationData);
            this.dataInfo.next(this.data);
            this.toolsInfo.next(this.tools);
            this.queryDataInfo.next(this.searchFields);
            this.sortOptionsInfo.next(this.sortOptions);
            this.totalAmountOfResults = this.navigationData?.allResultsSize;
            this.totalAmountOfResultsInfo.next(this.totalAmountOfResults);

            onFinish();

        });
    }


    public fetchChartDataOnce(service:string, onFinish: Function): void {
        if(this.sharedDataBuffer[service] === undefined){

            let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
                                          this.configData['port'], this.configData[service]);
            let inst = this;
            this.http.get(url).subscribe(data => {
                inst.sharedDataBuffer[service] = data;
                let responseData: any = data;
                if(onFinish !== null && responseData.responseData !== undefined){
                    onFinish(responseData.responseData);
                }
            });
        }
        else{
            onFinish(this.sharedDataBuffer[service].responseData);
        }
    }


    public fetchChartData(service:string, getParameters:string, onFinish: Function): void {
        let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
            this.configData['port'], this.configData[service]);

        url += '?' + getParameters;

        this.http.get(url).subscribe(data => {
            let responseData: any = data;
            if(onFinish !== null){
                onFinish(responseData.responseData ?? responseData);
            }

        });
    }

    public browseToolsPath(body:any, onFinish: Function): void {
        let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
            this.configData['port'], this.configData['browse_tools_path_service']);

/*        console.log(url);
*/
        this.data = [];
        this.http.post(url,body).subscribe(data => {
            let responseData: any = data;
            /*console.log(responseData);*/
            for (const key in responseData['responseData']) {
                this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
            }
            this.dataInfo.next(this.data);
            if(onFinish !== null && onFinish !== undefined){
                onFinish();
            }
        });
    }

    public getBrowsedTools(body:any, from:number, onFinish: BehaviorSubject<any>): void {
        let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
            this.configData['port'], this.configData['browse_tools_service']);

            url += "?size=12&from="+from;
//        console.log(body);
        this.data = [];
        this.http.post(url,body).subscribe(data => {
            let responseData: any = data;
            /*console.log(data);*/
            for (const key in responseData['responseData']) {
                this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
            }

            if(onFinish !== null){
                onFinish.next(this.data);
            }
        });
    }


    private initialize() {
        this.data = [];
        this.dataInfo = new BehaviorSubject<any>([]);
        this.tools = {};
        this.toolsInfo = new BehaviorSubject<any>(null);

        this.navigationData = {};
        this.navigationDataInfo = new BehaviorSubject<any>(null);

/*        this.queryData = {};
        this.queryDataInfo = new BehaviorSubject<any>(null);
        this.navigationData = {};
        this.navigationDataInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);*/
    }

    private setupData(responseData:any):void{
        for (const key in responseData['responseData']) {
            if (responseData['responseData'][key]['type'] === 'table') {
                this.tools = { name: 'tools', data: responseData['responseData'][key] };
                //console.log("Amount of received data -> "+ responseData['responseData'][key].data.length);
                continue;
            }
            if (responseData['responseData'][key]['type'] === 'object') {
                this.searchFields = { searchFields: responseData['responseData'][key]['data'], expressions:[] };
                continue;
            }
            if (responseData['responseData'][key]['type'] === 'navigation-object') {
                this.navigationData = responseData['responseData'][key]['data'];
                continue;
            }

            if (responseData['responseData'][key]['type'] === 'sort-object') {
                this.sortOptions = responseData['responseData'][key];
                continue;
            }

            this.data.push({ name: responseData['responseData'][key]["attribute"], data: responseData['responseData'][key] });
        }
    }

    private setupToolDetailsData(responseData:any):void{
/*        console.log(responseData);
*/
        for (const key in responseData['responseData']) {
            if (responseData['responseData'][key]['type'] === 'object') {
                this.toolDetails = { data: responseData['responseData'][key] };
                continue;
            }
            this.data.push({ data: responseData['responseData'][key] });
        }
    }

    private setupContactData(responseData:any):void{
        //        console.log(responseData);
        //console.log(responseData);
        this.contact = responseData;
    }


    private propagateData(onFinish:Function):void{
        this.lastQueryContainedResults = this.tools.data !== undefined &&  this.tools.data.data.length !== 0;
        this.navigationDataInfo = new BehaviorSubject<any>(null);
        this.navigationDataInfo.next(this.navigationData);
        this.dataInfo.next(this.data);
        this.toolsInfo.next(this.tools);
        this.queryDataInfo.next(this.searchFields);
        this.sortOptionsInfo.next(this.sortOptions);
        this.totalAmountOfResults = this.navigationData?.allResultsSize;
        this.totalAmountOfResultsInfo.next(this.totalAmountOfResults);
        onFinish();
    }

    private propagateToolDetailData(onFinish:Function):void{
       // console.log(this.toolDetails);
        this.dataInfo.next(this.data);
        this.toolDetailsInfo.next(this.toolDetails);
        onFinish();
    }

    private propagateContactData(onFinish:Function):void{
        // console.log(this.toolDetails);
         this.contactInfo.next(this.contact);
         if(onFinish !== null){
             onFinish();
         }
     }


    public searchTerm(body:any, onFinish: Function): void {
        let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
            this.configData['port'], this.configData['search_term_data_service']);

        this.data = [];
        url += "?size="+this.currentAmountOfResults;
        this.http.post(url,body).subscribe(data => {
            let responseData: any = data;
            this.setupData(responseData);
            this.propagateData(onFinish);
        });
    }

    public fetchDataWithParameters(parameters: any, body:any, onFinish: Function): void {
        let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
            this.configData['port'], this.configData['get_tool_data_service']);

        let parametersString: string = this.constructParametersString(parameters);

        url = url + (parametersString === "" ? "" : "?") + parametersString;
        this.http.post(url,body).subscribe(data => {
            this.initialize();
            let responseData: any = data;
            //console.log(responseData);
            this.setupData(responseData);
            this.propagateData(onFinish);
        });
    }


    public fetchToolDetails(parameters: any, onFinish: Function, onEmpty:Function): void {
       // console.log(this.configData)
        let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
            this.configData['port'], this.configData['get_tool_details']);

        let parametersString: string = this.constructParametersString(parameters);

        url = url + (parametersString === "" ? "" : "?") + parametersString;

        this.http.get(url).subscribe(data => {
            this.initialize();
            let responseData: any = data;
            if(responseData.responseData && responseData.responseData.length === 0){
                if(onEmpty){
                    onEmpty();
                    return;
                }
            }
            this.setupToolDetailsData(responseData);
            this.propagateToolDetailData(onFinish);
        });
    }

    public fetchCountryTools(parameters: any, onFinish: Function): void {
         let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
             this.configData['port'], this.configData['get_country_tools']);

         let parametersString: string = this.constructParametersString(parameters);

         url = url + (parametersString === "" ? "" : "?") + parametersString;

         this.http.get(url).subscribe(data => {
             this.initialize();
             let responseData: any = data;
             //console.log(responseData);
             onFinish(responseData);
/*             this.setupToolDetailsData(responseData);
             this.propagateToolDetailData(onFinish);*/
         });
     }

    public fetchContactForms( onFinish: Function): void {
        // console.log(this.configData)
         let url: string = this.getUrl(this.configData['protocol'], this.configData['host'],
             this.configData['port'], this.configData['contact_service']);

             this.http.get(url).subscribe(data => {
             this.initialize();
             let responseData: any = data;
             //console.log(responseData);
             this.setupContactData(responseData);
             this.propagateContactData(onFinish);
         });
     }

     public performPostCall(endpoint:string, params:any, onFinish: Function, returnWholeDataResponse = false,_url = ""):void{
        let isAuthCall = false;

        if(params['token'] !== undefined){
             isAuthCall = true;
        }
        let url:string = _url === "" ? this.getUrl(this.configData['protocol'], this.configData['host'],
         this.configData['port'], endpoint) : _url;

/*        console.log("Post call "+url);
        console.log(params);*/
         this.http.post(url, params).subscribe(data =>{
             let response:any = data;
             let res:boolean = false;
             if(response.result !== undefined){
                res = response.result;
             }

             if(response.responseData && response.responseData.length === 1){
                 let r = response.responseData;
                 if(r[0].data !== undefined && r[0].data === false && r[0]. description !== undefined && r[0].description === "User token has expired"){
                  // we need to redirect to sign in component
                    this.router.navigateByUrl(environment.env.signIn.link);
                    return;
                }
            }

             if(onFinish !== null){
                if(returnWholeDataResponse == true){
                    onFinish(data);
                }
                else{
                    onFinish(res);
                }
            }
         });
     }

     public performGetCall(endpoint:string, params:any, onFinish: Function, returnWholeDataResponse = false,_url = ""):void{

        let url:string = _url === "" ? this.getUrl(this.configData['protocol'], this.configData['host'],
         this.configData['port'], endpoint) : _url;

/*        console.log("Post call "+url);
        console.log(params);*/
        //console.log(url);
         this.http.get(url, params).subscribe(data =>{
             let response:any = data;
             let res:boolean = false;
             if(response.result !== undefined){
                res = response.result;
             }

             if(onFinish !== null){
                if(returnWholeDataResponse == true){
                    onFinish(data);
                }
                else{
                    onFinish(res);
                }
            }
         });
     }

     public dtUrlClicked(payload:{toolId:number, url:string}, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.dt_url_click);

        this.performPostCall("", payload, onFinish, true, url);
    }

    public getToolSuggestionDataForm(token:string, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_tool_suggestion_data);

        this.performPostCall("", token, onFinish, true, url);
    }

    public getDigitalToolDataForm(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_digital_tool);

        this.performPostCall("", params, onFinish, true, url);
    }

    public getSuggestedDigitalTools(token:string, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_suggested_digital_tools);

        this.performPostCall("", token, onFinish, true, url);
    }

    public getAllSuggestedDigitalTools(token:string, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_all_suggested_digital_tools);

        this.performPostCall("", token, onFinish, true, url);
    }

    public suggestDigitalTool(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.suggest_digital_tool);

        this.performPostCall("", params, onFinish, true, url);
    }

    public updateDigitalToolSuggestion(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.update_digital_tool_suggestion);

        this.performPostCall("", params, onFinish, true, url);
    }

    public updateDigitalTool(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.update_digital_tool);

        this.performPostCall("", params, onFinish, true, url);
    }


    public deleteSuggestedDigitalTool(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.delete_suggested_digital_tool);

        this.performPostCall("", params, onFinish, true, url);
    }

    public deleteStoredDigitalTool(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.delete_stored_digital_tool);

        this.performPostCall("", params, onFinish, true, url);
    }

    public getUserProfile(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_user_profile);

        this.performPostCall("", params, onFinish, true, url);
    }

    public requestUserProfile(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.request_user_profile);

        this.performPostCall("", params, onFinish, true, url);
    }

    public requestUpdateUserProfile(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.request_update_user_profile);

        this.performPostCall("", params, onFinish, true, url);
    }

    public getUsers(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_users);

        this.performPostCall("", params, onFinish, true, url);
    }

    public updateUserProfile(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.update_user_profile);

        this.performPostCall("", params, onFinish, true, url);
    }

    public requestUserActivation(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.request_user_activation);

        this.performPostCall("", params, onFinish, true, url);
    }

    //rollbackSuggestedDigitalTool
/*    public rollbackSuggestedDigitalTool(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.rollback_suggested_digital_tool);

        this.performPostCall("", params, onFinish, true, url);
    }
*/
    public getSuggestedTool(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_suggested_tool);

        this.performPostCall("", params, onFinish, true, url);
    }

    public commitSuggestedTool(params:any, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.commit_suggested_tool);

        this.performPostCall("", params, onFinish, true, url);
    }

    public getPreparedURL(endpoint:string){
        return this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], endpoint);
    }


    public getToolKeywords(interactiveEndpoint:string, input:string, token:string, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], interactiveEndpoint);

        this.performPostCall("", {input:input, token:token}, onFinish, true, url);
    }

    public getSupportedAuthProviders(onFinish:Function){
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_auth_providers);

        this.performGetCall("", {}, onFinish, true, url);
    }

    public getToolsOnBasicView(params:any, onFinish:Function,from:any):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.digital_tool_management_get_tools+"?from="+from);

        this.performPostCall("", params, onFinish, true, url);
    }

    public getUserBackgroundOptions(onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.get_user_background_options);

        this.performGetCall("", {}, onFinish, true, url);
    }

    public registerUserBackgroundOption(id:number, onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.register_user_background_selection+"/"+id);

        this.performPostCall("", {}, onFinish, true, url);
    }

    public userClientIsKnown(onFinish:Function):void{
        let url:string = this.getUrl(this.configData['protocol'], this.configData['host'],
        this.configData['port'], environment.env.backend.user_client_is_known);

        this.performGetCall("", {}, onFinish, true, url);
    }


    private constructParametersString(params: any): string {
        let paramStrings: any = [];
        for (let key in params) {
            //console.log("key = "+key+" values = "+params[key]);
            let values: any = params[key];
           // console.log(params);
            if (values.length === 0) continue;
           // console.log(values);
           if(values.join !== undefined){
               paramStrings.push(key + "=" + values.join("+"));
           }
           else{
            paramStrings.push(key + "=" + values);
           }
        }
//        console.log(paramStrings);
        return paramStrings.join("&")+"&size="+this.currentAmountOfResults+"&sortingOption="+this.sortingOption;
    }

    public setAmountOfResults(newAmount:number):void{
        this.currentAmountOfResults = newAmount;
    }

    public setSortingOption(option:number):void{
        this.sortingOption = option;
    }

    public getData(): Observable<any> {
        return this.dataInfo.asObservable();
    }

    public getTools(): Observable<any> {
        return this.toolsInfo.asObservable();
    }

    public getQueryData(): Observable<any> {
        return this.queryDataInfo.asObservable();
    }


    public getNavigation(): Observable<any> {
        return this.navigationDataInfo.asObservable();
    }

    public getSorting(): Observable<any> {
        return this.sortOptionsInfo.asObservable();
    }

    public getToolDetails(): Observable<any> {
        return this.toolDetailsInfo.asObservable();
    }

    public isInitialized(): Observable<boolean> {
        return this.initializationInfo.asObservable();
    }

    public getConfigData():any{
        return this.configData;
    }

    public getTotalAmountOfResults():Observable<number>{
        return this.totalAmountOfResultsInfo.asObservable();
    }

    public getContactForms():Observable<any>{
        return this.contactInfo.asObservable();
    }

}
