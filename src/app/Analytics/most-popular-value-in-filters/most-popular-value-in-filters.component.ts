import { Component, OnInit } from '@angular/core';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';

@Component({
  selector: 'app-most-popular-value-in-filters',
  templateUrl: './most-popular-value-in-filters.component.html',
  styleUrls: ['../analytics.component.css', './most-popular-value-in-filters.component.sass']
})
export class MostPopularValueInFiltersComponent implements OnInit {


  private configKey = 'analytics';
  private configKey2 = 'most_popular_value_in_filters';
  public config: any;
  public pageData: any;
  public data: any;
  public title: any;
  public description: any;
  public dataReady = false;

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

      this.analyticsService.getMostPopularValueInFilters().subscribe((response) => {
        this.data = response.data;
        this.title = response.title;
        this.description = response.description;

        // Create barchart
        this.dataReady = true;

      });
    });
  }

}
