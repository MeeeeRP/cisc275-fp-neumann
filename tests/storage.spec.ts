import {
    loadProjects,
    saveProject,
    deleteProject,
    saveProjects,
} from "../src/services/storage";
import type { Project } from "../src/models/types";
import { newProject } from "../src/models/defaults";

// Mock localStorage for Node.js test environment
const store: Record<string, string> = {};
const localStorageMock = {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
        store[key] = value;
    },
    removeItem: (key: string): void => {
        delete store[key];
    },
    clear: (): void => {
        Object.keys(store).forEach((k) => {
            delete store[k];
        });
    },
};
Object.defineProperty(global, "localStorage", { value: localStorageMock });

beforeEach(() => {
    localStorageMock.clear();
});

test("loadProjects returns empty array when nothing stored", () => {
    const result = loadProjects();
    expect(result).toEqual([]);
});

test("saveProject and loadProjects round-trip", () => {
    const project: Project = newProject("Test Project");
    saveProject(project);
    const projects = loadProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe("Test Project");
});

test("saveProject updates existing project", () => {
    const project: Project = newProject("Original");
    saveProject(project);

    const updated: Project = { ...project, name: "Updated" };
    saveProject(updated);

    const projects = loadProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe("Updated");
});

test("deleteProject removes the project", () => {
    const p1: Project = newProject("Project 1");
    const p2: Project = newProject("Project 2");
    saveProjects([p1, p2]);

    deleteProject(p1.id);

    const projects = loadProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.id).toBe(p2.id);
});

test("saveProjects replaces all projects", () => {
    const p1: Project = newProject("P1");
    saveProject(p1);

    const p2: Project = newProject("P2");
    saveProjects([p2]);

    const projects = loadProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe("P2");
});
