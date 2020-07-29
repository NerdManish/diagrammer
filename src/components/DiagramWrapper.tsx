/*
*  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

import { GuidedDraggingTool } from '../GuidedDraggingTool';

import './Diagram.css';

//require('gojs/extensionsTS/Figures.js');
// Can't get the above to work, so I'm copying the relevant part here
go.Shape.defineFigureGenerator('Cloud', (shape, w, h) => {
  return new go.Geometry()
    .add(new go.PathFigure(.08034461 * w, .1944299 * h, true)
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .2008615 * w, .05349299 * h, -.09239631 * w, .07836421 * h, .1406031 * w, -.0542823 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .4338609 * w, .074219 * h, .2450511 * w, -.00697547 * h, .3776197 * w, -.01112067 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .6558228 * w, .07004196 * h, .4539471 * w, 0, .6066018 * w, -.02526587 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .8921095 * w, .08370865 * h, .6914277 * w, -.01904177 * h, .8921095 * w, -.01220843 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .9147671 * w, .3194596 * h, 1.036446 * w, .04105738 * h, 1.020377 * w, .3022052 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .9082935 * w, .562044 * h, 1.04448 * w, .360238 * h, .992256 * w, .5219009 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .9212406 * w, .8217117 * h, 1.032337 * w, .5771781 * h, 1.018411 * w, .8120651 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .7592566 * w, .9156953 * h, 1.028411 * w, .9571472 * h, .8556702 * w, 1.052487 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .5101666 * w, .9310455 * h, .7431877 * w, 1.009325 * h, .5624123 * w, 1.021761 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .2609328 * w, .9344623 * h, .4820677 * w, 1.031761 * h, .3030112 * w, 1.002796 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .08034461 * w, .870098 * h, .2329994 * w, 1.01518 * h, .03213784 * w, 1.01518 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .06829292 * w, .6545475 * h, -.02812061 * w, .9032597 * h, -.01205169 * w, .6835638 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .06427569 * w, .4265613 * h, -.01812061 * w, .6089503 * h, -.00606892 * w, .4555777 * h))
      .add(new go.PathSegment(go.PathSegment.Bezier,
        .08034461 * w, .1944299 * h, -.01606892 * w, .3892545 * h, -.01205169 * w, .1944299 * h)))
    .setSpots(.1, .1, .9, .9);
});
// End copy-paste


interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}


export class DiagramWrapper extends React.Component<DiagramProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;

  /** @internal */
  constructor(props: DiagramProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  public getDiagramObject(): go.Diagram | null {
    return this.diagramRef.current!.getDiagram();
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': true,  // must be set to allow for model change listening
          // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          draggingTool: new GuidedDraggingTool(),  // defined in GuidedDraggingTool.ts
          'draggingTool.horizontalGuidelineColor': 'blue',
          'draggingTool.verticalGuidelineColor': 'blue',
          'draggingTool.centerGuidelineColor': 'green',
          'draggingTool.guidelineWidth': 1,
          layout: $(go.ForceDirectedLayout),
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
              // positive keys for nodes
              makeUniqueKeyFunction: (m: go.Model, data: any) => {
                let k = data.key || 1;
                while (m.findNodeDataForKey(k)) k++;
                data.key = k;
                return k;
              },
              // negative keys for links
              makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                let k = data.key || -1;
                while (m.findLinkDataForKey(k)) k--;
                data.key = k;
                return k;
              }
            })
        });

    var nodeTemplateMap = new go.Map<string,any>();
    // define a simple Node template
    nodeTemplateMap.add("",
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', fill: 'white', strokeWidth: 0,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
          new go.Binding('text').makeTwoWay()
        )
      ));
      nodeTemplateMap.add("ECS",
      $(go.Node, go.Panel.Auto,  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', fill: 'white', strokeWidth: 0,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.Picture, "https://epsagon.com/wp-content/uploads/2019/05/Compute_AmazonECS_LARGE2-273x300.png",
        {width:30, height: 30, opacity: 0.5}),
        $(go.TextBlock,
          { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
          new go.Binding('text').makeTwoWay(),
        )
      ));
      nodeTemplateMap.add("EMR",
      $(go.Node, go.Panel.Auto,  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', fill: 'white', strokeWidth: 0,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.Picture, "https://cdn2.iconfinder.com/data/icons/amazon-aws-stencils/100/Compute__Networking_copy_Amazon_EMR---512.png",
        {width:40, height: 40, opacity: 0.5}),
        $(go.TextBlock,
          { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
          new go.Binding('text').makeTwoWay(),
        )
      ));
      nodeTemplateMap.add("IP",
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 
          {
            name: 'SHAPE', fill: 'white', strokeWidth: 1,
            figure: 'Cloud',
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
          new go.Binding('text').makeTwoWay()
        )
      ));

    diagram.nodeTemplateMap = nodeTemplateMap;

    var linkTemplateMap = new go.Map<string,any>();

    // relinking depends on modelData
    linkTemplateMap.add("IngressRule",
      $(go.Link,
        new go.Binding('relinkableFrom', 'canRelink').ofModel(),
        new go.Binding('relinkableTo', 'canRelink').ofModel(),
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' })
      ));
    linkTemplateMap.add("VPCPeering",
      $(go.Link,
        $(go.Shape, "RoundedRectangle", { fill: "lightblue" }),
        $(go.Picture, "https://www.edrawsoft.com/symbols/awscomputeandnetworking/vpcpeering.png",
        { width: 50, height: 50 }),
      ));
    diagram.linkTemplateMap = linkTemplateMap;

    var groupTemplateMap = new go.Map<string,any>();
    groupTemplateMap.add("cluster",
      $(go.Group, "Vertical",
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
            {
              parameter1: 14,
              fill: "rgba(128,128,128,0.33)"
            }),
          $(go.Panel, "Vertical",
            $(go.Panel, go.Panel.Horizontal,
              $(go.TextBlock,         // group title
                { alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" },
                new go.Binding("text", "text")),
              $(go.Picture, "https://www.cloudoptics.io/wp-content/uploads/2015/03/aws_vpc.png",
                { width: 40, height: 40 }),
              { alignment: go.Spot.Right }
            ),
            $(go.Placeholder,    // represents the area of all member parts,
              { padding: 5 })   // with some extra padding around them
          ),
        ),
      ));
    groupTemplateMap.add("tier",
      $(go.Group, "Vertical",
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",  // surrounds the Placeholder
            {
              //parameter1: 14,
              fill: "rgba(108,108,176,0.33)"
            }),
          $(go.Panel, "Vertical",
            $(go.Panel, go.Panel.Horizontal,
              $(go.TextBlock,         // group title
                { alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" },
                new go.Binding("text", "text")),
              $(go.Picture, "https://www.emoji.co.uk/files/apple-emojis/smileys-people-ios/57-crying-face.png",
                { width: 30, height: 30 }),
              { alignment: go.Spot.Right }
            ),
            $(go.Placeholder,    // represents the area of all member parts,
              { padding: 15 })   // with some extra padding around them
          ),
        ),
      ));

    diagram.groupTemplateMap = groupTemplateMap;

    return diagram;
  }

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName='diagram-component'
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}
