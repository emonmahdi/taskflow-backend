import Task from "../models/task.model";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === "Yes" || completed === true,
      owner: req.user.id,
    });

    const saved = await task.save();
    return res.status(201).json({ success: true, task: saved });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: true, message: error.message });
  }
};

// Get all Tasks For Logged In User
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Get All task this user",
      tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: true, message: err.message });
  }
};

// Get single task by Id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tasks not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: true, message: err.message });
  }
};

// Update A Task
export const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed = data.completed === "Yes" || data.completed === true;
    }

    const update = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    );

    if (!update) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found or not yours" });
    }

    return res.status(200).json({
      success: true,
      task: update,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: true, message: err.message });
  }
};

//  Delete Task
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Task Deleted Failed" });
    }

    return res.status(201).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: true, message: err.message });
  }
};
