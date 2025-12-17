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
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please enter a valid URL',
      },
    },

    postcode: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$/i, 'Please enter a valid UK postcode'],
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
userSchema.plugin(mongoosePaginate);

export default model('commercialProperty', commercialPropertySchema);
