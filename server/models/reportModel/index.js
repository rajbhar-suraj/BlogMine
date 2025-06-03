const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['blog', 'comment'],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type', // Dynamically reference either Blog or Comment model
  },
  reason: {
    type: String,
    enum: ['spam', 'inappropriate', 'harassment', 'violence', 'copyright', 'other'],
    required: true,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Report =  mongoose.model('Report', reportSchema);

module.exports = Report