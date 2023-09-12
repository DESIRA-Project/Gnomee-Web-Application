/* Based on: https://observablehq.com/@d3/force-directed-graph */

import * as d3 from 'd3';
import {Router} from '@angular/router';

export class ForceDirectedGraph {

  private graphId: any;
  private readonly nodes: any;
  private readonly links: any;
  private readonly nodesDict: any;
  private readonly config: any;
  private router: Router;

  constructor(graphId: any, nodes: any, links: any, config: any, router: Router) {
    this.graphId = graphId;
    this.nodes = nodes;
    this.links = links;
    this.config = config;
    this.router = router;

    this.nodesDict = {};
    for (const node of this.nodes) {
      this.nodesDict[node.id] = node;
    }
  }

  draw({
         // @ts-ignore
         nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
         nodeChildren,  // function that for a given node n, returns a list with the ids of its children
         nodeGroup, // given d in nodes, returns an (ordinal) value for color
         nodeGroups, // an array of ordinal values representing the node groups
         nodeGroupTitles, // an array of group titles for legend
         nodeTitle, // given d in nodes, a title string
         nodeFill = 'currentColor', // node stroke fill (if not using a group color encoding)
         nodeStroke = '#fff', // node stroke color
         nodeStrokeWidth = 2.0, // node stroke width, in pixels
         nodeStrokeOpacity = 1, // node stroke opacity
         nodeRadius = 20, // node radius, in pixels
         nodeOpacity = 1,
         nodeStrength,
         nodeText,    // given d in nodes, returns node text
         nodeTextFontSize,    // given d in nodes, returns node text font size
         nodeShowTooltip = false, // given d in nodes, returns if it should show tooltip on hover
         nodeLink,      // function that for each node, returns the link it should redirect to on click
         // @ts-ignore
         linkSource = ({source}) => source, // given d in links, returns a node identifier string
         // @ts-ignore
         linkTarget = ({target}) => target, // given d in links, returns a node identifier string
         linkStroke = '#999', // link stroke color
         linkStrokeOpacity = 0.6, // link stroke opacity
         linkStrokeWidth = 2.0, // given d in links, returns a stroke width in pixels
         linkStrokeLinecap = 'round', // link stroke linecap
         linkStrength,
         colors = d3.schemeTableau10, // an array of color strings, for the node groups
         width = 640, // outer width, in pixels
         height = 400, // outer height, in pixels
         invalidation, // when this promise resolves, stop the simulation
         decayParameter = 175
       }: any = {}): any {

    let nodes = this.nodes;
    let links = this.links;

    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    // @ts-ignore
    if (nodeTitle === undefined) { nodeTitle = (_, i) => N[i]; }
    const NODE_TITLE = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const NODE_CHILDREN = nodeChildren == null ? null : d3.map(nodes, nodeChildren);
    const NODE_GROUP = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const NODE_RADIUS = typeof nodeRadius !== 'function' ? null : d3.map(nodes, nodeRadius);
    const NODE_OPACITY = typeof nodeOpacity !== 'function' ? null : d3.map(nodes, nodeOpacity);
    const NODE_TEXT = typeof nodeText !== 'function' ? null : d3.map(nodes, nodeText);
    const NODE_FONT_SIZE = typeof nodeTextFontSize !== 'function' ? null : d3.map(nodes, nodeTextFontSize);
    const NODE_SHOW_TOOLTIP = typeof nodeShowTooltip !== 'function' ? null : d3.map(nodes, nodeShowTooltip);
    const NODE_LINK = d3.map(nodes, nodeLink);
    const LINK_STROKE_WIDTH = typeof linkStrokeWidth !== 'function' ? null : d3.map(links, linkStrokeWidth);
    const LINK_STROKE_OPACITY = typeof linkStrokeOpacity !== 'function' ? null : d3.map(links, linkStrokeOpacity);
    const LINK_STROKE = typeof linkStroke !== 'function' ? null : d3.map(links, linkStroke);

    // Find unique groups, and store then in 'groups', sorted
    let groups: any;
    if (nodeGroup) {
      groups = Array.from(new Set<any>(NODE_GROUP).values()).sort();
    }

    // Calculate how many nodes each group has
    const groupCount: any = {};
    if (nodeGroup) {
      NODE_GROUP?.forEach(value => groupCount[value] = groupCount[value] ? groupCount[value] + 1 : 1);
    }

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

    // Compute default domains.
    if (NODE_GROUP && nodeGroups === undefined) { nodeGroups = d3.sort(NODE_GROUP); }

    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    // @ts-ignore
    const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) { forceNode.strength(nodeStrength); }
    if (linkStrength !== undefined) { forceLink.strength(linkStrength); }


    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', forceLink)
      .force('charge', forceNode)
      .force('center',  d3.forceCenter())
      .on('tick', ticked)
      .alphaDecay(1 - Math.pow(0.001, 1 / decayParameter))
      .alphaMin(0.01);


