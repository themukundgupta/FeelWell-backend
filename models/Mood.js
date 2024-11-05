import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: [true, 'Please provide a mood']
  },
  entry: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  editedTime: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and date
moodSchema.index({ user: 1, date: 1 });

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;