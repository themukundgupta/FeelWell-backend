import Task from '../models/Task.js';
import { AppError } from '../utils/appError.js';

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      user: req.user.id,
      ...req.body
    });

    res.status(201).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(new AppError('Error creating task', 400));
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const tasks = await Task.find(query).sort({ date: -1, time: 1 });

    res.status(200).json({
      status: 'success',
      data: { tasks }
    });
  } catch (error) {
    next(new AppError('Error fetching tasks', 400));
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(new AppError('Error updating task', 400));
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(new AppError('Error deleting task', 400));
  }
};

export const toggleTaskComplete = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(new AppError('Error toggling task completion', 400));
  }
};