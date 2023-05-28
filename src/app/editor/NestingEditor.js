import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
    addEdge,
    ConnectionLineType,
    useReactFlow,
    Panel,
    MiniMap,
    useNodesState,
    useEdgesState,
} from "reactflow";
import dagre from "dagre";
import NestingEditorNode from "./NestingEditorNode";
import Button from "../common/Button";
import "reactflow/dist/style.css";

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
    custom: NestingEditorNode,
};

// check if target is a child of node
const isChildNode = (target, node) => {
    console.log(
        target.data.parentId,
        node.data.tokenId,
        target.data.parentCollection,
        node.data.collectionId
    );
    return (
        target.data.parentId === node.data.tokenId &&
        target.data.parentCollection === node.data.collectionId
    );
};

const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 200;
    const nodeHeight = 80;

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

const NestingEditor = ({ treeData, nestAndRebuild, unnestAndRebuild }) => {
    // this ref stores the current dragged node
    const dragRef = useRef(null);

    // target is the node that the node is dragged over
    const [target, setTarget] = useState(null);

    // currentNode is the last selected node
    const [currentNode, setCurrentNode] = useState(null);

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

    const onNodeDrag = useCallback(
        (evt, node) => {
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
        },
        [nodes]
    );

    const onNodeDragStop = useCallback(
        (evt, node) => {
            //console.log(target, node)
            if (!target) return;
            // on drag stop, we update the three

            if (isChildNode(target, node)) {
                console.log("this node can't be child of its child");
                return;
            }

            const { tokenId: parentId, collectionId: parentCollection } =
                target.data;
            const { tokenId: childId, collectionId: childCollection } =
                node.data;

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
            });

            setTarget(null);
            dragRef.current = null;
            nestAndRebuild(updatedNodes, {
                parentId,
                parentCollection,
                childId,
                childCollection,
            });
        },
        [nodes, edges, target]
    );

    const onNodeClick = useCallback(
        (evt, _node) => {
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === _node.id) {
                        node.data = {
                            ...node.data,
                            isSelected: true,
                        };
                    } else {
                        node.data = { ...node.data, isSelected: false };
                    }
                    return node;
                })
            );

            //console.log(_node);
            setCurrentNode(_node);
        },
        [nodes]
    );

    const handleUnnest = async () => {
        const isConfirm = window.confirm(
            `Do you want to Unnest the #${currentNode.data.tokenId} token?`
        );
        if (!isConfirm) return;

        const updatedNodes = nodes.map((node) => {
            if (node.id === currentNode.id) {
                node.data = {
                    ...node.data,
                    parentId: 0,
                    parentCollection: 0,
                    isSelected: false,
                };
            }
            return node.data;
        });

        const {
            parentCollection,
            parentId,
            tokenId: childId,
            collectionId: childCollection,
        } = currentNode.data;
        await unnestAndRebuild(updatedNodes, {
            parentCollection,
            parentId,
            childCollection,
            childId,
        });
        setCurrentNode(null);
    };

    const unnestEnabled = () => {
        if (currentNode === null) return false;
        return (
            currentNode.data.parentCollection !== 0 &&
            currentNode.data.parentId !== 0
        );
    };

    const bundleSelected = () => {
        if (currentNode === null) return false;
        return currentNode.data.isBundle;
    };

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

    const control =
        nodes.length < 1 ? (
            <div className="relative h-full flex items-center justify-center">
                Processing...
            </div>
        ) : (
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
                onNodeClick={onNodeClick}
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
            >
                <MiniMap pannable />
                <Panel position="topleft">
                    {currentNode !== null ? (
                        <Button>Detail Page</Button>
                    ) : null}
                    {unnestEnabled() ? (
                        <Button color="orange" onClick={() => handleUnnest()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="inline mr-1 w-3 h-3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                                />
                            </svg>
                            <span>Unnest</span>
                        </Button>
                    ) : null}
                    {bundleSelected() ? (
                        <Button color="blue">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="inline w-3 h-3 mr-1"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                            </svg>

                            <span>Customizer</span>
                        </Button>
                    ) : null}
                </Panel>
            </ReactFlow>
        );

    return control;
};

export default NestingEditor;
