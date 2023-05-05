import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
    addEdge,
    ConnectionLineType,
    useReactFlow,
    useNodesState,
    useEdgesState,
} from "reactflow";
import dagre from "dagre";
import NestingVizNode from "../common/NestingVizNode";
import "reactflow/dist/style.css";
import Loader from "../common/Loader";

const formatTreeData = (data) => {
    const position = { x: 0, y: 0 };
    const nodes = data.map((d) => ({
        id: `${d.collectionId}_${d.tokenId}`,
        data: { ...d },
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

// check if target is a child of node
const isChildNode = (target, node) => {
    console.log(target.data.parentId,node.data.tokenId,target.data.parentCollection,node.data.collectionId)
    return target.data.parentId === node.data.tokenId && target.data.parentCollection === node.data.collectionId
}

const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 172;
    const nodeHeight = 50;

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

const NestingEditor = ({ treeData, rebuildTree }) => {
    // this ref stores the current dragged node
    const dragRef = useRef(null);

    // target is the node that the node is dragged over
    const [target, setTarget] = useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!treeData) return;

        const { initialNodes, initialEdges } = formatTreeData(treeData);
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements([...initialNodes], initialEdges);

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [treeData]);

    // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const onNodeDragStart = (evt, node) => {
        dragRef.current = node;
    };

    const onNodeDrag = useCallback((evt, node) => {
        // calculate the center point of the node from position and dimensions
        const centerX = node.position.x + node.width / 2;
        const centerY = node.position.y + node.height / 2;

        // find a node where the center point is inside
        const targetNode = nodes.find(
            (n) =>
                centerX > n.position.x &&
                centerX < n.position.x + n.width &&
                centerY > n.position.y &&
                centerY < n.position.y + n.height &&
                n.id !== node.id // this is needed, ote draggedherwise we would always find th node
        );

        setTarget(targetNode);
    }, [nodes]);

    const onNodeDragStop = useCallback((evt, node) => {
        console.log(target, node)
        if (!target) return
        // on drag stop, we update the three

        if (isChildNode(target, node)) {
            console.log("this node can't be child of its child")
            return;
        }

        const updatedNodes = nodes.map((n) => {
            if (n.id === dragRef.current.id && target) {
                n.data = {
                    ...node.data,
                    parentId: target.data.tokenId,
                    parentCollection: target.data.collectionId,
                    isHighlight: false,
                };
            } else {
                n.data = { ...n.data, isHighlight: false };
            }

            return n.data;
        })

        //console.log(updatedNodes)

        setTarget(null);
        dragRef.current = null;
        rebuildTree(updatedNodes)

    },[nodes, edges, target]);

    useEffect(() => {
        // whenever the target changes, we swap the colors temporarily
        // this is just a placeholder, implement your own logic here
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === target?.id) {
                    node.data = {
                        ...node.data,
                        isHighlight: true,
                    };
                    //} else if (node.id === dragRef.current?.id && target) {
                    //    node.data = { ...node.data, label: target.data.color };
                } else {
                    node.data = { ...node.data, isHighlight: false };
                }
                return node;
            })
        );
    }, [target]);

    const control = nodes.length < 1 ? <div className="relative h-full flex items-center justify-center"><Loader /></div> : (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            //onConnect={onConnect}
            //connectionLineType={ConnectionLineType.SmoothStep}
            nodeTypes={nodeTypes}
            nodesDraggable={true}
            zoomOnScroll={true}
            panOnDrag={true}
            fitView
            className="bg-blue-100"
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
        />
    )

    return control;
};

export default NestingEditor;
