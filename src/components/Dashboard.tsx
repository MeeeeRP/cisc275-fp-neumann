import type { Project } from "../models/types";

interface DashboardProps {
    projects: Project[];
    onCreate: () => void;
    onOpen: (id: string) => void;
    onDelete: (id: string) => void;
    onLoadDemo: () => void;
}

export function Dashboard({
    projects,
    onCreate,
    onOpen,
    onDelete,
    onLoadDemo,
}: DashboardProps) {
    function formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Drafter Drafter</h1>
                <p className="dashboard-subtitle">
                    Plan your Drafter web application projects
                </p>
            </div>

            <div className="dashboard-actions">
                <button className="btn btn-primary" onClick={onCreate}>
                    + New Project
                </button>
                <button className="btn btn-secondary" onClick={onLoadDemo}>
                    Load Demo Projects
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <p>No projects yet. Create a new project or load a demo.</p>
                </div>
            ) : (
                <div className="project-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <div className="project-card-body">
                                <h2 className="project-name">{project.name}</h2>
                                {project.purpose && (
                                    <p className="project-purpose">
                                        {project.purpose}
                                    </p>
                                )}
                                <p className="project-meta">
                                    {project.pages.length} page
                                    {project.pages.length !== 1 ? "s" : ""} ·{" "}
                                    {project.routes.length} route
                                    {project.routes.length !== 1 ? "s" : ""}
                                </p>
                                <p className="project-date">
                                    Last modified:{" "}
                                    {formatDate(project.lastModified)}
                                </p>
                            </div>
                            <div className="project-card-actions">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => onOpen(project.id)}
                                >
                                    Open
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                `Delete "${project.name}"? This cannot be undone.`
                                            )
                                        ) {
                                            onDelete(project.id);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
