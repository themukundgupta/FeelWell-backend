import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title']
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: ['personal', 'work', 'health', 'exercise', 'meditation', 'study', 'social']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  notes: String,
  reminder: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and date
taskSchema.index({ user: 1, date: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;