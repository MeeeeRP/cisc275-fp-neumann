import type { Project } from "../models/types";

const STORAGE_KEY = "drafterdrafter_projects";

export function loadProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    try {
        return JSON.parse(raw) as Project[];
    } catch {
        return [];
    }
}

export function saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function saveProject(project: Project): void {
    const projects = loadProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    const updated: Project = {
        ...project,
        lastModified: new Date().toISOString(),
    };
    if (idx >= 0) {
        projects[idx] = updated;
    } else {
        projects.push(updated);
    }
    saveProjects(projects);
}

export function deleteProject(id: string): void {
    const projects = loadProjects().filter((p) => p.id !== id);
    saveProjects(projects);
}
