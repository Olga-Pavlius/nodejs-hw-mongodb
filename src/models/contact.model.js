import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" є обов’язковим'],
      trim: true,
    },
    phoneNumber: { type: String, required: true },
    email: {
      type: String,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Поле "email" повинно містити коректну email-адресу',
      ],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: {
        values: ['work', 'home', 'personal'],
        message: 'Поле "contactType" повинно бути одним із: work, home, personal',
      },
      default: 'personal',
      required: [true, 'Поле "contactType" є обов’язковим'],
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    photo: { type: String },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
