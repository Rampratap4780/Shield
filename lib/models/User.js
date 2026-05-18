import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
});

const userSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    contacts: {
      type: [contactSchema],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 3,
        message: 'Add 1 to 3 contacts',
      },
    },
    settings: {
      gforceThreshold: { type: Number, default: 3.5 },
      alertCountdown: { type: Number, default: 30 },
      emailBackup: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;