const express = require("express");
const { root, createTask, updateTask, deleteTask, getAllTasks, createSubtask, getAllSubtasks } = require("../controllers/task");
const app = express();

app.get("/", root);

app.post("/create", createTask);

app.put("/update/:task_id", updateTask);

app.delete("/delete/:task_id", deleteTask);

app.get("/list", getAllTasks);

app.post("/subtask/create", createSubtask);

app.get("/subtasks/:taskId", getAllSubtasks);

module.exports = app;
