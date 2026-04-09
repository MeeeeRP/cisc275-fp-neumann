import type { Project } from "../models/types";
import { generateId } from "../models/defaults";

function makeTodoApp(): Project {
    const pageHomeId = generateId();
    const pageDetailId = generateId();
    const routeId = generateId();
    const routeBackId = generateId();

    return {
        id: generateId(),
        name: "Todo List App",
        purpose:
            "A simple todo list web application where users can add, complete, and delete tasks.",
        lastModified: new Date().toISOString(),
        pages: [
            {
                id: pageHomeId,
                name: "home",
                description: "Main page showing the todo list",
                components: [
                    {
                        id: generateId(),
                        type: "Header",
                        contents: "My Todo List",
                        level: 1,
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
                    {
                        id: generateId(),
                        type: "TextBox",
                        name: "new_task",
                        defaultValue: "",
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
                    {
                        id: generateId(),
                        type: "Button",
                        label: "Add Task",
                        route: routeId,
                        style: {
                            color: "",
                            backgroundColor: "#4CAF50",
                            fontSize: "",
                            fontFamily: "",
                            border: "",
                            borderRadius: "4px",
                            padding: "8px 16px",
                            margin: "",
                        },
                    },
                ],
                style: {
                    backgroundColor: "#f5f5f5",
                    color: "#333333",
                    fontFamily: "Arial, sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "24px",
                },
                position: { x: 60, y: 80 },
            },
            {
                id: pageDetailId,
                name: "task_detail",
                description: "Detail view for a specific task",
                components: [
                    {
                        id: generateId(),
                        type: "Header",
                        contents: "Task Detail",
                        level: 2,
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
                    {
                        id: generateId(),
                        type: "Text",
                        contents: "Task description goes here.",
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
                    {
                        id: generateId(),
                        type: "CheckBox",
                        name: "is_done",
                        defaultValue: false,
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
                    {
                        id: generateId(),
                        type: "Button",
                        label: "Back to List",
                        route: routeBackId,
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
                style: {
                    backgroundColor: "#ffffff",
                    color: "#333333",
                    fontFamily: "Arial, sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "24px",
                },
                position: { x: 350, y: 80 },
            },
        ],
        routes: [
            {
                id: routeId,
                fromPageId: pageHomeId,
                toPageId: pageDetailId,
                label: "view_task",
                stateChanges: ["selected_id = task.id"],
            },
            {
                id: routeBackId,
                fromPageId: pageDetailId,
                toPageId: pageHomeId,
                label: "back_to_home",
                stateChanges: [],
            },
        ],
        stateModel: {
            primaryClassName: "TodoState",
            attributes: [
                {
                    id: generateId(),
                    name: "tasks",
                    type: "list[Task]",
                    description: "All tasks in the list",
                },
                {
                    id: generateId(),
                    name: "selected_task_id",
                    type: "int",
                    description: "ID of the currently selected task",
                },
                {
                    id: generateId(),
                    name: "new_task_text",
                    type: "str",
                    description: "Text for the new task being created",
                },
                {
                    id: generateId(),
                    name: "filter",
                    type: "str",
                    description: "Current filter: all, active, completed",
                },
            ],
            secondary: {
                id: generateId(),
                name: "Task",
                attributes: [
                    {
                        id: generateId(),
                        name: "id",
                        type: "int",
                        description: "Unique task identifier",
                    },
                    {
                        id: generateId(),
                        name: "text",
                        type: "str",
                        description: "Task description",
                    },
                    {
                        id: generateId(),
                        name: "done",
                        type: "bool",
                        description: "Whether the task is completed",
                    },
                ],
            },
        },
        annotations: [
            {
                id: generateId(),
                attachedTo: pageHomeId,
                attachedToType: "page",
                kind: "for",
                description:
                    "Iterate over all tasks to display each one in the list",
            },
            {
                id: generateId(),
                attachedTo: pageHomeId,
                attachedToType: "page",
                kind: "if",
                description:
                    "If filter is 'active', only show tasks where done is False",
            },
            {
                id: generateId(),
                attachedTo: pageDetailId,
                attachedToType: "page",
                kind: "if",
                description:
                    "If task does not exist, redirect back to home page",
            },
            {
                id: generateId(),
                attachedTo: routeId,
                attachedToType: "route",
                kind: "if",
                description:
                    "If task_id is valid, navigate to detail; otherwise show error",
            },
        ],
    };
}

function makeQuizApp(): Project {
    const pageStartId = generateId();
    const pageQuestionId = generateId();
    const pageResultId = generateId();
    const routeStartId = generateId();
    const routeNextId = generateId();
    const routeFinishId = generateId();

    return {
        id: generateId(),
        name: "Quiz App",
        purpose:
            "An interactive quiz application that presents multiple-choice questions and scores the user.",
        lastModified: new Date().toISOString(),
        pages: [
            {
                id: pageStartId,
                name: "start",
                description: "Welcome screen with quiz title and start button",
                components: [
                    {
                        id: generateId(),
                        type: "Header",
                        contents: "Welcome to the Quiz!",
                        level: 1,
                        style: {
                            color: "#2c3e50",
                            backgroundColor: "",
                            fontSize: "2rem",
                            fontFamily: "",
                            border: "",
                            borderRadius: "",
                            padding: "",
                            margin: "",
                        },
                    },
                    {
                        id: generateId(),
                        type: "Text",
                        contents: "Test your knowledge with our 10-question quiz.",
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
                    {
                        id: generateId(),
                        type: "TextBox",
                        name: "player_name",
                        defaultValue: "Enter your name",
                        style: {
                            color: "",
                            backgroundColor: "",
                            fontSize: "",
                            fontFamily: "",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            padding: "8px",
                            margin: "",
                        },
                    },
                    {
                        id: generateId(),
                        type: "Button",
                        label: "Start Quiz",
                        route: routeStartId,
                        style: {
                            color: "#fff",
                            backgroundColor: "#3498db",
                            fontSize: "",
                            fontFamily: "",
                            border: "",
                            borderRadius: "6px",
                            padding: "10px 24px",
                            margin: "",
                        },
                    },
                ],
                style: {
                    backgroundColor: "#ecf0f1",
                    color: "#2c3e50",
                    fontFamily: "Georgia, serif",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "32px",
                },
                position: { x: 60, y: 60 },
            },
            {
                id: pageQuestionId,
                name: "question",
                description: "Displays current question with multiple choice answers",
                components: [
                    {
                        id: generateId(),
                        type: "Text",
                        contents: "Question 1 of 10",
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
                    {
                        id: generateId(),
                        type: "Header",
                        contents: "What is the capital of France?",
                        level: 2,
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
                    {
                        id: generateId(),
                        type: "SelectBox",
                        name: "answer",
                        options: ["London", "Paris", "Berlin", "Madrid"],
                        defaultValue: "London",
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
                    {
                        id: generateId(),
                        type: "Button",
                        label: "Next Question",
                        route: routeNextId,
                        style: {
                            color: "#fff",
                            backgroundColor: "#27ae60",
                            fontSize: "",
                            fontFamily: "",
                            border: "",
                            borderRadius: "4px",
                            padding: "8px 20px",
                            margin: "",
                        },
                    },
                    {
                        id: generateId(),
                        type: "Button",
                        label: "Finish Quiz",
                        route: routeFinishId,
                        style: {
                            color: "#fff",
                            backgroundColor: "#e74c3c",
                            fontSize: "",
                            fontFamily: "",
                            border: "",
                            borderRadius: "4px",
                            padding: "8px 20px",
                            margin: "",
                        },
                    },
                ],
                style: {
                    backgroundColor: "#ffffff",
                    color: "#2c3e50",
                    fontFamily: "Georgia, serif",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "32px",
                },
                position: { x: 350, y: 60 },
            },
            {
                id: pageResultId,
                name: "results",
                description: "Shows the final score and player performance",
                components: [
                    {
                        id: generateId(),
                        type: "Header",
                        contents: "Quiz Complete!",
                        level: 1,
                        style: {
                            color: "#27ae60",
                            backgroundColor: "",
                            fontSize: "",
                            fontFamily: "",
                            border: "",
                            borderRadius: "",
                            padding: "",
                            margin: "",
                        },
                    },
                    {
                        id: generateId(),
                        type: "Text",
                        contents: "Your score: 8/10",
                        style: {
                            color: "",
                            backgroundColor: "",
                            fontSize: "1.5rem",
                            fontFamily: "",
                            border: "",
                            borderRadius: "",
                            padding: "",
                            margin: "",
                        },
                    },
                    {
                        id: generateId(),
                        type: "Button",
                        label: "Play Again",
                        route: routeStartId,
                        style: {
                            color: "#fff",
                            backgroundColor: "#3498db",
                            fontSize: "",
                            fontFamily: "",
                            border: "",
                            borderRadius: "4px",
                            padding: "8px 20px",
                            margin: "",
                        },
                    },
                ],
                style: {
                    backgroundColor: "#f9f9f9",
                    color: "#2c3e50",
                    fontFamily: "Georgia, serif",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "32px",
                },
                position: { x: 640, y: 60 },
            },
        ],
        routes: [
            {
                id: routeStartId,
                fromPageId: pageStartId,
                toPageId: pageQuestionId,
                label: "begin_quiz",
                stateChanges: [
                    "current_question = 0",
                    "score = 0",
                    "player_name = name",
                ],
            },
            {
                id: routeNextId,
                fromPageId: pageQuestionId,
                toPageId: pageQuestionId,
                label: "next_question",
                stateChanges: [
                    "current_question += 1",
                    "score += 1 if correct else 0",
                ],
            },
            {
                id: routeFinishId,
                fromPageId: pageQuestionId,
                toPageId: pageResultId,
                label: "finish_quiz",
                stateChanges: ["final_score = score"],
            },
        ],
        stateModel: {
            primaryClassName: "QuizState",
            attributes: [
                {
                    id: generateId(),
                    name: "player_name",
                    type: "str",
                    description: "Name of the player",
                },
                {
                    id: generateId(),
                    name: "current_question",
                    type: "int",
                    description: "Index of the current question (0-based)",
                },
                {
                    id: generateId(),
                    name: "score",
                    type: "int",
                    description: "Number of correct answers so far",
                },
                {
                    id: generateId(),
                    name: "questions",
                    type: "list[Question]",
                    description: "All quiz questions",
                },
            ],
            secondary: {
                id: generateId(),
                name: "Question",
                attributes: [
                    {
                        id: generateId(),
                        name: "text",
                        type: "str",
                        description: "The question text",
                    },
                    {
                        id: generateId(),
                        name: "options",
                        type: "list[str]",
                        description: "Possible answer choices",
                    },
                    {
                        id: generateId(),
                        name: "correct",
                        type: "str",
                        description: "The correct answer option",
                    },
                ],
            },
        },
        annotations: [
            {
                id: generateId(),
                attachedTo: pageQuestionId,
                attachedToType: "page",
                kind: "if",
                description:
                    "If current_question >= len(questions), redirect to results",
            },
            {
                id: generateId(),
                attachedTo: pageQuestionId,
                attachedToType: "page",
                kind: "for",
                description: "Iterate over options list to display each answer choice",
            },
            {
                id: generateId(),
                attachedTo: pageResultId,
                attachedToType: "page",
                kind: "if",
                description: "If score >= 8, show congratulations message",
            },
            {
                id: generateId(),
                attachedTo: routeNextId,
                attachedToType: "route",
                kind: "if",
                description:
                    "If answer matches correct option, increment score",
            },
        ],
    };
}

export const DEMO_PROJECTS: Project[] = [makeTodoApp(), makeQuizApp()];
