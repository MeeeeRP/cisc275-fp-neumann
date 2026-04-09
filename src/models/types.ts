export interface ComponentStyle {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontFamily: string;
    border: string;
    borderRadius: string;
    padding: string;
    margin: string;
}

export interface PageStyle {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    display: string;
    flexDirection: string;
    gap: string;
    padding: string;
}

export interface TextComponent {
    id: string;
    type: "Text";
    contents: string;
    style: ComponentStyle;
}

export interface TextBoxComponent {
    id: string;
    type: "TextBox";
    name: string;
    defaultValue: string;
    style: ComponentStyle;
}

export interface TextAreaComponent {
    id: string;
    type: "TextArea";
    name: string;
    defaultValue: string;
    style: ComponentStyle;
}

export interface CheckBoxComponent {
    id: string;
    type: "CheckBox";
    name: string;
    defaultValue: boolean;
    style: ComponentStyle;
}

export interface SelectBoxComponent {
    id: string;
    type: "SelectBox";
    name: string;
    options: string[];
    defaultValue: string;
    style: ComponentStyle;
}

export interface ButtonComponent {
    id: string;
    type: "Button";
    label: string;
    route: string;
    style: ComponentStyle;
}

export interface HeaderComponent {
    id: string;
    type: "Header";
    contents: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    style: ComponentStyle;
}

export type UIComponent =
    | TextComponent
    | TextBoxComponent
    | TextAreaComponent
    | CheckBoxComponent
    | SelectBoxComponent
    | ButtonComponent
    | HeaderComponent;

export type ComponentKind = UIComponent["type"];

export const ALL_COMPONENT_KINDS: ComponentKind[] = [
    "Text",
    "TextBox",
    "TextArea",
    "CheckBox",
    "SelectBox",
    "Button",
    "Header",
];

export interface StateAttribute {
    id: string;
    name: string;
    type: string;
    description: string;
}

export interface SecondaryDataclass {
    id: string;
    name: string;
    attributes: StateAttribute[];
}

export interface StateModel {
    primaryClassName: string;
    attributes: StateAttribute[];
    secondary: SecondaryDataclass;
}

export interface PageNode {
    id: string;
    name: string;
    description: string;
    components: UIComponent[];
    style: PageStyle;
    position: { x: number; y: number };
}

export interface Route {
    id: string;
    fromPageId: string;
    toPageId: string;
    label: string;
    stateChanges: string[];
}

export interface LogicAnnotation {
    id: string;
    attachedTo: string;
    attachedToType: "page" | "route";
    kind: "if" | "for";
    description: string;
}

export interface Project {
    id: string;
    name: string;
    purpose: string;
    lastModified: string;
    pages: PageNode[];
    routes: Route[];
    stateModel: StateModel;
    annotations: LogicAnnotation[];
}

export type ProjectTab =
    | "overview"
    | "graph"
    | "pages"
    | "state"
    | "logic"
    | "export";

export type AppView =
    | { kind: "dashboard" }
    | { kind: "project"; projectId: string; tab: ProjectTab };
