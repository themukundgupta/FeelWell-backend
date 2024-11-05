import Mood from '../models/Mood.js';
import { AppError } from '../utils/appError.js';

export const createMood = async (req, res, next) => {
  try {
    const mood = await Mood.create({
      user: req.user.id,
      mood: req.body.mood,
      entry: req.body.entry,
      date: req.body.date,
      time: req.body.time,
      editedTime: req.body.editedTime
    });

    res.status(201).json({
      status: 'success',
      data: { mood }
    });
  } catch (error) {
    next(new AppError('Error creating mood entry', 400));
  }
};

export const getMoods = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const moods = await Mood.find(query).sort({ date: -1, time: -1 });

    res.status(200).json({
      status: 'success',
      data: { moods }
    });
  } catch (error) {
    next(new AppError('Error fetching mood entries', 400));
  }
};

export const updateMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        mood: req.body.mood,
        entry: req.body.entry,
        editedTime: req.body.editedTime
      },
      { new: true, runValidators: true }
    );

    if (!mood) {
      return next(new AppError('No mood entry found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { mood }
    });
  } catch (error) {
    next(new AppError('Error updating mood entry', 400));
  }
};

export const deleteMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!mood) {
      return next(new AppError('No mood entry found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(new AppError('Error deleting mood entry', 400));
  }
};