    // Create svg under given figure id
    const svg = d3.select('figure#' + this.graphId)
      .append('svg')
      // @ts-ignore
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');


    //
    // Zoom related stuff
    //

    // Append graph elements under this group
    const graph = svg.append('g');

    const zoomInFactor = 5 / 4.0;
    const zoomOutFactor = 1 / zoomInFactor;

    const zoomed = d3.zoom()
      .scaleExtent([Math.pow(zoomOutFactor, 2), Math.pow(zoomInFactor, 3)])
      .on('zoom', event => {
        graph.selectAll('g').attr('transform', event.transform);
        tooltip.attr('transform', event.transform);

        // This line prevents zoom from breaking
        simulation.alpha(simulation.alphaMin()).restart();
      });

    function zoomIn(): void {
      d3.select('svg')
        .transition()
        // @ts-ignore
        .call(zoomed.scaleBy, zoomInFactor);
    }

    function zoomOut(): void {
      d3.select('svg')
        .transition()
        // @ts-ignore
        .call(zoomed.scaleBy, zoomOutFactor);
    }

    const zoomButtonWidth = 64;
    const zoomButtonHeight = 64;
    const zoomButtonRX = 3;
    const zoomButtonRY = 3;
    const zoomInButtonX = -width / 2.0 + 30;
    const zoomInButtonY = -height / 2.0 + 120;
    const yDistanceBetweenButtons = 0;
    const zoomOutButtonX = zoomInButtonX;
    const zoomOutButtonY = zoomInButtonY + zoomButtonHeight + yDistanceBetweenButtons;

    const zoomInButton = svg.append('g')
      .on('mouseenter', () => zoomInRect.attr('fill', '#cbcbcb'))
      .on('mouseleave', () => zoomInRect.attr('fill', '#f7f7f7'))
      .on('click', () => zoomIn())
    ;

    const zoomInRect = zoomInButton.append('rect')
      .attr('fill', '#f7f7f7')
      .attr('stroke-width', 1)
      .attr('stroke', '#cccccc')
      .attr('x', zoomInButtonX)
      .attr('y', zoomInButtonY)
      .attr('rx', zoomButtonRX)
      .attr('ry', zoomButtonRY)
      .attr('width', zoomButtonWidth)
      .attr('height', zoomButtonHeight)
      .attr('cursor', 'pointer')
    ;

    zoomInButton.append('text')
      .attr('x', zoomInButtonX + zoomButtonWidth / 2.0)
      .attr('y', zoomInButtonY + zoomButtonHeight / 2.0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 35)
      /*.attr('opacity', 0.75)*/
      .attr('cursor', 'pointer')
      .attr('font-weight', 'bold')
      .text('+')
    ;


    const zoomOutButton = svg.append('g')
      .on('mouseenter', () => zoomOutRect.attr('fill', '#cbcbcb'))
      .on('mouseleave', () => zoomOutRect.attr('fill', '#f7f7f7'))
      .on('click', () => zoomOut())
    ;

    const zoomOutRect = zoomOutButton.append('rect')
      .attr('fill', '#f7f7f7')
      .attr('stroke-width', 1)
      .attr('stroke', '#cccccc')
      .attr('x', zoomOutButtonX)
      .attr('y', zoomOutButtonY)
      .attr('rx', zoomButtonRX)
      .attr('ry', zoomButtonRY)
      .attr('width', zoomButtonWidth)
      .attr('height', zoomButtonHeight)
      .attr('cursor', 'pointer')
    ;

    zoomOutButton.append('text')
      .attr('x', zoomOutButtonX + zoomButtonWidth / 2.0)
      .attr('y', zoomOutButtonY + zoomButtonHeight / 2.0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 35)
      /*.attr('opacity', 0.75)*/
      .attr('cursor', 'pointer')
      .attr('font-weight', 'bold')
      .text('-')
    ;

    // @ts-ignore
    svg.call(zoomed);


    // Create edges
    const link = graph.append('g')
      .attr('stroke', typeof linkStroke !== 'function' ? linkStroke : null)
      .attr('stroke-opacity', typeof linkStrokeOpacity !== 'function' ? linkStrokeOpacity : null)
      .attr('stroke-width', typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : null)
      .attr('stroke-linecap', linkStrokeLinecap)
      .selectAll('line')
      .data(links)
      .join('line');


    // This variable is used for better performance
    // in order to NOT call the nodeOnMouseover and nodeOnMouseout function while dragging nodes
    let dragging = false;

