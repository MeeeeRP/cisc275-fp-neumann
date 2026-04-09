import type {
    Project,
    LogicAnnotation,
} from "../models/types";
import { generateId } from "../models/defaults";

interface LogicAnnotationsProps {
    project: Project;
    onUpdate: (project: Project) => void;
}

export function LogicAnnotations({
    project,
    onUpdate,
}: LogicAnnotationsProps) {
    function handleAdd(kind: "if" | "for") {
        const newAnn: LogicAnnotation = {
            id: generateId(),
            attachedTo: project.pages[0]?.id ?? "",
            attachedToType: "page",
            kind,
            description: "",
        };
        onUpdate({
            ...project,
            annotations: [...project.annotations, newAnn],
        });
    }

    function handleUpdate(idx: number, updated: LogicAnnotation) {
        const annotations = project.annotations.map((a, i) =>
            i === idx ? updated : a
        );
        onUpdate({ ...project, annotations });
    }

    function handleDelete(idx: number) {
        const annotations = project.annotations.filter((_, i) => i !== idx);
        onUpdate({ ...project, annotations });
    }

    const pageOptions = project.pages.map((p) => ({
        id: p.id,
        label: p.name,
        type: "page" as const,
    }));
    const routeOptions = project.routes.map((r) => ({
        id: r.id,
        label: r.label || r.id,
        type: "route" as const,
    }));
    const allOptions = [...pageOptions, ...routeOptions];

    const ifCount = project.annotations.filter((a) => a.kind === "if").length;
    const forCount = project.annotations.filter((a) => a.kind === "for").length;

    return (
        <div className="tab-content">
            <h2>Logic Annotations</h2>
            <p className="hint-text">
                Mark where conditional logic (if statements) and iteration (for
                loops) occur in your application. Attach them to pages or
                routes.
            </p>

            <div className="annotation-counts">
                <span
                    className={`count-badge${ifCount >= 3 ? " count-badge--ok" : " count-badge--warn"}`}
                >
                    if statements: {ifCount} / 3 required
                </span>
                <span
                    className={`count-badge${forCount >= 1 ? " count-badge--ok" : " count-badge--warn"}`}
                >
                    for loops: {forCount} / 1 required
                </span>
            </div>

            <div className="annotation-actions">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAdd("if")}
                >
                    + Add if statement
                </button>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAdd("for")}
                >
                    + Add for loop
                </button>
            </div>

            {project.annotations.length === 0 ? (
                <p className="hint-text">
                    No annotations yet. Add if/for markers above.
                </p>
            ) : (
                <div className="annotation-list">
                    {project.annotations.map((ann, idx) => (
                        <div key={ann.id} className="annotation-card">
                            <div className="annotation-card-header">
                                <span
                                    className={`ann-badge ann-badge--${ann.kind}`}
                                >
                                    {ann.kind}
                                </span>
                                <select
                                    className="form-input ann-type-select"
                                    value={ann.attachedToType}
                                    onChange={(e) =>
                                        handleUpdate(idx, {
                                            ...ann,
                                            attachedToType: e.target.value as
                                                | "page"
                                                | "route",
                                            attachedTo: "",
                                        })
                                    }
                                >
                                    <option value="page">Page</option>
                                    <option value="route">Route</option>
                                </select>
                                <select
                                    className="form-input ann-target-select"
                                    value={ann.attachedTo}
                                    onChange={(e) =>
                                        handleUpdate(idx, {
                                            ...ann,
                                            attachedTo: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">(select)</option>
                                    {allOptions
                                        .filter(
                                            (o) => o.type === ann.attachedToType
                                        )
                                        .map((o) => (
                                            <option key={o.id} value={o.id}>
                                                {o.label}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(idx)}
                                >
                                    ✕
                                </button>
                            </div>
                            <textarea
                                className="form-textarea"
                                placeholder="Describe what this condition/loop does…"
                                value={ann.description}
                                rows={2}
                                onChange={(e) =>
                                    handleUpdate(idx, {
                                        ...ann,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
