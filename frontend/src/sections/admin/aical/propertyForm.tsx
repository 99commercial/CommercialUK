import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface PropertyFormData {
  property_type: string;
  property_link?: string;
  postcode: string;
  pricingPCM: number;
  pricingPA: number;
  sizeSQFT: {
    minimum: number;
    maximum: number;
  };
  pricePerSqftPA: number;
  pricePerSqftPCM: number;
  comments?: string;
}

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<PropertyFormData>;
}

const propertyTypes = [
  'Office',
  'Retail',
  'Industrial',
  'Warehouse',
  'Land',
  'Leisure',
  'Healthcare',
  'Education',
  'Hotel',
  'Restaurant',
  'Student Accommodation',
  'Car Park',
  'Data Centre',
  'Other',
];

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: initialData || {
      property_type: '',
      property_link: '',
      postcode: '',
      pricingPCM: undefined,
      pricingPA: undefined,
      sizeSQFT: {
        minimum: undefined,
        maximum: undefined,
      },
      pricePerSqftPA: undefined,
      pricePerSqftPCM: undefined,
      comments: '',
    },
  });

  const validateUrl = (value: string) => {
    const urlPattern = /^https?:\/\/.+/;
    return urlPattern.test(value) || 'Please enter a valid URL';
  };

  const validatePostcode = (value: string) => {
    const postcodePattern = /^[A-Z]{2}[0-9A-Z]{1,2}$/i;
    return postcodePattern.test(value) || 'Please enter a valid postcode area (3-4 characters)';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Property Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={12}>
              <Controller
                name="property_type"
                control={control}
                rules={{ required: 'Property type is required' }}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.property_type}>
                    <InputLabel required>Property Type</InputLabel>
                    <Select {...field} label="Property Type">
                      {propertyTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.property_type && (
                      <FormHelperText>{errors.property_type.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="property_link"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value || value.trim() === '') return true;
                    return validateUrl(value);
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Link (optional)"
                    placeholder="https://example.com"
                    error={!!errors.property_link}
                    helperText={errors.property_link?.message || 'Optional'}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="postcode"
                control={control}
                rules={{
                  required: 'Postcode is required',
                  validate: validatePostcode,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Postcode"
                    placeholder="SW1A or M1"
                    error={!!errors.postcode}
                    helperText={errors.postcode?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="pricingPCM"
                control={control}
                rules={{
                  required: 'Pricing per calendar month is required',
                  min: { value: 0, message: 'Price must be positive' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label="Pricing Per Calendar Month (PCM)"
                    error={!!errors.pricingPCM}
                    helperText={errors.pricingPCM?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="pricingPA"
                control={control}
                rules={{
                  required: 'Pricing per annum is required',
                  min: { value: 0, message: 'Price must be positive' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label="Pricing Per Annum (PA)"
                    error={!!errors.pricingPA}
                    helperText={errors.pricingPA?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="sizeSQFT.minimum"
                control={control}
                rules={{
                  required: 'Minimum size is required',
                  min: { value: 0, message: 'Size must be positive' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label="Size (SQFT) - Minimum"
                    error={!!errors.sizeSQFT?.minimum}
                    helperText={errors.sizeSQFT?.minimum?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="sizeSQFT.maximum"
                control={control}
                rules={{
                  required: 'Maximum size is required',
                  min: { value: 0, message: 'Size must be positive' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label="Size (SQFT) - Maximum"
                    error={!!errors.sizeSQFT?.maximum}
                    helperText={errors.sizeSQFT?.maximum?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="pricePerSqftPA"
                control={control}
                rules={{
                  required: 'Price per sqft PA is required',
                  min: { value: 0, message: 'Price must be positive' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label="Price Per Sqft Per Annum"
                    error={!!errors.pricePerSqftPA}
                    helperText={errors.pricePerSqftPA?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="pricePerSqftPCM"
                control={control}
                rules={{
                  required: 'Price per sqft PCM is required',
                  min: { value: 0, message: 'Price must be positive' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label="Price Per Sqft Per Calendar Month"
                    error={!!errors.pricePerSqftPCM}
                    helperText={errors.pricePerSqftPCM?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="comments"
                control={control}
                rules={{
                  maxLength: { value: 2000, message: 'Comments must be less than 2000 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Comments (optional)"
                    multiline
                    rows={4}
                    error={!!errors.comments}
                    helperText={errors.comments?.message || 'Optional'}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: '#f2c514',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#f2c514',
                },
              }}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default PropertyForm;
