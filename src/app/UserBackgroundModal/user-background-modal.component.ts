import { Component, ViewChild } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { BackendService } from "../backend.service";
import { KBTCookieService } from "../CookieBanner/cookie-service.component";

@Component({
    selector: 'user-background-modal',
    templateUrl: './user-background-modal.component.html',
    //    styleUrls:["../style/gnomee.css"]
    styleUrls: ['../style/cookie-banner.css'],
})
export class UserBackgroundModal {
    @ViewChild("userBackgroundFeedbackContent") userBackgroundFeedbackContent: any;
    useUserFeedbackModal: boolean = false;
    isUserBackgroundModalClosed: boolean = false;
    data: any = [];
    options: any = null;
    _modal: NgbModalRef = {} as NgbModalRef;
    sentences: SafeHtml[] = []
    initialized = false;
    triggerModal = false;
    defaultCookieSkipIntervalDays = environment.env.userFeedbackModal.defaultCookieSkipIntervalDays;
    cookieName = environment.env.userFeedbackModal.name;
    text: string = "";
    title: string = "";
    selection: any = null;
    onSubmit: boolean = false;
    resultReceived: boolean = false;

    static readonly userBackgroundModalKey = "userBackgroundModalOpen";
    static readonly userHasFilledBackgroundKey = "userIsKnown";

    static readonly onSubmitResponseClose:number = 3000;


    constructor(private service: KBTCookieService,
        private modalService: NgbModal,
        private sanitizer: DomSanitizer,
        private backend: BackendService) {

        this.text = environment.env.userFeedbackModal.text;
        this.title = environment.env.userFeedbackModal.title;
        let inst = this;


        inst.service.isInitialized().subscribe((value) => {
            if (value !== true) {
                return;
            }
            inst.data = this.service.getData();
            inst.userBackgroundModalSetup();
            inst.initialized = true;
        });

    }

    public closeModal() {
        this._modal.close();
    }

    private loadUserBackgroundOptions() {
        let inst = this;
        this.backend.getUserBackgroundOptions((data: any) => {
            if (data && data.responseData) {
                if (data.responseData) {
                    inst.options = data.responseData[0];
                    /*if (inst.options && inst.options.length > 0) {
                        inst.selection = inst.options[0];
                    }*/
                }
            }
        });
    }


    private handleCookie(o:any){
        if(!o){
            this.triggerModal = true;
            return;
        }
        o = JSON.parse(o);
        //maybe expired??
        let d = o.d;
        let expirationDays = o.expirationDays;
        let filled = o.filled;
        if (filled === true) {
            //we got the answer from the user
            return;
        }
        else {
            /*console.log(expirationDays);
            console.log(o.expirationDays);*/

            //fill it again
            if (expirationDays === undefined || d === undefined) {
                this.triggerModal = true;
                return;
            }

            let now = new Date();
            //              Testing!
            //              now.setDate(now.getDate() + 1000);
            if (!expirationDays) {
                //it expires immediately
                this.triggerModal = true;
                return;
            }

            let expiration = new Date();
            expiration.setDate(new Date(d).getDate() + expirationDays);

            if (now.getTime() > expiration.getTime()) {
                //it expired, we need to show the modal again
                this.triggerModal = true;
                return;
            }
        }
    }
    private userBackgroundModalSetup() {
        this.useUserFeedbackModal = environment.env.userFeedbackModal.use;
        if (this.useUserFeedbackModal) {
            let o = this.service.getCookieObject(this.cookieName);
            let userHasFilledBackground = localStorage.getItem(UserBackgroundModal.userHasFilledBackgroundKey);
            
            //user havent picked a background but there is a cookie
            if(userHasFilledBackground === "false" && o){
                o = JSON.parse(o);
                o.filled = false;
                o = JSON.stringify(o);
                this.handleCookie(o);
                return;
            }
            //user havent picked a background and there is no cookie
            else if(userHasFilledBackground === "false" && !o){
                this.triggerModal = true;
                return;
            }
            //user has picked a background and there is a cookie
            else if(userHasFilledBackground === "true" && o){
                //nothing to do, because he had filled it
                return;
            }
            //user has picked a background and there is no cookie
            else if(userHasFilledBackground === "true" && !o){
                //restore the cookie
                this.storeFillCookie();
                return;
            }            
        }
    }

    ngAfterViewInit() {
        //console.log("ng after view init")
        if (this.triggerModal) {            
            this.openUserBackgroundFeedbackModal();
        }
    }

    storeSkipCookie() {
        this.service.storeCookieObject(this.cookieName, JSON.stringify({ filled: false, d: new Date(), expirationDays: this.defaultCookieSkipIntervalDays }));
    }

    storeFillCookie() {
        this.service.storeCookieObject(this.cookieName, JSON.stringify({ filled: true, d: new Date(), expirationDays: this.defaultCookieSkipIntervalDays }));
    }

    openUserBackgroundFeedbackModal() {
        // this.mode = 0;    
        this._modal = this.modalService.open(this.userBackgroundFeedbackContent);
        this.isUserBackgroundModalClosed = false;
        this.loadUserBackgroundOptions();
        localStorage.setItem(UserBackgroundModal.userBackgroundModalKey, "true");

        const parentRef = this;
        this._modal.result.then(function () {
            //Get triggers when modal is closed
            //parentRef._parent.setToggleFilterModal(false);
            parentRef.isUserBackgroundModalClosed = true;

            localStorage.removeItem(UserBackgroundModal.userBackgroundModalKey);
            parentRef.triggerModal = false;

            //click X
            if(parentRef.resultReceived !== true && parentRef.onSubmit !== true){
                parentRef.storeSkipCookie();
            }
        }, function () {

            //clicked outside the modal
            parentRef.storeSkipCookie();
            localStorage.removeItem(UserBackgroundModal.userBackgroundModalKey);
            parentRef.triggerModal = false;
            parentRef.isUserBackgroundModalClosed = true;

        })
    }

    selectOption(i: number) {
        if (this.options && i >= 0 && i < this.options.length) {
            this.selection = this.options[i];
        }
    }

    public saveUserBackground() {
        if (this.selection !== null) {
            let inst = this;
            let id: number = this.selection.id;
            this.onSubmit = true;
            this.backend.registerUserBackgroundOption(id, () => {
                inst.resultReceived = true;
                inst.storeFillCookie();

                setTimeout(() => {
                    inst.closeModal();
                    inst.triggerModal = false;
                    inst.isUserBackgroundModalClosed = true;

                }, UserBackgroundModal.onSubmitResponseClose);
            });
        }
    }

}