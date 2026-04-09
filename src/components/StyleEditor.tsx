import type { ComponentStyle, PageStyle } from "../models/types";

interface PageStyleEditorProps {
    style: PageStyle;
    onChange: (style: PageStyle) => void;
}

interface ComponentStyleEditorProps {
    style: ComponentStyle;
    onChange: (style: ComponentStyle) => void;
}

function StyleRow({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div className="style-row">
            <label className="style-label">{label}</label>
            <input
                className="style-input"
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {type === "color" && (
                <span className="style-value">{value || "—"}</span>
            )}
        </div>
    );
}

export function PageStyleEditor({ style, onChange }: PageStyleEditorProps) {
    function set(key: keyof PageStyle, value: string) {
        onChange({ ...style, [key]: value });
    }

    return (
        <div className="style-editor">
            <h4 className="style-editor-title">Page Styles</h4>
            <StyleRow
                label="Background"
                value={style.backgroundColor}
                onChange={(v) => set("backgroundColor", v)}
                type="color"
            />
            <StyleRow
                label="Text Color"
                value={style.color}
                onChange={(v) => set("color", v)}
                type="color"
            />
            <StyleRow
                label="Font Family"
                value={style.fontFamily}
                onChange={(v) => set("fontFamily", v)}
                placeholder="e.g. Arial, sans-serif"
            />
            <div className="style-row">
                <label className="style-label">Flex Direction</label>
                <select
                    className="style-input"
                    value={style.flexDirection}
                    onChange={(e) => set("flexDirection", e.target.value)}
                >
                    <option value="column">Column</option>
                    <option value="row">Row</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                </select>
            </div>
            <StyleRow
                label="Gap"
                value={style.gap}
                onChange={(v) => set("gap", v)}
                placeholder="e.g. 8px"
            />
            <StyleRow
                label="Padding"
                value={style.padding}
                onChange={(v) => set("padding", v)}
                placeholder="e.g. 16px"
            />
        </div>
    );
}

export function ComponentStyleEditor({
    style,
    onChange,
}: ComponentStyleEditorProps) {
    function set(key: keyof ComponentStyle, value: string) {
        onChange({ ...style, [key]: value });
    }

    return (
        <div className="style-editor">
            <h4 className="style-editor-title">Component Styles</h4>
            <StyleRow
                label="Color"
                value={style.color}
                onChange={(v) => set("color", v)}
                type="color"
            />
            <StyleRow
                label="Background"
                value={style.backgroundColor}
                onChange={(v) => set("backgroundColor", v)}
                type="color"
            />
            <StyleRow
                label="Font Size"
                value={style.fontSize}
                onChange={(v) => set("fontSize", v)}
                placeholder="e.g. 16px"
            />
            <StyleRow
                label="Font Family"
                value={style.fontFamily}
                onChange={(v) => set("fontFamily", v)}
                placeholder="e.g. Arial"
            />
            <StyleRow
                label="Border"
                value={style.border}
                onChange={(v) => set("border", v)}
                placeholder="e.g. 1px solid #ccc"
            />
            <StyleRow
                label="Border Radius"
                value={style.borderRadius}
                onChange={(v) => set("borderRadius", v)}
                placeholder="e.g. 4px"
            />
            <StyleRow
                label="Padding"
                value={style.padding}
                onChange={(v) => set("padding", v)}
                placeholder="e.g. 8px"
            />
            <StyleRow
                label="Margin"
                value={style.margin}
                onChange={(v) => set("margin", v)}
                placeholder="e.g. 4px 0"
            />
        </div>
    );
}
