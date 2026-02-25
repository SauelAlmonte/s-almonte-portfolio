import { model, models, Schema } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Subscriber = models.Subscriber ?? model("Subscriber", SubscriberSchema);
