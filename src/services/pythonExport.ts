import type {
    Project,
    UIComponent,
    PageNode,
    StateAttribute,
} from "../models/types";

function indent(n: number): string {
    return "    ".repeat(n);
}

function toPythonType(t: string): string {
    return t || "str";
}

function componentToCode(comp: UIComponent, ind: number): string {
    const i = indent(ind);
    switch (comp.type) {
        case "Text":
            return `${i}drafter.text("${comp.contents}")`;
        case "TextBox":
            return `${i}drafter.textbox("${comp.name}", default="${comp.defaultValue}")`;
        case "TextArea":
            return `${i}drafter.textarea("${comp.name}", default="${comp.defaultValue}")`;
        case "CheckBox":
            return `${i}drafter.checkbox("${comp.name}", default=${comp.defaultValue ? "True" : "False"})`;
        case "SelectBox":
            return `${i}drafter.selectbox("${comp.name}", options=[${comp.options.map((o) => `"${o}"`).join(", ")}], default="${comp.defaultValue}")`;
        case "Button":
            return `${i}drafter.button("${comp.label}")`;
        case "Header":
            return `${i}drafter.header${comp.level}("${comp.contents}")`;
    }
}

function defaultForType(t: string): string {
    if (t === "int") return "0";
    if (t === "bool") return "False";
    if (t === "float") return "0.0";
    if (t.startsWith("list")) return "field(default_factory=list)";
    return '""';
}

function attributeToCode(attr: StateAttribute): string {
    return `${indent(1)}${attr.name}: ${toPythonType(attr.type)} = ${defaultForType(attr.type)}`;
}

function pageToRouteFunction(
    page: PageNode,
    project: Project
): string {
    const funcName = page.name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
    const lines: string[] = [];

    // Find incoming routes to determine parameters
    const incomingRoutes = project.routes.filter(
        (r) => r.toPageId === page.id
    );
    const hasRoutes = incomingRoutes.length > 0;
    const stateParam = `state: ${project.stateModel.primaryClassName}`;
    const params = hasRoutes ? stateParam : stateParam;

    lines.push(`@route`);
    lines.push(`def ${funcName}(${params}):`);

    if (page.description) {
        lines.push(`${indent(1)}"""${page.description}"""`);
    }

    if (page.components.length === 0) {
        lines.push(`${indent(1)}return [`);
        lines.push(`${indent(2)}# TODO: add components`);
        lines.push(`${indent(1)}]`);
    } else {
        lines.push(`${indent(1)}return [`);
        for (const comp of page.components) {
            lines.push(componentToCode(comp, 2) + ",");
        }
        lines.push(`${indent(1)}]`);
    }

    return lines.join("\n");
}

export function generatePython(project: Project): string {
    const sm = project.stateModel;
    const lines: string[] = [];

    // Imports
    lines.push("from drafter import *");
    lines.push("from dataclasses import dataclass, field");
    lines.push("");

    // Secondary dataclass
    if (sm.secondary.attributes.length > 0) {
        lines.push("@dataclass");
        lines.push(`class ${sm.secondary.name}:`);
        for (const attr of sm.secondary.attributes) {
            lines.push(attributeToCode(attr));
        }
        lines.push("");
    }

    // Primary state dataclass
    lines.push("@dataclass");
    lines.push(`class ${sm.primaryClassName}:`);
    if (sm.attributes.length === 0) {
        lines.push(`${indent(1)}pass`);
    } else {
        for (const attr of sm.attributes) {
            lines.push(attributeToCode(attr));
        }
    }
    lines.push("");

    // Route functions for each page
    for (const page of project.pages) {
        lines.push(pageToRouteFunction(page, project));
        lines.push("");
    }

    // start_server call
    const firstPage =
        project.pages.length > 0 ? project.pages[0] : null;
    const firstPageName = firstPage
        ? firstPage.name
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "")
        : "index";

    lines.push(
        `start_server(${firstPageName}, initial_state=${sm.primaryClassName}())`
    );

    return lines.join("\n");
}
