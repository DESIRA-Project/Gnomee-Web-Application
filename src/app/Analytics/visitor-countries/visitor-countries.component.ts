import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';
import {Geomap, Mode} from '../../Visualize/geomap';

@Component({
  selector: 'app-visitor-countries',
  templateUrl: './visitor-countries.component.html',
  styleUrls: ['./visitor-countries.component.sass']
})
export class VisitorCountriesComponent implements OnInit {

  private configKey = 'analytics';
  private configKey2 = 'visitor_countries';
  private config: any;
  public chartId = 'visitor_countries';
  public pageData: any;
  public data: any;
  public title: any;
  public description: any;
  public geomap: any;
  public chartReady = false;

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

      this.analyticsService.getVisitorCountries().subscribe((response) => {
        this.title = response.title;
        this.description = response.description;

        this.data = response.data;

        // Create barchart
        this.chartReady = true;

      });
    });
  }

  // When id is ready and #chart component is rendered, draw chart
  @ViewChild('chart', {static: false}) set chart(chart: ElementRef) {
    if (chart) { // initially setter gets called with undefined
      this.geomap = new Geomap(this.config, {data: this.data}, this.chartId, Mode.AnalyticsVisitorCountries);
      this.geomap.draw();
    }
  }

}
