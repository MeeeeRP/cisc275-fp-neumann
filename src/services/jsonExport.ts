import type { Project } from "../models/types";
import { generateId } from "../models/defaults";

export function exportProjectJSON(project: Project): void {
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function importProjectJSON(
    json: string,
    existingIds: string[]
): Project {
    const parsed = JSON.parse(json) as Project;
    let id = parsed.id;
    if (existingIds.includes(id)) {
        id = generateId();
    }
    return {
        ...parsed,
        id,
        lastModified: new Date().toISOString(),
    };
}
