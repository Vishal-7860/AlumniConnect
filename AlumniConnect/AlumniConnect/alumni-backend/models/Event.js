const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  date:      { type: String, required: true },
  location:  { type: String, required: true },
  type:      { type: String, enum: ['Meetup','Webinar','Competition','Talk','Other'], default: 'Other' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
