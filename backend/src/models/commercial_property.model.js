import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema, model } = mongoose;
const commercialPropertySchema = new Schema(
  {
    property_type: {
      type: String,
      enum: ['Office', 'Retail', 'Industrial', 'Warehouse', 'Land', 'Leisure', 'Healthcare', 'Education', 'Hotel', 'Restaurant', 'Student Accommodation', 'Car Park', 'Data Centre', 'Other'],
      required: true,
    },

    property_link: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function(v) {
          // Skip validation if value is empty (since field is not required)
          if (!v || v.trim() === '') {
            return true;
          }
          // Validate URL format - must start with http:// or https://
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please enter a valid URL',
      },
    },

    postcode: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Z]{1,2}[0-9A-Z]{1,2}$/i, 'Please enter a valid postcode area (3-4 characters)'],
    },

    pricingPCM: {
      type: Number,
      required: true,
      min: 0,
    },

    pricingPA: {
      type: Number,
      required: true,
      min: 0,
    },

    sizeSQFT: {
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

    latitude:{
      type: Number,
      required: false ,
      min: -90,
      max: 90,
    },

    longitude:{
      type: Number,
      required: false,
      min: -180,
      max: 180,
    },

    pricePerSqftPA: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerSqftPCM: {
      type: Number,
      required: true,
      min: 0,
    },

    comments: {
      type: String,
      required: false,
      default: '',
      trim: true,
      maxlength: 2000,
    },

  },
  {
    timestamps: true,
  }
);
commercialPropertySchema.plugin(mongoosePaginate);

export default model('commercialProperty', commercialPropertySchema);
