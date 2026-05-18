import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mode: { type: String, enum: ['drive', 'market'], required: true },
    trigger: { type: String, enum: ['crash', 'keyword', 'manual'], required: true },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    roadType: { type: String, default: null },
    cancelled: { type: Boolean, default: false },
    sentTo: [{ name: String, phone: String }],
  },
  { timestamps: true }
);

const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);
export default Alert;