    // Provide behavior for hovering on node
    const nodeOnMouseover = (_: any, d: any) => {

      // Do not alter anything if the user is currently dragging a node
      if (dragging) {
        return;
      }

      // If node is a leaf node, make its title appear
      if (NODE_TITLE && NODE_SHOW_TOOLTIP && NODE_SHOW_TOOLTIP[d.index]) {
        tooltip
          .text(String(NODE_TITLE[d.index]))
          .attr('x', d.x - 10)
          .attr('y', d.y - 10)
          .attr('visibility', 'visible')
          .attr('opacity', 1)
        ;
      }

      // Highlight children and ancestor nodes
      const highlightedNodes: Set<string> = new Set();

      // Highlight self
      highlightedNodes.add(d.id);

      // Highlight children Nodes
      let childrenNodes: any = [];
      if (NODE_CHILDREN) {
        childrenNodes = NODE_CHILDREN[d.index];
      }
      else {
        childrenNodes = this.getChildrenNodes(d.id);
      }

      for (const child of childrenNodes) {
        highlightedNodes.add(child);
      }

      // Highlight ancestor nodes
      this.getAncestorNodes(this.nodesDict[d.id].parentIds, highlightedNodes);

      // Make it happen
      node.attr('opacity', (dd: any) => highlightedNodes.has(dd.id) ? 1 : 0.25);
      link.attr('opacity', (dd: any) => highlightedNodes.has(dd.source.id) && highlightedNodes.has(dd.target.id) ? 1 : 0.25);
    };


    // Provide behavior for hovering out node
    const nodeOnMouseOut = () => {

      // Hide tooltip
      tooltip.attr('opacity', 0).attr('visibility', 'hidden');

      // Do not alter anything if the user is currently dragging a node
      if (dragging) {
        return;
      }

      // Restore node opacity
      // @ts-ignore
      if (NODE_OPACITY) { node.attr('opacity', ({index: i}) => NODE_OPACITY[i]); }
      else { node.attr('opacity', nodeOpacity); }

      // Restore link opacity
      // @ts-ignore
      if (LINK_STROKE_OPACITY) { link.attr('opacity', ({index: i}) => LINK_STROKE_OPACITY[i]); }
      else { link.attr('opacity', linkStrokeOpacity); }
    };


    // Provide behavior for clicking on node
    const nodeOnClick = (_: any, d: any) => {

      // Open link in new window
      if (NODE_LINK) {
        window.open(String(NODE_LINK[d.index]), '_blank');
      }
    };


    // Create node groups
    const node = graph.append('g')
      .attr('fill', nodeFill)
      .attr('stroke', nodeStroke)
      .attr('stroke-opacity', nodeStrokeOpacity)
      .attr('stroke-width', nodeStrokeWidth)
      .attr('cursor', 'default')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .on('mouseenter', nodeOnMouseover)
      .on('mouseleave', nodeOnMouseOut)
      .on('click', nodeOnClick)
      .call(drag(simulation));


    // Create common tooltip properties for tools with initially hidden text
    const tooltip = graph.append('text')
      .attr('visibility', 'hidden')
      .attr('opacity', 0)
      .attr('stroke', 'white')
      .attr('stroke-width', 0.2)
      .attr('fill', 'black')
      .attr('font-size', 22)
      .attr('cursor', 'default')
    ;

    // Create circles
    const circle =  node.append('circle')
      .attr('r', typeof nodeRadius !== 'function' ? nodeRadius : null)
    ;


    // Add optional attributes to elements

    // @ts-ignore
    if (LINK_STROKE_WIDTH) { link.attr('stroke-width', ({index: i}) => LINK_STROKE_WIDTH[i]); }
    // @ts-ignore
    if (LINK_STROKE) { link.attr('stroke', ({index: i}) => LINK_STROKE[i]); }
    // @ts-ignore
    if (LINK_STROKE_OPACITY) { link.attr('opacity', ({index: i}) => LINK_STROKE_OPACITY[i]); }
    // @ts-ignore
    if (NODE_GROUP) { node.attr('fill', ({index: i}) => color(NODE_GROUP[i])); }
    // @ts-ignore
    if (NODE_RADIUS) { circle.attr('r', ({index: i}) => NODE_RADIUS[i]); }
    // @ts-ignore
    if (NODE_OPACITY) { node.attr('opacity', ({index: i}) => NODE_OPACITY[i]); }

    if (NODE_TEXT) {

      // @ts-ignore
      const text = node.append('text').text(({index: i}) => NODE_TEXT[i])
        .attr('stroke', 'white')
        .attr('stroke-width', 0.2)
        .style('fill', 'black');

      // @ts-ignore
      if (NODE_FONT_SIZE) { text.style('font-size', ({index: i}) => NODE_FONT_SIZE[i]); }
    }

    if (invalidation != null) { invalidation.then(() => simulation.stop()); }


