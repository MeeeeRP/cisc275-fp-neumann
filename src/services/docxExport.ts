import { Document, Paragraph, TextRun, HeadingLevel, Packer } from "docx";
import { saveAs } from "file-saver";
import type { Project, PageNode, UIComponent } from "../models/types";

function componentDescription(comp: UIComponent): string {
    switch (comp.type) {
        case "Text":
            return `Text: "${comp.contents}"`;
        case "TextBox":
            return `TextBox: name="${comp.name}", default="${comp.defaultValue}"`;
        case "TextArea":
            return `TextArea: name="${comp.name}", default="${comp.defaultValue}"`;
        case "CheckBox":
            return `CheckBox: name="${comp.name}", default=${String(comp.defaultValue)}`;
        case "SelectBox":
            return `SelectBox: name="${comp.name}", options=[${comp.options.join(", ")}], default="${comp.defaultValue}"`;
        case "Button":
            return `Button: label="${comp.label}"`;
        case "Header":
            return `H${comp.level}: "${comp.contents}"`;
    }
}

function pageSection(page: PageNode, project: Project): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    paragraphs.push(
        new Paragraph({
            children: [new TextRun({ text: `Page: ${page.name}`, bold: true })],
            heading: HeadingLevel.HEADING_2,
        })
    );

    if (page.description) {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun(page.description)],
            })
        );
    }

    // Routes from this page
    const outgoing = project.routes.filter(
        (r) => r.fromPageId === page.id
    );
    if (outgoing.length > 0) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Routes from this page:",
                        bold: true,
                    }),
                ],
            })
        );
        for (const route of outgoing) {
            const target = project.pages.find(
                (p) => p.id === route.toPageId
            );
            const targetName = target ? target.name : "(unknown)";
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun(
                            `  → ${targetName}${route.label ? ` (${route.label})` : ""}`
                        ),
                    ],
                    bullet: { level: 0 },
                })
            );
        }
    }

    // Components
    if (page.components.length > 0) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: "Components:", bold: true }),
                ],
            })
        );
        for (const comp of page.components) {
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun(`  • ${componentDescription(comp)}`)],
                    bullet: { level: 0 },
                })
            );
        }
    }

    // Logic annotations for this page
    const pageAnnotations = project.annotations.filter(
        (a) => a.attachedTo === page.id && a.attachedToType === "page"
    );
    if (pageAnnotations.length > 0) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({ text: "Logic Annotations:", bold: true }),
                ],
            })
        );
        for (const ann of pageAnnotations) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun(
                            `  [${ann.kind.toUpperCase()}] ${ann.description}`
                        ),
                    ],
                    bullet: { level: 0 },
                })
            );
        }
    }

    paragraphs.push(new Paragraph({ children: [] }));
    return paragraphs;
}

export async function generateDocx(project: Project): Promise<void> {
    const sm = project.stateModel;
    const children: Paragraph[] = [];

    // Title
    children.push(
        new Paragraph({
            children: [new TextRun({ text: project.name, bold: true, size: 36 })],
            heading: HeadingLevel.TITLE,
        })
    );

    if (project.purpose) {
        children.push(
            new Paragraph({
                children: [new TextRun(project.purpose)],
            })
        );
    }

    children.push(new Paragraph({ children: [] }));

    // Page Graph Summary
    children.push(
        new Paragraph({
            children: [new TextRun({ text: "Page Graph Overview", bold: true })],
            heading: HeadingLevel.HEADING_1,
        })
    );
    children.push(
        new Paragraph({
            children: [
                new TextRun(
                    `This project has ${project.pages.length} page(s) and ${project.routes.length} route(s).`
                ),
            ],
        })
    );
    for (const route of project.routes) {
        const fromPage = project.pages.find((p) => p.id === route.fromPageId);
        const toPage = project.pages.find((p) => p.id === route.toPageId);
        if (fromPage && toPage) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun(
                            `${fromPage.name} → ${toPage.name}${route.label ? ` [${route.label}]` : ""}`
                        ),
                    ],
                    bullet: { level: 0 },
                })
            );
        }
    }
    children.push(new Paragraph({ children: [] }));

    // Pages
    children.push(
        new Paragraph({
            children: [new TextRun({ text: "Pages", bold: true })],
            heading: HeadingLevel.HEADING_1,
        })
    );
    for (const page of project.pages) {
        for (const p of pageSection(page, project)) {
            children.push(p);
        }
    }

    // State Model
    children.push(
        new Paragraph({
            children: [new TextRun({ text: "State Model", bold: true })],
            heading: HeadingLevel.HEADING_1,
        })
    );
    children.push(
        new Paragraph({
            children: [
                new TextRun({ text: `Primary Class: ${sm.primaryClassName}`, bold: true }),
            ],
            heading: HeadingLevel.HEADING_2,
        })
    );
    for (const attr of sm.attributes) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun(
                        `${attr.name}: ${attr.type} — ${attr.description}`
                    ),
                ],
                bullet: { level: 0 },
            })
        );
    }
    children.push(new Paragraph({ children: [] }));

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Secondary Class: ${sm.secondary.name}`,
                    bold: true,
                }),
            ],
            heading: HeadingLevel.HEADING_2,
        })
    );
    for (const attr of sm.secondary.attributes) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun(
                        `${attr.name}: ${attr.type} — ${attr.description}`
                    ),
                ],
                bullet: { level: 0 },
            })
        );
    }
    children.push(new Paragraph({ children: [] }));

    // Logic Annotations
    children.push(
        new Paragraph({
            children: [
                new TextRun({ text: "Logic Annotations", bold: true }),
            ],
            heading: HeadingLevel.HEADING_1,
        })
    );
    for (const ann of project.annotations) {
        const target =
            ann.attachedToType === "page"
                ? project.pages.find((p) => p.id === ann.attachedTo)?.name ??
                  ann.attachedTo
                : project.routes.find((r) => r.id === ann.attachedTo)?.label ??
                  ann.attachedTo;
        children.push(
            new Paragraph({
                children: [
                    new TextRun(
                        `[${ann.kind.toUpperCase()}] on ${ann.attachedToType} "${target}": ${ann.description}`
                    ),
                ],
                bullet: { level: 0 },
            })
        );
    }

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${project.name.replace(/\s+/g, "_")}_export.docx`);
}
