import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';
import {ForceDirectedGraph} from '../../Visualize/ForceDirectedGraph';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router} from '@angular/router';
import {getContainingStatement} from '@angular/compiler-cli/ngcc/src/host/esm2015_host';

@Component({
  selector: 'app-tool-relation-graph',
  templateUrl: './tool-relation-graph.component.html',
  styleUrls: ['../analytics.component.css', './tool-relation-graph.component.sass']
})
export class ToolRelationGraphComponent implements OnInit {

  private configKey = 'analytics';
  private configKey2 = 'tool_relation_graph';
  public config: any;
  public pageData: any;
  public chartId = 'tool_relation_graph';
  public nodes: any;
  public nodesDict: any = {};
  public edges: any;
  public graph: any;
  public title: any;
  public description: any;
  public dataReady = false;
  public domains = ['Agriculture', 'Forestry', 'Rural Areas'];
  public currentDomain = this.domains[2];
  public showingDigitalTechnologies = false;

  constructor(private configService: PageConfigService,
              private analyticsService: AnalyticsService,
              private router: Router) {
    this.title = 'Digital Tools Graph Representation';
    this.description = 'Choose the starting point and explore the connections between the different elements by hovering, dragging and clicking on nodes';
  }


  ngOnInit(): void {

    // Get config data from analytics.tool_relation_graph
    this.configService.getConfigData().subscribe((value) => {
      if (value === null) {
        return;
      }
      if (this.configKey in value) {
        this.pageData = value[this.configKey];
        this.config = this.pageData[this.configKey2];
      }

      this.filter(this.currentDomain);
    });
  }


  // Get graph data for specified domain
  filter(domain: string): void {
    this.dataReady = false;
    this.currentDomain = domain;
    this.showingDigitalTechnologies = false;

    const params = {filterById: this.currentDomain};
    this.analyticsService.getToolRelationGraph(params).subscribe((response) => {
      this.nodes = response.nodes;
      this.edges = response.edges;

      // Update dictionary of nodes
      for (const node of this.nodes) {
        this.nodesDict[node.customId] = node;
      }

      // Signal to create barchart
      this.dataReady = true;

    });
  }


  // When id is ready and #chart component is rendered, draw chart
  @ViewChild('chart', {static: false}) set chart(chart: ElementRef) {
    if (chart) { // initially setter gets called with undefined

      // For faster highlighting, pre calculate each node's children
      const nodeChildren: any = {};

      // Create additional node properties based on config
      for (const node of this.nodes) {

        // Node as received from backend has a 'customId' field instead of 'id'.
        // But for simplicity, copy it to a classic 'id' field
        node.id = node.customId;

        node.radius = this.config.radius[node.type];
        node.opacity = this.config.nodeOpacity[node.type];
        node.fontSize = this.config.fontSize[node.type];
        node.name = node.name.length > 30 ? node.name.slice(0, 30) + '...' : node.name;
        node.showTooltip = node.type === 'Tool';
        node.group = this.config.group[node.type];

        // Initialize as empty
        nodeChildren[node.id] = [];
      }

      // Create additional edge properties based on config
      for (const edge of this.edges) {
        edge.width = this.config.edgeWidth[this.nodesDict[edge.idNodeFrom].type];
        edge.opacity = this.config.edgeOpacity[this.nodesDict[edge.idNodeFrom].type];

        // Fill with children ids
        nodeChildren[edge.idNodeFrom].push(edge.idNodeTo);
      }


      // Variable for passing group titles to graph
      let groups: any;
      if (!this.showingDigitalTechnologies) {
        groups = ['Domain', 'Sub Domain', 'Application Scenario', 'Tool'];
      }
      else {
        groups = ['Domain', 'Sub Domain', 'Application Scenario', 'Tool', 'Digital Technology'];
      }

      // Create graph
      this.graph = new ForceDirectedGraph(this.chartId, this.nodes, this.edges, this.config, this.router);

      // Draw graph with appropriate configuration
      this.graph.draw({
        // @ts-ignore
        nodeId: node => node.id,
        // @ts-ignore
        nodeChildren: node => nodeChildren[node.id],
        // @ts-ignore
        nodeGroup: node => node.group,
        nodeGroupTitles: groups,
        // @ts-ignore
        nodeTitle: node => node.name,
        // @ts-ignore
        nodeRadius: node => node.radius,
        // @ts-ignore
        nodeOpacity: node => node.opacity,
        // @ts-ignore
        nodeText: node => node.type !== 'Tool' ? node.name : '',
        // @ts-ignore
        nodeTextFontSize: node => node.fontSize,
        // @ts-ignore
        nodeShowTooltip: node => node.showTooltip,
        // @ts-ignore
        nodeLink: node => node.link,
        // @ts-ignore
        linkSource: edge => edge.idNodeFrom,
        // @ts-ignore
        linkTarget: edge => edge.idNodeTo,
        // @ts-ignore
        linkStrokeWidth: edge => edge.width,
        // @ts-ignore
        linkStrokeOpacity: edge => edge.opacity,
        nodeStrength: this.showingDigitalTechnologies ? this.config.nodeStrengthWithDigitalTechnologies : this.config.nodeStrength,
        linkStrength: this.showingDigitalTechnologies ? this.config.linkStrengthWithDigitalTechnologies : this.config.linkStrength,
        height: this.config.height[this.currentDomain][this.showingDigitalTechnologies ? 'showingDigitalTechnologies' : 'notShowingDigitalTechnologies'],
        width: this.config.width[this.currentDomain],
        decayParameter: this.config.decayParameter[this.showingDigitalTechnologies ? 'showingDigitalTechnologies' : 'notShowingDigitalTechnologies']
      });

    }
  }

  alterDigitalTechnologies(): void {
    if (this.showingDigitalTechnologies) {
      this.hideDigitalTechnologies();
    }
    else {
      this.showDigitalTechnologies();
    }
  }

  showDigitalTechnologies(): void {

    this.dataReady = false;

    // Get digital technologies corresponding to current domain via analytics service
    const params = {digitalTechnologiesByDomain: this.currentDomain};
    this.analyticsService.getToolRelationGraph(params).subscribe((response) => {

      // Concatenate already existing nodes with new ones
      this.nodes = [ ...this.nodes, ...response.nodes];

      // Same thing for edges
      this.edges = [ ...this.edges, ...response.edges];

      // Update dictionary of nodes
      for (const node of this.nodes) {
        this.nodesDict[node.customId] = node;
      }

      // Create barchart
      this.dataReady = true;
    });

    this.showingDigitalTechnologies = true;
  }

  hideDigitalTechnologies(): void {
    this.filter(this.currentDomain);
    this.showingDigitalTechnologies = false;
  }

}
