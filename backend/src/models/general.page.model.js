import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const generalPageSchema = new Schema(
  {
    LegalContent: {
      type: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
          },
          description: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v);
        },
        message: 'LegalContent must be an array',
      },
    },
    // Soft delete
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
generalPageSchema.index({ deleted_at: 1 });

export default model('general_page', generalPageSchema);
