import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const propertyVirtualToursSchema = new Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'property',
      required: true,
    },
    virtual_tours: {
      type: [{
        tour_name: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
          description: 'Name or title of the virtual tour/link',
          validate: {
            validator: function(value) {
              return value != null && value.trim().length > 0;
            },
            message: 'Tour name cannot be empty'
          }
        },
        tour_url: {
          type: String,
          required: true,
          match: [/^https?:\/\/.+/, 'Must be a valid URL'],
          description: 'URL to the virtual tour, video, or 3D flythrough',
          validate: {
            validator: function(value) {
              return value != null && value.trim().length > 0;
            },
            message: 'Tour URL cannot be empty'
          }
        },
        link_type: {
          type: String,
          enum: [
            'Virtual Tour',
            'Video Tour',
            '3D Flythrough',
            '360° Photos',
            'Drone Footage',
            'Walkthrough Video',
            'Interactive Map',
            'Floor Plan Interactive',
            'Other',
          ],
          required: true,
          description: 'Type of virtual content',
          validate: {
            validator: function(value) {
              return value != null && value.trim().length > 0;
            },
            message: 'Link type cannot be empty'
          }
        },
        description: {
          type: String,
          trim: true,
          required: true,
          maxlength: 500,
          description: 'Optional description of the virtual tour',
          validate: {
            validator: function(value) {
              return value != null && value.trim().length > 0;
            },
            message: 'Description cannot be empty'
          }
        },
        thumbnail_url: {
          type: String,
          match: [/^https?:\/\/.+/, 'Must be a valid URL'],
          description: 'Optional thumbnail image for the tour',
          validate: {
            validator: function(value) {
              return value != null && value.trim().length > 0;
            },
            message: 'Thumbnail URL cannot be empty'
          }
        },
        // duration: {
        //   type: Number,
        //   min: 0,
        //   required: true,
        //   description: 'Duration in seconds (for videos)',
        //   validate: {
        //     validator: function(value) {
        //       return value != null && value !== '';
        //     },
        //     message: 'Duration cannot be empty'
        //   }
        // },
        // is_featured: {
        //   type: Boolean,
        //   required: true,
        //   default: false,
        //   description: 'Whether this tour should be featured prominently',
        // },
        // display_order: {
        //   type: Number,
        //   required: true,
        //   default: 0,
        //   min: 0,
        //   description: 'Order of display on property page',
        //   validate: {
        //     validator: function(value) {
        //       return value != null && value !== '';
        //     },
        //     message: 'Display order cannot be empty'
        //   }
        // },
        is_active: {
          type: Boolean,
          default: true,
          description: 'Whether this tour is currently active and visible',
        },
      }],
      default: [],
      validate: {
        validator: function(value) {
          // Allow empty array
          if (Array.isArray(value) && value.length === 0) {
            return true;
          }
          // If array has items, ensure they are valid objects
          if (Array.isArray(value) && value.length > 0) {
            return value.every(tour => 
              tour != null && 
              typeof tour === 'object' &&
              tour.tour_name != null && tour.tour_name.trim().length > 0 &&
              tour.tour_url != null && tour.tour_url.trim().length > 0 &&
              tour.link_type != null && tour.link_type.trim().length > 0 &&
              tour.description != null && tour.description.trim().length > 0 &&
              tour.thumbnail_url != null && tour.thumbnail_url.trim().length > 0
            );
          }
          return false;
        },
        message: 'Virtual tours must be an array. Empty array is allowed, but if items exist, all required fields must have non-empty values.'
      }
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
propertyVirtualToursSchema.index({ property_id: 1 });
propertyVirtualToursSchema.index({ 'virtual_tours.link_type': 1 });
propertyVirtualToursSchema.index({ 'virtual_tours.is_active': 1 });
propertyVirtualToursSchema.index({ 'virtual_tours.is_featured': 1 });
propertyVirtualToursSchema.index({ 'virtual_tours.display_order': 1 });

// Virtual for active tours
propertyVirtualToursSchema.virtual('active_tours').get(function() {
  return this.virtual_tours.filter(tour => tour.is_active);
});

// Virtual for featured tours
propertyVirtualToursSchema.virtual('featured_tours').get(function() {
  return this.virtual_tours.filter(tour => tour.is_active && tour.is_featured);
});

// Virtual for total view count
propertyVirtualToursSchema.virtual('total_view_count').get(function() {
  return this.virtual_tours.reduce((total, tour) => total + tour.view_count, 0);
});

// Method to increment view count for a specific tour
propertyVirtualToursSchema.methods.incrementViewCount = function(tourId) {
  const tour = this.virtual_tours.id(tourId);
  if (tour) {
    tour.view_count += 1;
    return this.save();
  }
  throw new Error('Tour not found');
};

export default model('property_virtual_tours', propertyVirtualToursSchema);
