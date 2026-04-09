import type { UIComponent } from "../models/types";
import React from "react";

interface ComponentPreviewProps {
    component: UIComponent;
}

function styleFromComponent(component: UIComponent): React.CSSProperties {
    const s = component.style;
    const css: React.CSSProperties = {};
    if (s.color) css.color = s.color;
    if (s.backgroundColor) css.backgroundColor = s.backgroundColor;
    if (s.fontSize) css.fontSize = s.fontSize;
    if (s.fontFamily) css.fontFamily = s.fontFamily;
    if (s.border) css.border = s.border;
    if (s.borderRadius) css.borderRadius = s.borderRadius;
    if (s.padding) css.padding = s.padding;
    if (s.margin) css.margin = s.margin;
    return css;
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
    const style = styleFromComponent(component);

    switch (component.type) {
        case "Text":
            return (
                <p className="preview-text" style={style}>
                    {component.contents || "(empty text)"}
                </p>
            );
        case "TextBox":
            return (
                <div className="preview-field">
                    <label className="preview-label">{component.name}</label>
                    <input
                        className="preview-input"
                        type="text"
                        readOnly
                        value={component.defaultValue}
                        style={style}
                    />
                </div>
            );
        case "TextArea":
            return (
                <div className="preview-field">
                    <label className="preview-label">{component.name}</label>
                    <textarea
                        className="preview-textarea"
                        readOnly
                        value={component.defaultValue}
                        rows={3}
                        style={style}
                    />
                </div>
            );
        case "CheckBox":
            return (
                <div className="preview-field preview-checkbox">
                    <input
                        type="checkbox"
                        readOnly
                        checked={component.defaultValue}
                        style={style}
                        onChange={() => {
                            /* read-only preview */
                        }}
                    />
                    <label>{component.name}</label>
                </div>
            );
        case "SelectBox":
            return (
                <div className="preview-field">
                    <label className="preview-label">{component.name}</label>
                    <select className="preview-select" style={style} defaultValue={component.defaultValue}>
                        {component.options.map((opt) => (
                            <option
                                key={opt}
                                value={opt}
                            >
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
            );
        case "Button":
            return (
                <button className="preview-button" style={style}>
                    {component.label || "Button"}
                </button>
            );
        case "Header": {
            const lvl = component.level;
            const text = component.contents || "Heading";
            if (lvl === 1)
                return (
                    <h1 className="preview-header" style={style}>
                        {text}
                    </h1>
                );
            if (lvl === 2)
                return (
                    <h2 className="preview-header" style={style}>
                        {text}
                    </h2>
                );
            if (lvl === 3)
                return (
                    <h3 className="preview-header" style={style}>
                        {text}
                    </h3>
                );
            if (lvl === 4)
                return (
                    <h4 className="preview-header" style={style}>
                        {text}
                    </h4>
                );
            if (lvl === 5)
                return (
                    <h5 className="preview-header" style={style}>
                        {text}
                    </h5>
                );
            return (
                <h6 className="preview-header" style={style}>
                    {text}
                </h6>
            );
        }
    }
}
