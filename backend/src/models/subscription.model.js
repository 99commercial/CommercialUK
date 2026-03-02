import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: false,
    },
    reportCount: {
      type: Number,
      default: 3,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled' , "not-applicable"],
      default: 'active',
    },
    listingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ isExpired: 1 });

subscriptionSchema.plugin(mongoosePaginate);

export default model('Subscription', subscriptionSchema);
