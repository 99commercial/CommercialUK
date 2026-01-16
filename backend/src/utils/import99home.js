import Property from '../models/property.model.js';
import BusinessRates from '../models/business.rates.model.js';
import Descriptions from '../models/descriptions.model.js';
import SaleTypes from '../models/sale.types.model.js';
import PropertyImages from '../models/property.images.model.js';
import PropertyDocuments from '../models/property.documents.model.js';
import PropertyFeatures from '../models/property.features.model.js';
import PropertyLocation from '../models/property.location.model.js';
import PropertyVirtualTours from '../models/property.virtual.tours.model.js';

export default async function importFirstFeedProperty(properties, userId, index) {
  try {
  if (!Array.isArray(properties) || properties.length === 0) {
    throw new Error('No properties supplied for import');
  }

  if (!userId) {
    throw new Error('A valid userId is required to import properties');
  }

  console.log(properties, 'properties');
  console.log(userId, 'userId');

  const raw = properties[index] || {};
  const timestamp = Date.now();
  const warnings = [];

  const ensureString = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    const str = String(value).trim();
    return str.length > 0 ? str : fallback;
  };

  const stripHtml = (value) => ensureString(value, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const toTitleCase = (value, fallback) => {
    const base = ensureString(value, fallback);
    return base
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const parseNumber = (value, fallback) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const str = ensureString(value, '');
    // Extract number with optional negative sign at the start
    const numericStr = str.match(/-?\d+\.?\d*/)?.[0] || '';
    const numeric = parseFloat(numericStr);
    return Number.isFinite(numeric) ? numeric : fallback;
  };

  const mapPropertyType = (category) => {
    const lookup = {
      office: 'Office',
      retail: 'Retail',
      shop: 'Retail',
      industrial: 'Industrial',
      warehouse: 'Warehouse',
      land: 'Land',
      leisure: 'Leisure',
      health: 'Healthcare',
      healthcare: 'Healthcare',
      education: 'Education',
      hotel: 'Hotel',
      restaurant: 'Restaurant',
      student: 'Student Accommodation',
      accommodation: 'Student Accommodation',
      car: 'Car Park',
      data: 'Data Centre',
    };
    const key = ensureString(category, '').toLowerCase();
    const match = Object.entries(lookup).find(([needle]) => key.includes(needle));
    return match ? match[1] : 'Other';
  };

  const mapSaleStatus = (status) => {
    const key = ensureString(status, 'available').toLowerCase();
    if (['under offer', 'under_offer'].includes(key)) return 'Under Offer';
    if (key === 'sold') return 'Sold';
    if (key === 'let') return 'Let';
    if (key === 'withdrawn') return 'Withdrawn';
    return 'Available';
  };

  const mapSaleType = (transaction) => {
    const key = ensureString(transaction, '').toLowerCase();
    if (key === 'sales' || key === 'sale') return 'For Sale';
    if (key === 'lettings' || key === 'rent') return 'To Let';
    return 'Leasehold';
  };

  const mapPriceUnit = (frequency) => {
    const key = ensureString(frequency, '').toLowerCase();
    if (['pm', 'per month', 'monthly'].includes(key)) return 'per month';
    if (['pa', 'per annum', 'annual'].includes(key)) return 'per annum';
    if (['psf', 'per sq ft', 'per sqft'].includes(key)) return 'per sq ft';
    if (['unit', 'per unit'].includes(key)) return 'per unit';
    return 'total';
  };

  const ensurePostcode = (postcode) => {
    const fallback = 'AA1 1AA';
    const value = ensureString(postcode, fallback).toUpperCase();
    const formatted = value.includes(' ') ? value : value.replace(/(.{3})$/, ' $1');
    return /^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$/.test(formatted) ? formatted : fallback;
  };

  const ensureDate = (value, fallback = new Date('1970-01-01T00:00:00.000Z')) => {
    if (!value) return fallback;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date;
  };

  const mapEpcRating = (value) => {
    const validRatings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Exempt', 'Not Required'];
    const normalized = ensureString(value, '').toUpperCase();
    const exactMatch = validRatings.find((rating) => rating.toUpperCase() === normalized);
    if (exactMatch) return exactMatch;
    if (['NA', 'N/A', 'NOT APPLICABLE'].includes(normalized)) return 'Not Required';
    if (['EXEMPT', 'EXEMPTED'].includes(normalized)) return 'Exempt';
    return 'Not Required';
  };

  const mapCouncilTaxBand = (value) => {
    const validBands = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Exempt', 'Not Applicable'];
    const normalized = ensureString(value, '').toUpperCase();
    const exactMatch = validBands.find((band) => band.toUpperCase() === normalized);
    if (exactMatch) return exactMatch;
    if (['NA', 'N/A', 'NOT APPLICABLE'].includes(normalized)) return 'Not Applicable';
    if (['EXEMPT', 'EXEMPTED'].includes(normalized)) return 'Exempt';
    return 'Not Applicable';
  };

  const mapPlanningStatus = (value) => {
    const validStatuses = ['Full Planning', 'Outline Planning', 'No Planning Required', 'Unknown'];
    const normalized = ensureString(value, '').toLowerCase();
    const match = validStatuses.find((status) => status.toLowerCase() === normalized);
    if (match) return match;
    if (['none', 'not required', 'no planning'].includes(normalized)) return 'No Planning Required';
    if (['full'].includes(normalized)) return 'Full Planning';
    if (['outline'].includes(normalized)) return 'Outline Planning';
    return 'Unknown';
  };

  const reference = ensureString(raw.reference || raw.ref || raw.id, `import-${timestamp}`);
  const houseName = ensureString(raw.title , `Imported Property ${reference}`);
  const addressLine1 = ensureString(raw.address_1, houseName);
  const addressLine2 = ensureString(raw.address_2, '');
  const town = ensureString(raw.town || raw.town_city, 'London');
  const county = ensureString(raw.county || raw.city, 'England');
  const postcode = ensurePostcode(raw.postcode);
  const country = raw.country_code === 'GB' ? 'United Kingdom' : ensureString(raw.country, 'United Kingdom');
  const description = stripHtml(raw.description || raw.summary || 'Imported commercial property listing.');
  const propertyType = mapPropertyType(raw.category || raw.type || '');
  const propertySubType = toTitleCase(raw.type || propertyType, 'Commercial Unit').slice(0, 100);
  const transactionType = mapSaleType(raw.transaction);
  const priceValue = parseNumber(raw.price, 0);
  const priceUnit = mapPriceUnit(raw.rent_frequency);
  const internalArea = Math.max(parseNumber(raw.internal_area, 1), 1);
  const latitude = parseNumber(raw.latitude, 0);
  const longitude = parseNumber(raw.longitude, 0);
  const createdYear = (() => {
    const candidates = [raw.updated, raw.created].map((value) => {
      const date = value ? new Date(value) : null;
      const year = date && !Number.isNaN(date.getTime()) ? date.getFullYear() : null;
      return year && year >= 1800 && year <= new Date().getFullYear() + 5 ? year : null;
    }).filter(Boolean);
    return candidates[0] || new Date().getFullYear();
  })();

  const propertyPayload = {
    listed_by: userId,
    general_details: {
      building_name: houseName.slice(0, 200),
      address: [addressLine1, addressLine2, town, postcode, country].filter(Boolean).join(', ').slice(0, 500),
      country_region: country.slice(0, 100),
      town_city: town.slice(0, 100),
      postcode,
      sale_status: mapSaleStatus(raw.status),
      property_type: propertyType,
      property_sub_type: propertySubType,
      max_eaves_height: parseNumber(raw.max_eaves_height, 0),
      size_minimum: internalArea,
      size_maximum: internalArea,
      invoice_details: `INV-${reference}-${timestamp}`.slice(0, 500),
      property_notes: `Imported ${reference} located at ${addressLine1}, ${town}. Timestamp ${timestamp}`.slice(0, 2000),
      approximate_year_of_construction: createdYear,
      expansion_capacity_percent: parseNumber(raw.expansion_capacity_percent, 0),
    },
    property_status: 'Active',
    is_active: true,
    is_featured: false,
    is_verified: false,
  };

  const propertyDocument = new Property(propertyPayload);
  const savedProperty = await propertyDocument.save();
  const propertyId = savedProperty._id;
  const propertyReferenceUpdates = {};

  const epcRatingSource = raw?.epc_rating ?? raw?.epcRating ?? raw?.energy_performance_certificate_rating ?? raw?.energy_performance_rating ?? raw?.energyEfficiencyRating ?? raw?.energy_rating ?? raw?.epc?.rating;
  const epcScoreSource = raw?.epc_score ?? raw?.epcScore ?? raw?.energy_performance_certificate_score ?? raw?.energy_performance_score ?? raw?.energyScore ?? raw?.epc?.score;
  const epcCertificateSource = raw?.epc_certificate_number ?? raw?.epcCertificateNumber ?? raw?.certificate_number ?? raw?.epc?.certificate_number;
  const epcExpirySource = raw?.epc_expiry_date ?? raw?.epcExpiryDate ?? raw?.expiry_date ?? raw?.epc?.expiry_date;

  propertyReferenceUpdates.epc = {
    rating: mapEpcRating(epcRatingSource),
    score: Math.max(0, Math.min(100, parseNumber(epcScoreSource, 0))),
    certificate_number: ensureString(epcCertificateSource, ''),
    expiry_date: ensureDate(epcExpirySource),
  };

  const councilTaxBandSource = raw?.council_tax_band ?? raw?.councilTaxBand ?? raw?.council_tax ?? raw?.councilTax ?? raw?.council?.band ?? raw?.council_tax_info?.band;
  const councilTaxAuthoritySource = raw?.council_tax_authority ?? raw?.councilTaxAuthority ?? raw?.local_authority ?? raw?.localAuthority ?? raw?.council?.authority ?? raw?.council_tax_info?.authority;

  propertyReferenceUpdates.council_tax = {
    band: mapCouncilTaxBand(councilTaxBandSource),
    authority: ensureString(councilTaxAuthoritySource, ''),
  };

  const rateableValueSource = raw?.price;
  propertyReferenceUpdates.rateable_value = parseNumber(rateableValueSource, 0);

  const planningStatusSource = raw?.planning_status ?? raw?.planningStatus ?? raw?.planning_permission_status ?? raw?.planning?.status;
  const planningApplicationNumberSource = raw?.planning_application_number ?? raw?.planningApplicationNumber ?? raw?.planning_reference ?? raw?.planning?.application_number;
  const planningDecisionDateSource = raw?.planning_decision_date ?? raw?.planningDecisionDate ?? raw?.decision_date ?? raw?.planning?.decision_date;

  propertyReferenceUpdates.planning = {
    status: mapPlanningStatus(planningStatusSource),
    application_number: ensureString(planningApplicationNumberSource, ''),
    decision_date: ensureDate(planningDecisionDateSource),
  };

  try {
    const businessRatesDocument = await BusinessRates.create({
      property_id: propertyId,
      rateable_value_gbp: parseNumber(raw.rateable_value, priceValue || 0),
      rates_payable_gbp: parseNumber(raw.deposit, priceValue || 0),
    });
    propertyReferenceUpdates.business_rates_id = businessRatesDocument._id;
  } catch (error) {
    warnings.push(`Business rates not saved: ${error.message}`);
  }

  try {
    const descriptionsDocument = await Descriptions.create({
      property_id: propertyId,
      general: description.slice(0, 2000) || 'Description not provided.',
      location: (`Located in ${town}, ${county}, ${country}.`).slice(0, 2000),
      accommodation: ('Flexible commercial accommodation imported from external feed.').slice(0, 2000),
      terms: ('Flexible terms available, contact 99home for details.').slice(0, 2000),
      specifications: ('Specification available on request.').slice(0, 2000),
    });
    propertyReferenceUpdates.descriptions_id = descriptionsDocument._id;
  } catch (error) {
    warnings.push(`Descriptions not saved: ${error.message}`);
  }

  try {
    const saleTypesDocument = await SaleTypes.create({
      property_id: propertyId,
      sale_types: [
        {
          sale_type: transactionType,
          price_currency: ensureString(raw.currency, 'GBP').toUpperCase(),
          price_value: Math.max(priceValue, 0),
          price_unit: priceUnit,
        },
      ],
    });
    propertyReferenceUpdates.sale_types_id = saleTypesDocument._id;
  } catch (error) {
    warnings.push(`Sale types not saved: ${error.message}`);
  }

  try {
    const mediaImages = raw?.media?.image;
    const imageEntries = Array.isArray(mediaImages)
      ? mediaImages
      : mediaImages && typeof mediaImages === 'object'
        ? [mediaImages]
        : [];

    const placeholderImageUrl = `https://via.placeholder.com/640x480.png?text=${encodeURIComponent(reference)}`;

    const getMimeTypeFromUrl = (url) => {
      const normalized = ensureString(url, '').toLowerCase();
      if (normalized.endsWith('.png')) return 'image/png';
      if (normalized.endsWith('.gif')) return 'image/gif';
      if (normalized.endsWith('.webp')) return 'image/webp';
      if (normalized.endsWith('.svg')) return 'image/svg+xml';
      return 'image/jpeg';
    };

    let mappedImages = imageEntries.length > 0
      ? imageEntries
          .map((image, index) => {
            const imageUrl = ensureString(image?.url, '');
            console.log(imageUrl, 'imageUrl');
            if (!imageUrl) return null;
            const caption = ensureString(image?.caption || image?.title || `${houseName} Image ${index + 1}`, `${houseName} Image ${index + 1}`).slice(0, 500);
            const fileName = imageUrl.split('/').pop() || `${reference}-${index + 1}.jpg`;
            return {
              url: imageUrl,
              caption,
              image_type: 'Photo',
              file_name: fileName,
              file_size: 0,
              mime_type: getMimeTypeFromUrl(imageUrl),
              order: index,
              is_thumbnail: index === 0,
              upload_status: 'Completed',
            };
          })
          .filter(Boolean)
      : [];

    if (mappedImages.length === 0) {
      mappedImages.push({
        url: placeholderImageUrl,
        caption: `${houseName} - Imported Image`.slice(0, 500),
        image_type: 'Photo',
        file_name: placeholderImageUrl.split('/').pop() || `${reference}.png`,
        file_size: 0,
        mime_type: 'image/png',
        order: 0,
        is_thumbnail: true,
        upload_status: 'Completed',
      });
    }

    const propertyImagesDocument = await PropertyImages.create({
      property_id: propertyId,
      images: mappedImages,
    });
    propertyReferenceUpdates.images_id = propertyImagesDocument._id;
  } catch (error) {
    warnings.push(`Images not saved: ${error.message}`);
  }

  try {
    const mediaSource = raw?.media && typeof raw.media === 'object' ? raw.media : {};
    const defaultDocumentUrl = `https://www.99home.co.uk/property/${reference}/brochure.pdf`;

    console.log(mediaSource, 'mediaSource');

    let finalListDocuments = Object.entries(mediaSource)
      .filter(([key, value]) => value && typeof value === 'object' && !Array.isArray(value))
      .map(([key, value]) => {
        const url = ensureString(value?.url, '');
        const caption = ensureString(value?.caption || value?.title || key, `${houseName} Document`);
        const fileName = url.split('/').filter(Boolean).pop() || `${reference}-${key}.pdf`;
        
        // Ensure URL is valid (starts with http:// or https://)
        const validUrl = url && /^https?:\/\/.+/.test(url) ? url : defaultDocumentUrl;
        
        // Determine mime_type based on file extension (only use valid enum values)
        const urlLower = validUrl.toLowerCase();
        let mimeType = 'application/pdf'; // default to PDF
        if (urlLower.includes('.pdf')) {
          mimeType = 'application/pdf';
        } else if (urlLower.includes('.doc') && !urlLower.includes('.docx')) {
          mimeType = 'application/msword';
        } else if (urlLower.includes('.docx')) {
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (urlLower.includes('.xls') && !urlLower.includes('.xlsx')) {
          mimeType = 'application/vnd.ms-excel';
        } else if (urlLower.includes('.xlsx')) {
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
        
        return {
          document_name: caption.slice(0, 200),
          file_url: validUrl,
          file_name: fileName.trim(),
          file_size: 0,
          mime_type: mimeType,
          document_type: 'Other',
          upload_status: 'Completed',
        };
      })
      .filter((doc) => Boolean(doc.file_url) && /^https?:\/\/.+/.test(doc.file_url));

    console.log(finalListDocuments, 'finalListDocuments');  

    if (finalListDocuments.length === 0) {
      finalListDocuments.push({
        document_name: `${houseName} Brochure`.slice(0, 200),
        file_url: defaultDocumentUrl,
        file_name: (defaultDocumentUrl.split('/').filter(Boolean).pop() || `${reference}.pdf`).trim(),
        file_size: 0,
        mime_type: 'application/pdf',
        document_type: 'Other',
        upload_status: 'Completed',
      });
    }

    const propertyDocumentsDocument = await PropertyDocuments.create({
      property_id: propertyId,
      documents: finalListDocuments,
    });

    console.log(propertyDocumentsDocument, 'propertyDocumentsDocument');  

    propertyReferenceUpdates.documents_id = propertyDocumentsDocument._id;
  } catch (error) {
    warnings.push(`Documents not saved: ${error.message}`);
  }
  
  try {
    const propertyVirtualToursDocument = await PropertyVirtualTours.create({
      property_id: propertyId,
      virtual_tours: [],
    });
    propertyReferenceUpdates.virtual_tours_id = propertyVirtualToursDocument._id;
  } catch (error) {
    warnings.push(`Virtual tours not saved: ${error.message}`);
  }

  try {
    const propertyFeaturesDocument = await PropertyFeatures.create({
      property_id: propertyId,
      features: {
        air_conditioning: 'Unknown',
        clean_room: 'Unknown',
        craneage: 'Unknown',
        laboratory: 'Unknown',
        loading_bay: 'Unknown',
        secure_yard: 'Unknown',
        yard: 'Unknown',
      },
      additional_features: [],
      feature_notes: 'Imported from external feed.',
    });
    propertyReferenceUpdates.features_id = propertyFeaturesDocument._id;
  } catch (error) {
    warnings.push(`Features not saved: ${error.message}`);
  }

  try {
    const hasValidCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
    const locationDocument = await PropertyLocation.create({
      property_id: propertyId,
      coordinates: {
        latitude: hasValidCoordinates ? latitude : 0,
        longitude: hasValidCoordinates ? longitude : 0,
      },
      address_details: {
        formatted_address: [addressLine1, addressLine2, town, county, postcode, country].filter(Boolean).join(', ').slice(0, 500),
        street_number: ensureString(raw.house_name_number, '0').slice(0, 20),
        route: addressLine1.slice(0, 200),
        locality: town.slice(0, 100),
        administrative_area_level_1: county.slice(0, 100),
        administrative_area_level_2: county.slice(0, 100) || 'County',
        country: country.slice(0, 100),
        postal_code: postcode,
      },
      map_settings: {
        disable_map_display: false,
        map_zoom_level: 15,
        map_type: 'roadmap',
      },
      geocoding_info: {
        place_id: `manual-${reference}`.slice(0, 255),
        geocoding_service: 'Manual',
        geocoding_accuracy: 'APPROXIMATE',
        geocoded_at: new Date(),
      },
      location_verified: true,
      verification_notes: 'Imported from 99home feed and set as approximate.',
    });
    propertyReferenceUpdates.location_id = locationDocument._id;
  } catch (error) {
    warnings.push(`Location not saved: ${error.message}`);
  }

  if (Object.keys(propertyReferenceUpdates).length > 0) {
    await Property.findByIdAndUpdate(propertyId, { $set: propertyReferenceUpdates });
  }

  return {
    success: true,
    propertyId,
    reference,
    warnings,
  };

} catch (err) {
  console.log(err, 'err');
  console.error('Import error:', err);
  return { success: false, error: err.message };
}
}

