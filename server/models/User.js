const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    initials: { type: String },
    role: { type: String, default: 'Developer' },
    color: { type: String, default: 'blue' },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.initials) {
    this.initials = this.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
