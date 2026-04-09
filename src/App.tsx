import { useState } from "react";
import type { Project, AppView, ProjectTab } from "./models/types";
import { newProject } from "./models/defaults";
import {
    loadProjects,
    saveProject,
    deleteProject,
    saveProjects,
} from "./services/storage";
import { DEMO_PROJECTS } from "./services/demoProjects";
import { Dashboard } from "./components/Dashboard";
import { ProjectNav } from "./components/ProjectNav";
import { ProjectOverview } from "./components/ProjectOverview";
import { GraphEditor } from "./components/GraphEditor";
import { PageEditor } from "./components/PageEditor";
import { StateModelEditor } from "./components/StateModelEditor";
import { LogicAnnotations } from "./components/LogicAnnotations";
import { ExportPanel } from "./components/ExportPanel";
import "./App.css";

export function App() {
    const [projects, setProjects] = useState<Project[]>(loadProjects);
    const [view, setView] = useState<AppView>({ kind: "dashboard" });

    function handleCreateProject() {
        const name = prompt("Project name:")?.trim();
        if (!name) return;
        const project = newProject(name);
        saveProject(project);
        setProjects((prev) => [...prev, project]);
        setView({ kind: "project", projectId: project.id, tab: "overview" });
    }

    function handleOpenProject(id: string) {
        setView({ kind: "project", projectId: id, tab: "overview" });
    }

    function handleDeleteProject(id: string) {
        deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
    }

    function handleLoadDemo() {
        const current = loadProjects();
        const currentIds = new Set(current.map((p) => p.id));
        const toAdd = DEMO_PROJECTS.filter((d) => !currentIds.has(d.id));
        if (toAdd.length === 0) {
            alert("Demo projects are already loaded.");
            return;
        }
        const updated = [...current, ...toAdd];
        saveProjects(updated);
        setProjects(updated);
    }

    function handleUpdateProject(project: Project) {
        saveProject(project);
        setProjects((prev) =>
            prev.map((p) => (p.id === project.id ? project : p))
        );
    }

    function handleImportProject(project: Project) {
        saveProject(project);
        setProjects((prev) => {
            const exists = prev.some((p) => p.id === project.id);
            return exists
                ? prev.map((p) => (p.id === project.id ? project : p))
                : [...prev, project];
        });
        setView({
            kind: "project",
            projectId: project.id,
            tab: "overview",
        });
    }

    if (view.kind === "dashboard") {
        return (
            <Dashboard
                projects={projects}
                onCreate={handleCreateProject}
                onOpen={handleOpenProject}
                onDelete={handleDeleteProject}
                onLoadDemo={handleLoadDemo}
            />
        );
    }

    const { projectId, tab } = view;
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return (
            <div className="error-page">
                <p>Project not found.</p>
                <button
                    className="btn btn-primary"
                    onClick={() => setView({ kind: "dashboard" })}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    function handleTabChange(newTab: ProjectTab) {
        setView({ kind: "project", projectId, tab: newTab });
    }

    function renderTab() {
        if (!project) return null;
        switch (tab) {
            case "overview":
                return (
                    <ProjectOverview
                        project={project}
                        onUpdate={handleUpdateProject}
                    />
                );
            case "graph":
                return (
                    <GraphEditor
                        project={project}
                        onUpdate={handleUpdateProject}
                    />
                );
            case "pages":
                return (
                    <PageEditor
                        project={project}
                        onUpdate={handleUpdateProject}
                    />
                );
            case "state":
                return (
                    <StateModelEditor
                        project={project}
                        onUpdate={handleUpdateProject}
                    />
                );
            case "logic":
                return (
                    <LogicAnnotations
                        project={project}
                        onUpdate={handleUpdateProject}
                    />
                );
            case "export":
                return (
                    <ExportPanel
                        project={project}
                        allProjectIds={projects.map((p) => p.id)}
                        onImport={handleImportProject}
                    />
                );
        }
    }

    return (
        <div className="app-layout">
            <ProjectNav
                project={project}
                activeTab={tab}
                onTabChange={handleTabChange}
                onBack={() => setView({ kind: "dashboard" })}
            />
            <main className="app-main">{renderTab()}</main>
        </div>
    );
}

export default App;
