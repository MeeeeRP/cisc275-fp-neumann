import type { Project, ProjectTab } from "../models/types";

interface ProjectNavProps {
    project: Project;
    activeTab: ProjectTab;
    onTabChange: (tab: ProjectTab) => void;
    onBack: () => void;
}

export function ProjectNav({
    project,
    activeTab,
    onTabChange,
    onBack,
}: ProjectNavProps) {
    const tabs: { id: ProjectTab; label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "graph", label: "Page Graph" },
        { id: "pages", label: "Pages" },
        { id: "state", label: "State Model" },
        { id: "logic", label: "Logic" },
        { id: "export", label: "Export" },
    ];

    return (
        <nav className="project-nav">
            <div className="project-nav-top">
                <button className="btn btn-ghost" onClick={onBack}>
                    ← Dashboard
                </button>
                <span className="project-nav-title">{project.name}</span>
            </div>
            <div className="project-nav-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`nav-tab${activeTab === tab.id ? " nav-tab--active" : ""}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
