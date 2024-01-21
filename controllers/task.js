const client = require("../database/db");
const database = client.db('openinapp');
const collections = {
  task: database.collection('task')
}

const getTaskidx = async () => {
  const result = await collections.task.findOne({}, { projection: { idx: 1, _id: 0 }, sort: { idx: -1 } });
  if(!result || !result.idx)
    return 1;
  return result.idx + 1;
}

const root = async (req, res) => {
  res.status(200).json({ message: "API Successfully Called" });
}

const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    if (!title || !due_date)
      return res.status(400).json({ error: "Mandatory params missing" });

    const taskIdx = await getTaskidx();
    await collections.task.insertOne({ idx: taskIdx, title, description: description || "", due_date });
    res.status(200).json({ message: "Task successfully created", id: taskIdx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task creation failed' });
  }
}

const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.task_id);
    if (!taskId) return res.status(400).json({ error: "Mandatory params missing" });

    const { due_date, status } = req.body;
    const updateObj = {};

    if (due_date) updateObj.due_date = due_date;
    if (status) updateObj.status = status;

    const result = await collections.task.updateOne({ idx: taskId }, { $set: updateObj });
    res.status(200).json({ message: "Task successfully updated", task: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.task_id);
    if (!taskId) return res.status(400).json({ error: "Mandatory params missing" });

    const result = await collections.task.updateMany(
      { $or: [{ idx: taskId }, { parentIdx: taskId }] },
      { $set: { deleted: true, deleted_at: new Date() } }
    );

    res.status(200).json({ message: "Task successfully deleted", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}

const getAllTasks = async (req, res) => {
  try {
    const { priority } = req.query;
    const page = parseInt(req.query.page) || 0;
    const page_size = parseInt(req.query.page_size) || 10;

    let query = {
      deleted: { $exists: false }
    }
    if(priority) query.priority = priority;

    const tasks = await collections.task.find(query).skip(page * page_size).limit(page_size).toArray();
    res.status(200).json({ message: "Tasks list successfully fetched", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

const createSubtask = async (req, res) => {
  try {
    const { task_id, title, description } = req.body;
    if (!title || !task_id)
      return res.status(400).json({ error: "Mandatory params missing" });

    const taskIdx = await getTaskidx();
    const result = await collections.task.insertOne({ idx: taskIdx, parentIdx: task_id, title, description: description || "" });
    res.status(200).json({ message: "Subtask successfully created", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Subtask creation failed' });
  }
}

const getAllSubtasks = async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const subtasks = await collections.task.find({ parentIdx: taskId }).toArray();
    res.status(200).json({ message: "Subtasks successfully fetched", subtasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch subtasks' });
  }
}

module.exports = {root, createTask, updateTask, deleteTask, getAllTasks, createSubtask, getAllSubtasks}