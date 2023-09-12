import { Component, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { PageConfigService } from "../pageconfig.service";
import {AnalyticsService} from '../services/analytics.service';
import {AuthService} from '../Auth/auth.service';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls:['../style/landing.css'],
  encapsulation: ViewEncapsulation.None
})

export class LandingComponent {
    public pageData:any = null;
    private configKey:string = "landing_page";
    public searchText:string = "";
    public topTerms: string[] = [];
    public isUserAuthenticated = false;

  constructor(private configService:PageConfigService,
                private router: Router,
                private analyticsService: AnalyticsService,
                private authService: AuthService){
    }

    ngOnInit(){
        this.configService.getConfigData().subscribe((value) => {
            if(value === null){
                return;
            }
            if(this.configKey in value){
                this.pageData = value[this.configKey];
                //console.log(this.pageData);
            }
          this.isUserAuthenticated = this.authService.isAuthenticated();
          this.analyticsService.getTopKSearchTerms().subscribe((terms: string[]) => {
              // Capitalize first letter of each term
              this.topTerms = terms.map(term => {
                let re = /['"]+/gi;
                let t = term.replace(re,'');
                return  t.charAt(0).toUpperCase() + t.slice(1) } 
                );
            })
        });
    }

    onBadgeClick(badgeText: string) {
      this.searchText = badgeText;
      this.performQuery();
    }

    performQuery(){
        this.router.navigate([this.pageData.submit.url], { queryParams: { term: this.searchText }});
    }
}
