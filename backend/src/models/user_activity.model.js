import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const userActivitySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    lastActiveAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userActivitySchema.index({ userId: 1 });
userActivitySchema.index({ sessionId: 1 });
userActivitySchema.index({ action: 1 });
userActivitySchema.index({ lastActiveAt: -1 });
userActivitySchema.index({ createdAt: -1 });

userActivitySchema.plugin(mongoosePaginate);

export default model('user_activity', userActivitySchema);
