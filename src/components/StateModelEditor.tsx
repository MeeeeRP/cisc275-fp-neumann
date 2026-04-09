import type { Project, StateModel, StateAttribute, SecondaryDataclass } from "../models/types";
import { generateId } from "../models/defaults";

interface StateModelEditorProps {
    project: Project;
    onUpdate: (project: Project) => void;
}

function AttributeRow({
    attr,
    onChange,
    onDelete,
}: {
    attr: StateAttribute;
    onChange: (updated: StateAttribute) => void;
    onDelete: () => void;
}) {
    return (
        <div className="attr-row">
            <input
                className="form-input attr-name"
                type="text"
                placeholder="name"
                value={attr.name}
                onChange={(e) => onChange({ ...attr, name: e.target.value })}
            />
            <input
                className="form-input attr-type"
                type="text"
                placeholder="type (e.g. str, int, bool)"
                value={attr.type}
                onChange={(e) => onChange({ ...attr, type: e.target.value })}
            />
            <input
                className="form-input attr-desc"
                type="text"
                placeholder="description"
                value={attr.description}
                onChange={(e) =>
                    onChange({ ...attr, description: e.target.value })
                }
            />
            <button
                className="btn btn-danger btn-sm"
                onClick={onDelete}
                title="Delete attribute"
            >
                ✕
            </button>
        </div>
    );
}

function DataclassSection({
    title,
    className,
    attributes,
    onClassNameChange,
    onAttrChange,
    onAddAttr,
    onDeleteAttr,
}: {
    title: string;
    className: string;
    attributes: StateAttribute[];
    onClassNameChange: (name: string) => void;
    onAttrChange: (idx: number, updated: StateAttribute) => void;
    onAddAttr: () => void;
    onDeleteAttr: (idx: number) => void;
}) {
    return (
        <div className="dataclass-section">
            <h3>{title}</h3>
            <div className="form-group">
                <label className="form-label">Class Name</label>
                <input
                    className="form-input"
                    type="text"
                    value={className}
                    onChange={(e) => onClassNameChange(e.target.value)}
                />
            </div>
            <div className="attr-header">
                <span>name</span>
                <span>type</span>
                <span>description</span>
                <span />
            </div>
            {attributes.map((attr, idx) => (
                <AttributeRow
                    key={attr.id}
                    attr={attr}
                    onChange={(updated) => onAttrChange(idx, updated)}
                    onDelete={() => onDeleteAttr(idx)}
                />
            ))}
            <button className="btn btn-secondary btn-sm" onClick={onAddAttr}>
                + Add Attribute
            </button>
        </div>
    );
}

export function StateModelEditor({ project, onUpdate }: StateModelEditorProps) {
    function updateModel(sm: StateModel) {
        onUpdate({ ...project, stateModel: sm });
    }

    function handlePrimaryClassNameChange(name: string) {
        updateModel({ ...project.stateModel, primaryClassName: name });
    }

    function handlePrimaryAttrChange(idx: number, updated: StateAttribute) {
        const attributes = project.stateModel.attributes.map((a, i) =>
            i === idx ? updated : a
        );
        updateModel({ ...project.stateModel, attributes });
    }

    function handleAddPrimaryAttr() {
        const newAttr: StateAttribute = {
            id: generateId(),
            name: "",
            type: "str",
            description: "",
        };
        updateModel({
            ...project.stateModel,
            attributes: [...project.stateModel.attributes, newAttr],
        });
    }

    function handleDeletePrimaryAttr(idx: number) {
        const attributes = project.stateModel.attributes.filter(
            (_, i) => i !== idx
        );
        updateModel({ ...project.stateModel, attributes });
    }

    function handleSecondaryClassNameChange(name: string) {
        const secondary: SecondaryDataclass = {
            ...project.stateModel.secondary,
            name,
        };
        updateModel({ ...project.stateModel, secondary });
    }

    function handleSecondaryAttrChange(idx: number, updated: StateAttribute) {
        const attributes = project.stateModel.secondary.attributes.map(
            (a, i) => (i === idx ? updated : a)
        );
        const secondary: SecondaryDataclass = {
            ...project.stateModel.secondary,
            attributes,
        };
        updateModel({ ...project.stateModel, secondary });
    }

    function handleAddSecondaryAttr() {
        const newAttr: StateAttribute = {
            id: generateId(),
            name: "",
            type: "str",
            description: "",
        };
        const secondary: SecondaryDataclass = {
            ...project.stateModel.secondary,
            attributes: [
                ...project.stateModel.secondary.attributes,
                newAttr,
            ],
        };
        updateModel({ ...project.stateModel, secondary });
    }

    function handleDeleteSecondaryAttr(idx: number) {
        const attributes = project.stateModel.secondary.attributes.filter(
            (_, i) => i !== idx
        );
        const secondary: SecondaryDataclass = {
            ...project.stateModel.secondary,
            attributes,
        };
        updateModel({ ...project.stateModel, secondary });
    }

    return (
        <div className="tab-content">
            <h2>State Model</h2>
            <p className="hint-text">
                Define the primary state dataclass and a secondary dataclass
                used in a list within the primary state.
            </p>

            <DataclassSection
                title="Primary State Dataclass"
                className={project.stateModel.primaryClassName}
                attributes={project.stateModel.attributes}
                onClassNameChange={handlePrimaryClassNameChange}
                onAttrChange={handlePrimaryAttrChange}
                onAddAttr={handleAddPrimaryAttr}
                onDeleteAttr={handleDeletePrimaryAttr}
            />

            <DataclassSection
                title="Secondary Dataclass"
                className={project.stateModel.secondary.name}
                attributes={project.stateModel.secondary.attributes}
                onClassNameChange={handleSecondaryClassNameChange}
                onAttrChange={handleSecondaryAttrChange}
                onAddAttr={handleAddSecondaryAttr}
                onDeleteAttr={handleDeleteSecondaryAttr}
            />
        </div>
    );
}
