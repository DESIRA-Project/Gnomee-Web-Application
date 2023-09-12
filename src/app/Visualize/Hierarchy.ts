import * as d3 from 'd3';

export class HierarchyChart {

  private id: any;

  constructor(id: any) {
    this.id = id;

  }

  public Tree(data: any, { // data is either tabular (array of objects) or hierarchy (nested objects)
    path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
    id = Array.isArray(data) ? (d: { id: any; }) => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
    // tslint:disable-next-line:max-line-length
    parentId = Array.isArray(data) ? (d: { parentId: any; }) => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
    children, // if hierarchical data, given a d in data, returns its children
    tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
    sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
    label, // given a node d, returns the display name
    title, // given a node d, returns its hover text
    link, // given a node d, its link (if any)
    linkTarget = '_blank', // the target attribute for links (if any)
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    r = 3, // radius of nodes
    padding = 1, // horizontal padding for first and last column
    fill = '#999', // fill for nodes
    fillOpacity, // fill opacity for nodes
    stroke = '#555', // stroke for links
    strokeWidth = 1.5, // stroke width for links
    strokeOpacity = 0.4, // stroke opacity for links
    strokeLinejoin, // stroke line join for links
    strokeLinecap, // stroke line cap for links
    halo = '#fff', // color of label halo
    haloWidth = 3, // padding around the labels
  }: any = {}): any {

    // If id and parentId options are specified, or the path option, use d3.stratify
    // to convert tabular data to a hierarchy; otherwise we assume that the data is
    // specified as an object {children} with nested objects (a.k.a. the “flare.json”
    // format), and use d3.hierarchy.

    /*
    const root = path != null ? d3.stratify().path(path)(data)
      : id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
        : d3.hierarchy(data, children);
     */

    const root = id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
      : d3.hierarchy(data, children);

    // Compute labels and titles.
    const descendants = root.descendants();
    const L = label == null ? null : descendants.map((d: { data: any; }) => label(d.data, d));

    // Sort the nodes.
    if (sort != null) { root.sort(sort); }

    // Compute the layout.
    const dx = 10;
    const dy = width / (root.height + padding);
    tree().nodeSize([dx, dy])(root);

    // Center the tree.
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      // @ts-ignore
      if (d.x > x1) { x1 = d.x; }
      // @ts-ignore
      if (d.x < x0) { x0 = d.x; }
    });

    // Compute the default height.
    if (height === undefined) { height = x1 - x0 + dx * 2; }

    const viewBox: any = [-dy * padding / 2, x0 - dx, width, height];
    // const svg = d3.create('svg')
    const svg = d3.select('figure#' + this.id)
      .append('svg')
      .attr('viewBox', viewBox)
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);

    const dAttr: any = d3.linkHorizontal()
      // @ts-ignore
      .x(d => d.y)
      // @ts-ignore
      .y(d => d.x);

    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', stroke)
      .attr('stroke-opacity', strokeOpacity)
      .attr('stroke-linecap', strokeLinecap)
      .attr('stroke-linejoin', strokeLinejoin)
      .attr('stroke-width', strokeWidth)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('d', dAttr);

    const xlinkhref: any = link == null ? null : (d: { data: any; }) => link(d.data, d);
    const transformAttr: any = (d: { y: any; x: any; }) => `translate(${d.y},${d.x})`;
    const node = svg.append('g')
      .selectAll('a')
      .data(root.descendants())
      .join('a')
      .attr('xlink:href', xlinkhref)
      .attr('target', link == null ? null : linkTarget)
      .attr('transform', transformAttr);

    const fillAttr: any = (d: { children: any; }) => d.children ? stroke : fill;
    node.append('circle')
      .attr('fill', fillAttr)
      .attr('r', r);

    const textAttr: any = (d: {data: any} ) => title(d.data, d);
    if (title != null) { node.append('title')
      .text(textAttr);
    }

    const textAnchorAttr: any = (d: { children: any; }) => d.children ? 'end' : 'start';
    const x: any = (dd: { children: any; }) => dd.children ? -6 : 6;
    if (L) { node.append('text')
      .attr('dy', '0.32em')
      .attr('x', x)
      .attr('text-anchor', textAnchorAttr)
      .text((d, i) => L[i])
      .call(text => text.clone(true))
      .attr('fill', 'none')
      .attr('stroke', halo)
      .attr('stroke-width', haloWidth);
    }

    return svg.node();
  }

}
