import { Component, OnInit } from '@angular/core';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';
import {Bubblechart} from '../../Visualize/bubblechart';



@Component({
  selector: 'app-search-terms',
  templateUrl: './search-terms.component.html',
  styleUrls: ['./search-terms.component.css']
})
export class SearchTermsComponent implements OnInit {

  private configKey = 'analytics';
  private configKey2 = 'search_terms';
  private config: any;
  public chartId = 'search_terms';
  public pageData: any;
  public searchTerms: any;
  public title: any;
  public description: any;

  constructor(private configService: PageConfigService,
              private analyticsService: AnalyticsService) { }


  ngOnInit(): void {
    // Get 'analytics' config data
    this.configService.getConfigData().subscribe((value) => {
      if (value === null) {
        return;
      }
      if (this.configKey in value) {
        this.pageData = value[this.configKey];
        this.config = this.pageData[this.configKey2];
      }

      this.analyticsService.getSearchTerms().subscribe((response) => {
        this.searchTerms = response.data;
        this.title = response.title;
        this.description = response.description;

        const bubblechart = new Bubblechart({id: this.chartId}, {data: this.searchTerms});
        bubblechart.draw();
      });
    });
  }
}
