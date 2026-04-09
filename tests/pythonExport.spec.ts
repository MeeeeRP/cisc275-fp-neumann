import { generatePython } from "../src/services/pythonExport";
import type { Project } from "../src/models/types";
import { newProject, defaultPage } from "../src/models/defaults";

function makeTestProject(): Project {
    const page1 = defaultPage("home", 0, 0);
    const page2 = defaultPage("detail", 200, 0);
    return {
        ...newProject("Test App"),
        pages: [page1, page2],
        routes: [
            {
                id: "r1",
                fromPageId: page1.id,
                toPageId: page2.id,
                label: "go_detail",
                stateChanges: [],
            },
        ],
    };
}

test("generatePython includes drafter import", () => {
    const project = makeTestProject();
    const code = generatePython(project);
    expect(code).toContain("from drafter import *");
});

test("generatePython includes primary state dataclass", () => {
    const project = makeTestProject();
    const code = generatePython(project);
    expect(code).toContain("@dataclass");
    expect(code).toContain("class AppState:");
});

test("generatePython includes route function for each page", () => {
    const project = makeTestProject();
    const code = generatePython(project);
    expect(code).toContain("def home(");
    expect(code).toContain("def detail(");
});

test("generatePython includes start_server call", () => {
    const project = makeTestProject();
    const code = generatePython(project);
    expect(code).toContain("start_server(");
});

test("generatePython includes secondary dataclass", () => {
    const project = makeTestProject();
    const code = generatePython(project);
    expect(code).toContain("class Item:");
});

test("generatePython handles empty project", () => {
    const project: Project = { ...newProject("Empty"), pages: [], routes: [] };
    const code = generatePython(project);
    expect(code).toContain("from drafter import *");
    expect(code).toContain("start_server(");
});

test("generatePython includes button components", () => {
    const page = {
        ...defaultPage("main", 0, 0),
        components: [
            {
                id: "c1",
                type: "Button" as const,
                label: "Submit",
                route: "",
                style: {
                    color: "",
                    backgroundColor: "",
                    fontSize: "",
                    fontFamily: "",
                    border: "",
                    borderRadius: "",
                    padding: "",
                    margin: "",
                },
            },
        ],
    };
    const project: Project = { ...newProject("App"), pages: [page], routes: [] };
    const code = generatePython(project);
    expect(code).toContain('drafter.button("Submit")');
});
