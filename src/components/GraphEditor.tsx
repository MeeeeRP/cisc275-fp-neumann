import { useState, useRef, useCallback } from "react";
import type { Project, PageNode, Route } from "../models/types";
import { generateId, defaultPage } from "../models/defaults";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;

interface GraphEditorProps {
    project: Project;
    onUpdate: (project: Project) => void;
}

type ConnectState =
    | { active: false }
    | { active: true; fromId: string | null };

export function GraphEditor({ project, onUpdate }: GraphEditorProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [connectState, setConnectState] = useState<ConnectState>({
        active: false,
    });
    const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
    const [routeLabelDraft, setRouteLabelDraft] = useState("");
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [nodeDraft, setNodeDraft] = useState("");

    const getSVGCoords = useCallback(
        (clientX: number, clientY: number): { x: number; y: number } => {
            const svg = svgRef.current;
            if (!svg) return { x: 0, y: 0 };
            const rect = svg.getBoundingClientRect();
            return { x: clientX - rect.left, y: clientY - rect.top };
        },
        []
    );

    function handleAddPage() {
        const x = 60 + (project.pages.length % 4) * 200;
        const y = 60 + Math.floor(project.pages.length / 4) * 140;
        const newPage = defaultPage(`page_${project.pages.length + 1}`, x, y);
        onUpdate({ ...project, pages: [...project.pages, newPage] });
    }

    function handleDeletePage(pageId: string) {
        const pages = project.pages.filter((p) => p.id !== pageId);
        const routes = project.routes.filter(
            (r) => r.fromPageId !== pageId && r.toPageId !== pageId
        );
        const annotations = project.annotations.filter(
            (a) => !(a.attachedTo === pageId && a.attachedToType === "page")
        );
        onUpdate({ ...project, pages, routes, annotations });
    }

    function handleNodeMouseDown(
        e: React.MouseEvent<SVGGElement>,
        nodeId: string
    ) {
        e.stopPropagation();
        if (connectState.active) {
            if (connectState.fromId === null) {
                setConnectState({ active: true, fromId: nodeId });
            } else if (connectState.fromId !== nodeId) {
                const newRoute: Route = {
                    id: generateId(),
                    fromPageId: connectState.fromId,
                    toPageId: nodeId,
                    label: "route",
                    stateChanges: [],
                };
                onUpdate({
                    ...project,
                    routes: [...project.routes, newRoute],
                });
                setConnectState({ active: false });
            }
            return;
        }
        const node = project.pages.find((p) => p.id === nodeId);
        if (!node) return;
        const { x: mx, y: my } = getSVGCoords(e.clientX, e.clientY);
        setDraggingId(nodeId);
        setDragOffset({ x: mx - node.position.x, y: my - node.position.y });
    }

    function handleSVGMouseMove(e: React.MouseEvent<SVGSVGElement>) {
        if (!draggingId) return;
        const { x, y } = getSVGCoords(e.clientX, e.clientY);
        const nx = Math.max(0, x - dragOffset.x);
        const ny = Math.max(0, y - dragOffset.y);
        const pages = project.pages.map((p) =>
            p.id === draggingId ? { ...p, position: { x: nx, y: ny } } : p
        );
        onUpdate({ ...project, pages });
    }

    function handleSVGMouseUp() {
        setDraggingId(null);
    }

    function handleStartEdit(node: PageNode) {
        setEditingNodeId(node.id);
        setNodeDraft(node.name);
    }

    function handleSaveNodeEdit() {
        if (!editingNodeId) return;
        const pages = project.pages.map((p) =>
            p.id === editingNodeId ? { ...p, name: nodeDraft } : p
        );
        onUpdate({ ...project, pages });
        setEditingNodeId(null);
        setNodeDraft("");
    }

    function handleStartRouteEdit(route: Route) {
        setEditingRouteId(route.id);
        setRouteLabelDraft(route.label);
    }

    function handleSaveRouteEdit() {
        if (!editingRouteId) return;
        const routes = project.routes.map((r) =>
            r.id === editingRouteId ? { ...r, label: routeLabelDraft } : r
        );
        onUpdate({ ...project, routes });
        setEditingRouteId(null);
        setRouteLabelDraft("");
    }

    function handleDeleteRoute(routeId: string) {
        const routes = project.routes.filter((r) => r.id !== routeId);
        const annotations = project.annotations.filter(
            (a) =>
                !(a.attachedTo === routeId && a.attachedToType === "route")
        );
        onUpdate({ ...project, routes, annotations });
    }

    function arrowPath(fromPage: PageNode, toPage: PageNode): string {
        const x1 = fromPage.position.x + NODE_WIDTH / 2;
        const y1 = fromPage.position.y + NODE_HEIGHT / 2;
        const x2 = toPage.position.x + NODE_WIDTH / 2;
        const y2 = toPage.position.y + NODE_HEIGHT / 2;
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    function midpoint(
        fromPage: PageNode,
        toPage: PageNode
    ): { x: number; y: number } {
        return {
            x:
                (fromPage.position.x +
                    toPage.position.x +
                    NODE_WIDTH) /
                2,
            y:
                (fromPage.position.y +
                    toPage.position.y +
                    NODE_HEIGHT) /
                2,
        };
    }

    const isConnecting = connectState.active;
    const connectFromId =
        connectState.active ? connectState.fromId : null;

    return (
        <div className="tab-content">
            <div className="graph-toolbar">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddPage}
                >
                    + Add Page
                </button>
                <button
                    className={`btn btn-sm ${isConnecting ? "btn-danger" : "btn-secondary"}`}
                    onClick={() => {
                        if (isConnecting) {
                            setConnectState({ active: false });
                        } else {
                            setConnectState({ active: true, fromId: null });
                        }
                    }}
                >
                    {isConnecting
                        ? connectFromId
                            ? "Click target page…"
                            : "Click source page… (Cancel)"
                        : "Connect Pages"}
                </button>
                {isConnecting && (
                    <span className="graph-hint">
                        {connectFromId
                            ? "Now click the destination page"
                            : "Click the source page first"}
                    </span>
                )}
            </div>

            <div className="graph-canvas-wrapper">
                <svg
                    ref={svgRef}
                    className={`graph-canvas${isConnecting ? " graph-canvas--connecting" : ""}`}
                    width="900"
                    height="560"
                    onMouseMove={handleSVGMouseMove}
                    onMouseUp={handleSVGMouseUp}
                    onMouseLeave={handleSVGMouseUp}
                >
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="10"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon
                                points="0 0, 10 3.5, 0 7"
                                fill="#555"
                            />
                        </marker>
                    </defs>

                    {/* Routes */}
                    {project.routes.map((route) => {
                        const fromPage = project.pages.find(
                            (p) => p.id === route.fromPageId
                        );
                        const toPage = project.pages.find(
                            (p) => p.id === route.toPageId
                        );
                        if (!fromPage || !toPage) return null;
                        const mid = midpoint(fromPage, toPage);
                        return (
                            <g key={route.id}>
                                <path
                                    d={arrowPath(fromPage, toPage)}
                                    stroke="#555"
                                    strokeWidth="2"
                                    fill="none"
                                    markerEnd="url(#arrowhead)"
                                />
                                {editingRouteId === route.id ? (
                                    <foreignObject
                                        x={mid.x - 60}
                                        y={mid.y - 14}
                                        width="120"
                                        height="28"
                                    >
                                        <input
                                            className="route-label-input"
                                            value={routeLabelDraft}
                                            onChange={(e) =>
                                                setRouteLabelDraft(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={handleSaveRouteEdit}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    handleSaveRouteEdit();
                                                if (e.key === "Escape") {
                                                    setEditingRouteId(null);
                                                }
                                            }}
                                            autoFocus
                                        />
                                    </foreignObject>
                                ) : (
                                    <g>
                                        <rect
                                            x={mid.x - 44}
                                            y={mid.y - 12}
                                            width="88"
                                            height="22"
                                            rx="4"
                                            fill="white"
                                            stroke="#ccc"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={mid.x}
                                            y={mid.y + 4}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fill="#444"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleStartRouteEdit(route)
                                            }
                                        >
                                            {route.label || "route"}
                                        </text>
                                        <text
                                            x={mid.x + 48}
                                            y={mid.y + 4}
                                            fontSize="12"
                                            fill="#e74c3c"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleDeleteRoute(route.id)
                                            }
                                        >
                                            ✕
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}

                    {/* Page nodes */}
                    {project.pages.map((page) => {
                        const isFrom =
                            connectFromId === page.id;
                        return (
                            <g
                                key={page.id}
                                transform={`translate(${page.position.x}, ${page.position.y})`}
                                onMouseDown={(e) =>
                                    handleNodeMouseDown(e, page.id)
                                }
                                style={{ cursor: isConnecting ? "crosshair" : "grab" }}
                            >
                                <rect
                                    width={NODE_WIDTH}
                                    height={NODE_HEIGHT}
                                    rx="8"
                                    fill={isFrom ? "#3498db" : "#ecf0f1"}
                                    stroke={isFrom ? "#2980b9" : "#bdc3c7"}
                                    strokeWidth="2"
                                />
                                {editingNodeId === page.id ? (
                                    <foreignObject
                                        x="4"
                                        y="16"
                                        width={NODE_WIDTH - 8}
                                        height="28"
                                    >
                                        <input
                                            className="node-name-input"
                                            value={nodeDraft}
                                            onChange={(e) =>
                                                setNodeDraft(e.target.value)
                                            }
                                            onBlur={handleSaveNodeEdit}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    handleSaveNodeEdit();
                                                if (e.key === "Escape") {
                                                    setEditingNodeId(null);
                                                }
                                            }}
                                            autoFocus
                                        />
                                    </foreignObject>
                                ) : (
                                    <text
                                        x={NODE_WIDTH / 2}
                                        y={NODE_HEIGHT / 2 + 5}
                                        textAnchor="middle"
                                        fontSize="13"
                                        fontWeight="500"
                                        fill={isFrom ? "white" : "#2c3e50"}
                                        onDoubleClick={() =>
                                            handleStartEdit(page)
                                        }
                                    >
                                        {page.name.length > 14
                                            ? page.name.slice(0, 12) + "…"
                                            : page.name}
                                    </text>
                                )}
                                {/* Delete button */}
                                <g
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                            confirm(
                                                `Delete page "${page.name}"?`
                                            )
                                        ) {
                                            handleDeletePage(page.id);
                                        }
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <circle
                                        cx={NODE_WIDTH - 8}
                                        cy="8"
                                        r="8"
                                        fill="#e74c3c"
                                        opacity="0.8"
                                    />
                                    <text
                                        x={NODE_WIDTH - 8}
                                        y="13"
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="white"
                                    >
                                        ✕
                                    </text>
                                </g>
                            </g>
                        );
                    })}

                    {project.pages.length === 0 && (
                        <text
                            x="450"
                            y="280"
                            textAnchor="middle"
                            fill="#aaa"
                            fontSize="16"
                        >
                            No pages yet — click &quot;Add Page&quot; to get
                            started
                        </text>
                    )}
                </svg>
            </div>

            <p className="graph-tip">
                Tip: Drag nodes to reposition · Double-click a node name to edit
                · Click route labels to edit
            </p>
        </div>
    );
}
