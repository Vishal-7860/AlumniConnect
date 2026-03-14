const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['Full-time','Internship','Part-time','Contract'], default: 'Full-time' },
  description: { type: String, default: '' },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
