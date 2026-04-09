import type {
    ComponentStyle,
    PageStyle,
    StateModel,
    PageNode,
    Project,
    ComponentKind,
    UIComponent,
} from "./types";

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function defaultComponentStyle(): ComponentStyle {
    return {
        color: "",
        backgroundColor: "",
        fontSize: "",
        fontFamily: "",
        border: "",
        borderRadius: "",
        padding: "",
        margin: "",
    };
}

export function defaultPageStyle(): PageStyle {
    return {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "16px",
    };
}

export function defaultStateModel(): StateModel {
    return {
        primaryClassName: "AppState",
        attributes: [
            {
                id: generateId(),
                name: "current_user",
                type: "str",
                description: "The currently logged-in user",
            },
            {
                id: generateId(),
                name: "items",
                type: "list[Item]",
                description: "List of items (uses secondary dataclass)",
            },
            {
                id: generateId(),
                name: "is_logged_in",
                type: "bool",
                description: "Whether the user is authenticated",
            },
            {
                id: generateId(),
                name: "selected_id",
                type: "int",
                description: "ID of the currently selected item",
            },
        ],
        secondary: {
            id: generateId(),
            name: "Item",
            attributes: [
                {
                    id: generateId(),
                    name: "id",
                    type: "int",
                    description: "Unique identifier",
                },
                {
                    id: generateId(),
                    name: "title",
                    type: "str",
                    description: "Item title",
                },
                {
                    id: generateId(),
                    name: "done",
                    type: "bool",
                    description: "Completion status",
                },
            ],
        },
    };
}

export function defaultPage(name: string, x: number, y: number): PageNode {
    return {
        id: generateId(),
        name,
        description: "",
        components: [],
        style: defaultPageStyle(),
        position: { x, y },
    };
}

export function newProject(name: string): Project {
    return {
        id: generateId(),
        name,
        purpose: "",
        lastModified: new Date().toISOString(),
        pages: [],
        routes: [],
        stateModel: defaultStateModel(),
        annotations: [],
    };
}

export function makeComponent(kind: ComponentKind): UIComponent {
    const id = generateId();
    const style = defaultComponentStyle();
    switch (kind) {
        case "Text":
            return { id, type: "Text", contents: "Sample text", style };
        case "TextBox":
            return { id, type: "TextBox", name: "input", defaultValue: "", style };
        case "TextArea":
            return {
                id,
                type: "TextArea",
                name: "textarea",
                defaultValue: "",
                style,
            };
        case "CheckBox":
            return {
                id,
                type: "CheckBox",
                name: "checkbox",
                defaultValue: false,
                style,
            };
        case "SelectBox":
            return {
                id,
                type: "SelectBox",
                name: "select",
                options: ["Option 1", "Option 2"],
                defaultValue: "Option 1",
                style,
            };
        case "Button":
            return { id, type: "Button", label: "Click me", route: "", style };
        case "Header":
            return {
                id,
                type: "Header",
                contents: "Heading",
                level: 1,
                style,
            };
    }
}
