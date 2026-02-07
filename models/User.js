
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide a name'] },
  email: { 
    type: String, 
    required: [true, 'Please provide an email'], 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String },
  googleId: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  tier: { type: String, enum: ['Aspirant', 'Aristocrat', 'Sovereign'], default: 'Aspirant' },
  acquisitionsCount: { type: Number, default: 0 },
}, { timestamps: true });

// Assign Admin Role for specific email and hash password
userSchema.pre('save', async function(next) {
  // Logic for the Sovereign Admin
  if (this.email === 'manishishaa17@gmail.com') {
    this.role = 'admin';
    this.tier = 'Sovereign';
  }
  
  // Only hash password if it exists and is modified (allows Google users without passwords)
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
