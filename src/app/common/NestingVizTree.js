import React, { useCallback, useEffect } from "react";
import ReactFlow, {
    addEdge,
    ConnectionLineType,
    useNodesState,
    useEdgesState,
} from "reactflow";
import dagre from "dagre";
import NestingVizNode from "./NestingVizNode";
import "reactflow/dist/style.css";

const formatTreeData = (data, currentNode = {}) => {
    const isHighlight = (n, c) =>
        n.collectionId == c.collectionId && n.tokenId == c.tokenId;
    const position = { x: 0, y: 0 };
    const nodes = data.map((d) => ({
        id: `${d.collectionId}_${d.tokenId}`,
        data: { isHighlight: isHighlight(d, currentNode), ...d },
        type: "custom",
        position,
    }));
    const links = data.map((d) => {
        const source = `${d.parentCollection}_${d.parentId}`;
        const target = `${d.collectionId}_${d.tokenId}`;
        return { source, target, id: `${source}_${target}` };
    });

    return { initialNodes: nodes, initialEdges: links };
};

const nodeTypes = {
    custom: NestingVizNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 50;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? "left" : "top";
        node.sourcePosition = isHorizontal ? "right" : "bottom";

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

const NestingVizTree = ({ treeData, currentNode }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!treeData) return;

        const { initialNodes, initialEdges } = formatTreeData(
            treeData,
            currentNode
        );
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(initialNodes, initialEdges);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [treeData]);

    // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            //onConnect={onConnect}
            connectionLineType={ConnectionLineType.SmoothStep}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            zoomOnScroll={false}
            panOnDrag={false}
            fitView
            className="bg-darkdeep"
        />
    );
};

export default NestingVizTree;
