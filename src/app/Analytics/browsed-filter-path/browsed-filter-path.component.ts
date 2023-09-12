import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';
import {HorizontalBarchart} from '../../Visualize/horizontal-barchart';

@Component({
  selector: 'app-browsed-filter-path',
  templateUrl: './browsed-filter-path.component.html',
  styleUrls: ['../analytics.component.css', './browsed-filter-path.component.sass']
})
export class BrowsedFilterPathComponent implements OnInit {

  private configKey = 'analytics';
  private configKey2 = 'browsed_filter_path';
  private config: any;
  public chartId = 'browsed_filter_path';
  public pageData: any;
  public data: any;
  public title: any;
  public description: any;
  public horizontalBarchart: any;
  public chartReady = false;
  public currentIndex = 'Digital Technologies';
  public indexes = ['Digital Technologies', 'Human Tool Interactions', 'Physical Digital Connections'];
  public indexesDict: {[index: string]: any} = {
    'Digital Technologies': 'digitalTechnologies',
    'Human Tool Interactions': 'humanToolInteractions',
    'Physical Digital Connections': 'physicalDigitalConnections'
  };

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

      const indexName = this.indexesDict[this.currentIndex];

      this.analyticsService.getBrowsedFilterPath({indexName}).subscribe((response) => {
        this.data = response.data;
        this.title = response.title;
        this.description = response.description;

        // Create barchart
        this.chartReady = true;

      });
    });
  }

  // When id is ready and #chart component is rendered, draw chart
  @ViewChild('chart', {static: false}) set chart(chart: ElementRef) {
    if (chart) { // initially setter gets called with undefined
      // Create barchart
      this.horizontalBarchart = new HorizontalBarchart(this.chartId, this.config, this.data);
      this.horizontalBarchart.draw();
    }
  }

  filter(currentIndex: string): void {
    this.currentIndex = currentIndex;
    const indexName = this.indexesDict[currentIndex];

    this.analyticsService.getBrowsedFilterPath({indexName}).subscribe(response => {
      this.data = response.data;
      // Recreate barchart
      this.horizontalBarchart = new HorizontalBarchart(this.chartId, this.config, this.data);
      this.horizontalBarchart.draw();
    });
  }

}