    //
    // Legend
    //
    if (NODE_GROUP && color) {

      const legend = svg.append('g');

      let legendCurrentX: number;
      const legendCurrentY = -height / 2 + 50;
      const legendOffsetsX = [];
      const legendEntries = [];

      for (let i = 0; i < groups.length; i++) {

        // Create group for both circle and text
        const id = 'legend_id_' + i;
        const legendEntry = legend.append('g')
          .attr('id', id)

          // On mouseover highlight current group and all corresponding nodes
          .on('mouseover', (event) => {
            legend.selectAll('g').attr('opacity', 0.25);
            legend.select('#legend_id_' + i).attr('opacity', 1);
            node.attr('opacity', (dd: any) => NODE_GROUP[dd.index] === i ? 1 : 0.25);
            link.attr('opacity', (dd: any) => 0.25);
          })

          // On mouseover reset opacity of all groups and nodes
          .on('mouseout', (event) => {
            legend.selectAll('g').attr('opacity', 1);

            // Restore node opacity
            // @ts-ignore
            if (NODE_OPACITY) { node.attr('opacity', ({index: i}) => NODE_OPACITY[i]); }
            else { node.attr('opacity', nodeOpacity); }

            // Restore link opacity
            // @ts-ignore
            if (LINK_STROKE_OPACITY) { link.attr('opacity', ({index: i}) => LINK_STROKE_OPACITY[i]); }
            else { link.attr('opacity', linkStrokeOpacity); }
          })
        ;

        // Keep each legend group for specifying its position later
        legendEntries.push(legendEntry);

        // Properties for each legend circle
        const legendCircle = legendEntry.append('circle')
          .attr('id', 'legend_circle_id_' + i)
          .attr('r', 17)
          // @ts-ignore
          .attr('fill', color(i))
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
        ;

        // Properties for each legend text
        const legendText = legendEntry.append('text')
          .attr('id', 'legend_text_id_' + i)
          .attr('x', 30)
          .text(nodeGroupTitles[i] + ' (' + groupCount[i] + ')')
          .attr('font-size', '33px')
          .attr('dominant-baseline', 'central')
          .attr('cursor', 'default')
        ;

        // Calculate the width of each text element
        const textNode: SVGTSpanElement = legendText.node() as SVGTSpanElement;

        // And store it in 'legendOffsetsX'
        legendOffsetsX.push(textNode.getComputedTextLength() + 100);
      }

      //
      // Now we know how much space all the texts and circles take, so we can center them based on width
      //

      // Compute the sum of all text lengths
      const legendOffsetsSum = legendOffsetsX.reduce((a, b) => a + b, 0);

      // Calculate the remaining space
      const space = width - legendOffsetsSum;

      // Divide it by 2 and use it as an offset for the beginning of the (horizontal) legend
      legendCurrentX = -width / 2.0 + space / 2.0;

      // Actually position each legend entry
      for (let i = 0; i < groups.length; i++) {
        legendEntries[i].attr('transform', 'translate(' + legendCurrentX + ', ' + legendCurrentY + ')');

        // Update current x based on offsets calculated before
        legendCurrentX += legendOffsetsX[i];
      }

      // Done
    }


    function intern(value: any): any {
      return value !== null && typeof value === 'object' ? value.valueOf() : value;
    }

    function ticked(): any {

      link
        // @ts-ignore
        .attr('x1', d => d.source.x)
        // @ts-ignore
        .attr('y1', d => d.source.y)
        // @ts-ignore
        .attr('x2', d => d.target.x)
        // @ts-ignore
        .attr('y2', d => d.target.y);

      // @ts-ignore
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    }

    // @ts-ignore
    function drag(simulation: any): any {
      function dragstarted(event: any): any {
        dragging = true;
        if (!event.active) { simulation.alphaTarget(simulation.alphaMin() * 2).restart(); }
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any): any {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any): any {
        dragging = false;
        if (!event.active) { simulation.alphaTarget(0); }
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    Object.assign(svg.node(), {scales: {color}});
  }


  // Get children nodes of 'parentId' and return them in a string array
  private getChildrenNodes(parentId: string): Array<string> {
    const ret = new Array<string>();
    for (const link of this.links) {
      if (link.idNodeFrom === parentId) {
        ret.push(link.idNodeTo);
      }
    }
    return ret;
  }


  // Provided that each node has a 'parentIds' field,
  // populate 'ancestorNodes' with all ancestors of each node contained in 'parentIds'
  private getAncestorNodes(parentIds: Array<string>, ancestorNodes: Set<string>): void {
    parentIds.forEach( (id) => {
      ancestorNodes.add(id);
      if (id in this.nodesDict) {
        this.getAncestorNodes(this.nodesDict[id].parentIds, ancestorNodes);
      }
    });
  }

}
