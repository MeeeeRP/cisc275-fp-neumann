import type { Project } from "../models/types";

interface ProjectOverviewProps {
    project: Project;
    onUpdate: (project: Project) => void;
}

export function ProjectOverview({ project, onUpdate }: ProjectOverviewProps) {
    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        onUpdate({ ...project, name: e.target.value });
    }

    function handlePurposeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        onUpdate({ ...project, purpose: e.target.value });
    }

    return (
        <div className="tab-content">
            <h2>Project Overview</h2>
            <div className="form-group">
                <label className="form-label" htmlFor="project-name">
                    Project Name
                </label>
                <input
                    id="project-name"
                    className="form-input"
                    type="text"
                    value={project.name}
                    onChange={handleNameChange}
                    placeholder="Enter project name"
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="project-purpose">
                    Purpose / Description
                </label>
                <textarea
                    id="project-purpose"
                    className="form-textarea"
                    value={project.purpose}
                    onChange={handlePurposeChange}
                    placeholder="Describe what this website does, who uses it, and what problem it solves."
                    rows={5}
                />
            </div>

            <div className="overview-stats">
                <div className="stat-card">
                    <div className="stat-value">{project.pages.length}</div>
                    <div className="stat-label">Pages</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{project.routes.length}</div>
                    <div className="stat-label">Routes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {project.stateModel.attributes.length}
                    </div>
                    <div className="stat-label">State Attributes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {project.annotations.length}
                    </div>
                    <div className="stat-label">Annotations</div>
                </div>
            </div>
        </div>
    );
}
