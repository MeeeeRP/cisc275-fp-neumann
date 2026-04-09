import { useState } from "react";
import type {
    Project,
    PageNode,
    UIComponent,
    ComponentKind,
    PageStyle,
    ComponentStyle,
} from "../models/types";
import { ALL_COMPONENT_KINDS } from "../models/types";
import { makeComponent } from "../models/defaults";
import { ComponentPreview } from "./ComponentPreview";
import { ComponentConfig } from "./ComponentConfig";
import { PageStyleEditor, ComponentStyleEditor } from "./StyleEditor";

interface PageEditorProps {
    project: Project;
    onUpdate: (project: Project) => void;
}

export function PageEditor({ project, onUpdate }: PageEditorProps) {
    const [selectedPageId, setSelectedPageId] = useState<string | null>(
        project.pages[0]?.id ?? null
    );
    const [selectedCompId, setSelectedCompId] = useState<string | null>(null);

    const selectedPage = project.pages.find((p) => p.id === selectedPageId);
    const selectedComp = selectedPage?.components.find(
        (c) => c.id === selectedCompId
    );

    function updatePage(updated: PageNode) {
        const pages = project.pages.map((p) =>
            p.id === updated.id ? updated : p
        );
        onUpdate({ ...project, pages });
        setSelectedPageId(updated.id);
    }

    function handleAddComponent(kind: ComponentKind) {
        if (!selectedPage) return;
        const newComp = makeComponent(kind);
        const updated: PageNode = {
            ...selectedPage,
            components: [...selectedPage.components, newComp],
        };
        updatePage(updated);
        setSelectedCompId(newComp.id);
    }

    function handleDeleteComponent(compId: string) {
        if (!selectedPage) return;
        const components = selectedPage.components.filter(
            (c) => c.id !== compId
        );
        updatePage({ ...selectedPage, components });
        if (selectedCompId === compId) setSelectedCompId(null);
    }

    function handleMoveComponent(compId: string, direction: "up" | "down") {
        if (!selectedPage) return;
        const comps = [...selectedPage.components];
        const idx = comps.findIndex((c) => c.id === compId);
        if (idx < 0) return;
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= comps.length) return;
        const temp = comps[idx];
        comps[idx] = comps[newIdx];
        comps[newIdx] = temp;
        updatePage({ ...selectedPage, components: comps });
    }

    function handleUpdateComponent(updated: UIComponent) {
        if (!selectedPage) return;
        const components = selectedPage.components.map((c) =>
            c.id === updated.id ? updated : c
        );
        updatePage({ ...selectedPage, components });
    }

    function handlePageStyleChange(style: PageStyle) {
        if (!selectedPage) return;
        updatePage({ ...selectedPage, style });
    }

    function handleCompStyleChange(style: ComponentStyle) {
        if (!selectedPage || !selectedComp) return;
        const updated: UIComponent = { ...selectedComp, style };
        handleUpdateComponent(updated);
    }

    function handlePageDescChange(desc: string) {
        if (!selectedPage) return;
        updatePage({ ...selectedPage, description: desc });
    }

    const routeOptions = project.routes.map((r) => {
        const toPage = project.pages.find((p) => p.id === r.toPageId);
        return {
            id: r.id,
            label: `${r.label} → ${toPage?.name ?? "?"}`,
        };
    });

    const pageStyle: React.CSSProperties = selectedPage
        ? {
              backgroundColor: selectedPage.style.backgroundColor,
              color: selectedPage.style.color,
              fontFamily: selectedPage.style.fontFamily,
              display: selectedPage.style.display,
              flexDirection:
                  selectedPage.style.flexDirection as React.CSSProperties["flexDirection"],
              gap: selectedPage.style.gap,
              padding: selectedPage.style.padding,
          }
        : {};

    return (
        <div className="tab-content page-editor">
            {/* Left: Page list */}
            <div className="page-list-panel">
                <h3>Pages</h3>
                {project.pages.map((page) => (
                    <button
                        key={page.id}
                        className={`page-list-item${selectedPageId === page.id ? " page-list-item--active" : ""}`}
                        onClick={() => {
                            setSelectedPageId(page.id);
                            setSelectedCompId(null);
                        }}
                    >
                        {page.name}
                    </button>
                ))}
                {project.pages.length === 0 && (
                    <p className="hint-text">
                        Add pages in the Page Graph tab
                    </p>
                )}
            </div>

            {/* Center: Page preview */}
            <div className="page-preview-panel">
                {selectedPage ? (
                    <>
                        <div className="page-preview-header">
                            <h3>{selectedPage.name}</h3>
                            <textarea
                                className="form-textarea"
                                placeholder="Page description…"
                                value={selectedPage.description}
                                onChange={(e) =>
                                    handlePageDescChange(e.target.value)
                                }
                                rows={2}
                            />
                        </div>
                        <div
                            className="page-preview-canvas"
                            style={pageStyle}
                        >
                            {selectedPage.components.map((comp) => (
                                <div
                                    key={comp.id}
                                    className={`comp-wrapper${selectedCompId === comp.id ? " comp-wrapper--selected" : ""}`}
                                    onClick={() =>
                                        setSelectedCompId(comp.id)
                                    }
                                >
                                    <ComponentPreview component={comp} />
                                    <div className="comp-controls">
                                        <button
                                            className="comp-ctrl-btn"
                                            title="Move up"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMoveComponent(
                                                    comp.id,
                                                    "up"
                                                );
                                            }}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            className="comp-ctrl-btn"
                                            title="Move down"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMoveComponent(
                                                    comp.id,
                                                    "down"
                                                );
                                            }}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            className="comp-ctrl-btn comp-ctrl-btn--delete"
                                            title="Delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteComponent(comp.id);
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {selectedPage.components.length === 0 && (
                                <p className="hint-text">
                                    Add components from the right panel
                                </p>
                            )}
                        </div>

                        {/* Add component buttons */}
                        <div className="comp-palette">
                            <span className="comp-palette-label">Add:</span>
                            {ALL_COMPONENT_KINDS.map((kind) => (
                                <button
                                    key={kind}
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => handleAddComponent(kind)}
                                >
                                    {kind}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="hint-text">Select a page to edit</div>
                )}
            </div>

            {/* Right: Config + Style panel */}
            <div className="config-panel">
                {selectedPage && (
                    <PageStyleEditor
                        style={selectedPage.style}
                        onChange={handlePageStyleChange}
                    />
                )}

                {selectedComp ? (
                    <>
                        <div className="config-section">
                            <h4>
                                Configure: {selectedComp.type}
                            </h4>
                            <ComponentConfig
                                component={selectedComp}
                                routeOptions={routeOptions}
                                onChange={handleUpdateComponent}
                            />
                        </div>
                        <ComponentStyleEditor
                            style={selectedComp.style}
                            onChange={handleCompStyleChange}
                        />
                    </>
                ) : (
                    selectedPage && (
                        <p className="hint-text">
                            Click a component to configure it
                        </p>
                    )
                )}
            </div>
        </div>
    );
}
