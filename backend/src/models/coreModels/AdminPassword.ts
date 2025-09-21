import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import bcrypt from 'bcryptjs';

const AdminPasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailToken: String,
  resetToken: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: 'email',
  },
  loggedSessions: {
    type: [String],
    default: [],
  }
});

// AdminPasswordSchema.index({ user: 1 });
// generating a hash
AdminPasswordSchema.methods.generateHash = function (salt: string, password: string) {
  return bcrypt.hashSync(salt + password);
};

// checking if password is valid
AdminPasswordSchema.methods.validPassword = function (salt: string, userpassword: string) {
  return bcrypt.compareSync(salt + userpassword, this.password);
};

export default mongoose.model('AdminPassword', AdminPasswordSchema);
