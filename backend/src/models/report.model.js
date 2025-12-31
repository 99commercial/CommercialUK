import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    // Required location object
    location: {
      postcode: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      propertyType: {
        type: String,
        required: true,
        enum: ['Office', 'Retail', 'Industrial', 'Warehouse', 'Land', 'Leisure', 'Healthcare', 'Education', 'Hotel', 'Restaurant', 'Student Accommodation', 'Car Park', 'Data Centre', 'Other'],
      },
      valuationType: {
        type: String,
        required: true,
        enum: ['Letting', 'Sales', 'Sales and Letting'],
        trim: true,
      },
      input: {
        minimum: {
          type: Number,
          required: true,
          min: 0,
        },
        maximum: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    },

    reportOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    // Optional fields
    propertyDetails: {
      type: Schema.Types.Mixed,
      required: false,
    },

    epcData: {
      type: Schema.Types.Mixed,
      required: false,
    },

    aiAnalysis: {
      type: Schema.Types.Mixed,
      required: false,
    },

    predictedPrice: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.plugin(mongoosePaginate);

export default model('Report', reportSchema);

