import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';
import { KBTCookieService } from './CookieBanner/cookie-service.component';
import { GAService } from './GoogleAnalytics/ga.service';
import { PluginService } from './PluginService/plugin-service.service';
import { UserBackgroundModal } from './UserBackgroundModal/user-background-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  initialized:boolean = false;

  constructor(private router: Router, private service: PluginService, private cookieService: KBTCookieService, private backend:BackendService) { 
    let inst = this;
    localStorage.removeItem(UserBackgroundModal.userHasFilledBackgroundKey);
    this.backend.userClientIsKnown((res:any)=>{
      if(res.value === false){
        localStorage.setItem(UserBackgroundModal.userHasFilledBackgroundKey, "false");
      }
      else{
        localStorage.setItem(UserBackgroundModal.userHasFilledBackgroundKey, "true");
      }
      inst.initialized = true;
    });

  }

  ngOnInit() {
    this.cookieService.isInitialized().subscribe((value)=>{
        if(value !== true){
            return;
        }
        if( this.cookieService.hasAppCookieObject() ){
//            this.pluginServiceSetup();          
            this.service.setupPluginsOnAppInitialization(
              this.cookieService.getData().cookie_modal.cookie_settings,
              this.cookieService.getAppCookieObject());
        }
        else{
        }
    });
  }

  private pluginServiceSetup(){
    this.service.isInitialized().subscribe((value) => {
      if (value !== true) {
        return;
      }
      this.service.injectPluginScript();
    });
  }

 
}