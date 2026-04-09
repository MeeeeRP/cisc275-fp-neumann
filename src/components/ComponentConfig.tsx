import type { UIComponent } from "../models/types";

interface ComponentConfigProps {
    component: UIComponent;
    routeOptions: { id: string; label: string }[];
    onChange: (updated: UIComponent) => void;
}

export function ComponentConfig({
    component,
    routeOptions,
    onChange,
}: ComponentConfigProps) {
    function field(
        label: string,
        value: string,
        onChangeVal: (v: string) => void
    ) {
        return (
            <div className="form-group">
                <label className="form-label">{label}</label>
                <input
                    className="form-input"
                    type="text"
                    value={value}
                    onChange={(e) => onChangeVal(e.target.value)}
                />
            </div>
        );
    }

    switch (component.type) {
        case "Text":
            return (
                <div>
                    {field("Contents", component.contents, (v) =>
                        onChange({ ...component, contents: v })
                    )}
                </div>
            );
        case "TextBox":
            return (
                <div>
                    {field("Name", component.name, (v) =>
                        onChange({ ...component, name: v })
                    )}
                    {field("Default Value", component.defaultValue, (v) =>
                        onChange({ ...component, defaultValue: v })
                    )}
                </div>
            );
        case "TextArea":
            return (
                <div>
                    {field("Name", component.name, (v) =>
                        onChange({ ...component, name: v })
                    )}
                    {field("Default Value", component.defaultValue, (v) =>
                        onChange({ ...component, defaultValue: v })
                    )}
                </div>
            );
        case "CheckBox":
            return (
                <div>
                    {field("Name", component.name, (v) =>
                        onChange({ ...component, name: v })
                    )}
                    <div className="form-group">
                        <label className="form-label">Default Value</label>
                        <select
                            className="form-input"
                            value={String(component.defaultValue)}
                            onChange={(e) =>
                                onChange({
                                    ...component,
                                    defaultValue: e.target.value === "true",
                                })
                            }
                        >
                            <option value="false">Unchecked</option>
                            <option value="true">Checked</option>
                        </select>
                    </div>
                </div>
            );
        case "SelectBox":
            return (
                <div>
                    {field("Name", component.name, (v) =>
                        onChange({ ...component, name: v })
                    )}
                    <div className="form-group">
                        <label className="form-label">
                            Options (one per line)
                        </label>
                        <textarea
                            className="form-textarea"
                            rows={4}
                            value={component.options.join("\n")}
                            onChange={(e) => {
                                const options = e.target.value
                                    .split("\n")
                                    .filter((o) => o.trim().length > 0);
                                onChange({ ...component, options });
                            }}
                        />
                    </div>
                    {field("Default Value", component.defaultValue, (v) =>
                        onChange({ ...component, defaultValue: v })
                    )}
                </div>
            );
        case "Button":
            return (
                <div>
                    {field("Label", component.label, (v) =>
                        onChange({ ...component, label: v })
                    )}
                    <div className="form-group">
                        <label className="form-label">Route</label>
                        <select
                            className="form-input"
                            value={component.route}
                            onChange={(e) =>
                                onChange({ ...component, route: e.target.value })
                            }
                        >
                            <option value="">(no route)</option>
                            {routeOptions.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            );
        case "Header":
            return (
                <div>
                    {field("Contents", component.contents, (v) =>
                        onChange({ ...component, contents: v })
                    )}
                    <div className="form-group">
                        <label className="form-label">Level</label>
                        <select
                            className="form-input"
                            value={String(component.level)}
                            onChange={(e) => {
                                const level = parseInt(
                                    e.target.value,
                                    10
                                ) as 1 | 2 | 3 | 4 | 5 | 6;
                                onChange({ ...component, level });
                            }}
                        >
                            {([1, 2, 3, 4, 5, 6] as const).map((n) => (
                                <option key={n} value={String(n)}>
                                    H{n}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            );
    }
}
