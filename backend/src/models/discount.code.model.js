import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const discountCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      length: 6,
      uppercase: true,
    },
    discount_percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expiry_date: {
      type: Date,
      required: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    usage_count: {
      type: Number,
      default: 0,
    },
    max_usage: {
      type: Number,
      required: false,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
discountCodeSchema.index({ is_active: 1 });
discountCodeSchema.index({ expiry_date: 1 });
discountCodeSchema.index({ deleted_at: 1 });

discountCodeSchema.plugin(mongoosePaginate);

export default model('DiscountCode', discountCodeSchema);
