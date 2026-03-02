import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
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
      unique: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
    loginTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number,
      default: 0,
      description: 'Time spent in session in milliseconds',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
sessionSchema.index({ userId: 1 });
sessionSchema.index({ ipAddress: 1 });
sessionSchema.index({ loginTime: -1 });
sessionSchema.index({ logoutTime: -1 });

// Virtual to calculate time spent if logoutTime exists
sessionSchema.virtual('calculatedTimeSpent').get(function() {
  if (this.logoutTime && this.loginTime) {
    return this.logoutTime - this.loginTime;
  }
  return null;
});

// Pre-save middleware to calculate timeSpent before saving
sessionSchema.pre('save', function(next) {
  if (this.logoutTime && this.loginTime && !this.timeSpent) {
    this.timeSpent = this.logoutTime - this.loginTime;
  }
  next();
});

sessionSchema.plugin(mongoosePaginate);
export default model('session', sessionSchema);
