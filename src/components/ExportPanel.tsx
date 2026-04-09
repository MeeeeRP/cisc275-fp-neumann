import { useState } from "react";
import type { Project } from "../models/types";
import { generatePython } from "../services/pythonExport";
import { generateDocx } from "../services/docxExport";
import { exportProjectJSON, importProjectJSON } from "../services/jsonExport";

interface ExportPanelProps {
    project: Project;
    allProjectIds: string[];
    onImport: (project: Project) => void;
}

type ExportTab = "python" | "json" | "docx";

export function ExportPanel({
    project,
    allProjectIds,
    onImport,
}: ExportPanelProps) {
    const [activeTab, setActiveTab] = useState<ExportTab>("python");
    const [jsonImportText, setJsonImportText] = useState("");
    const [importError, setImportError] = useState("");
    const [docxLoading, setDocxLoading] = useState(false);

    const pythonCode = generatePython(project);

    function handleCopyPython() {
        void navigator.clipboard.writeText(pythonCode);
    }

    function handleExportJSON() {
        exportProjectJSON(project);
    }

    function handleImportJSON() {
        setImportError("");
        try {
            const imported = importProjectJSON(jsonImportText, allProjectIds);
            onImport(imported);
            setJsonImportText("");
        } catch {
            setImportError("Invalid JSON. Please check your file.");
        }
    }

    async function handleDownloadDocx() {
        setDocxLoading(true);
        try {
            await generateDocx(project);
        } finally {
            setDocxLoading(false);
        }
    }

    const tabs: { id: ExportTab; label: string }[] = [
        { id: "python", label: "Python Code" },
        { id: "json", label: "JSON Export" },
        { id: "docx", label: "DOCX Export" },
    ];

    return (
        <div className="tab-content">
            <h2>Export</h2>

            <div className="export-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`nav-tab${activeTab === tab.id ? " nav-tab--active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "python" && (
                <div className="export-section">
                    <p className="hint-text">
                        Starter Python code for your Drafter application. Copy
                        this into your project to get started.
                    </p>
                    <div className="export-code-header">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleCopyPython}
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                    <pre className="code-block">{pythonCode}</pre>
                </div>
            )}

            {activeTab === "json" && (
                <div className="export-section">
                    <h3>Export Project</h3>
                    <p className="hint-text">
                        Download the full project as JSON to share or back up.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleExportJSON}
                    >
                        Download {project.name}.json
                    </button>

                    <h3 style={{ marginTop: "24px" }}>Import Project</h3>
                    <p className="hint-text">
                        Paste a project JSON file below to import it as a new
                        project.
                    </p>
                    <textarea
                        className="form-textarea"
                        rows={8}
                        placeholder="Paste JSON here…"
                        value={jsonImportText}
                        onChange={(e) => setJsonImportText(e.target.value)}
                    />
                    {importError && (
                        <p className="error-text">{importError}</p>
                    )}
                    <button
                        className="btn btn-secondary"
                        onClick={handleImportJSON}
                        disabled={!jsonImportText.trim()}
                    >
                        Import Project
                    </button>
                </div>
            )}

            {activeTab === "docx" && (
                <div className="export-section">
                    <p className="hint-text">
                        Download a formatted Word document containing the page
                        graph, page descriptions, state model, logic
                        annotations, and component details.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            void handleDownloadDocx();
                        }}
                        disabled={docxLoading}
                    >
                        {docxLoading
                            ? "Generating…"
                            : `Download ${project.name}_export.docx`}
                    </button>

                    <div className="docx-preview">
                        <h4>Document Preview</h4>
                        <ul>
                            <li>
                                <strong>Title:</strong> {project.name}
                            </li>
                            {project.purpose && (
                                <li>
                                    <strong>Purpose:</strong> {project.purpose}
                                </li>
                            )}
                            <li>
                                <strong>Pages:</strong>{" "}
                                {project.pages.map((p) => p.name).join(", ") ||
                                    "(none)"}
                            </li>
                            <li>
                                <strong>Routes:</strong> {project.routes.length}
                            </li>
                            <li>
                                <strong>State Attributes:</strong>{" "}
                                {project.stateModel.attributes.length}
                            </li>
                            <li>
                                <strong>Annotations:</strong>{" "}
                                {project.annotations.length}
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
