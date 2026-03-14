const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  batch:     { type: String, required: true },
  branch:    { type: String, required: true },
  company:   { type: String, default: '' },
  role:      { type: String, default: '' },
  location:  { type: String, default: '' },
  linkedin:  { type: String, default: '' },
  skills:    [{ type: String }],
  mentoring: { type: Boolean, default: false },
  avatar:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
