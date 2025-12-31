import CommercialProperty from '../../../models/commercial_property.model.js';
import axios from 'axios';
import Report from '../../../models/report.model.js';

class AICalService {
  constructor() {
    this.CommercialProperty = CommercialProperty;
    this.Report = Report;
  }

  /**
   * Create a new commercial property
   * @param {Object} propertyData - Commercial property data object
   * @returns {Promise<Object>} Created commercial property object
   */
  async createCommercialProperty(propertyData) {
    try {
      const commercialProperty = new this.CommercialProperty(propertyData);
      const savedProperty = await commercialProperty.save();
      return {
        success: true,
        data: savedProperty,
        message: 'Commercial property created successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create multiple commercial properties from an array
   * @param {Array<Object>} propertiesArray - Array of commercial property data objects
   * @returns {Promise<Object>} Created commercial properties with success/failure details
   */
  async createMultipleCommercialProperties(propertiesArray) {
    try {
      // Validate that the input is an array
      if (!Array.isArray(propertiesArray)) {
        const error = new Error('Request body must be an array of property objects');
        error.statusCode = 400;
        throw error;
      }

      // Validate that the array is not empty
      if (propertiesArray.length === 0) {
        const error = new Error('Array cannot be empty');
        error.statusCode = 400;
        throw error;
      }

      console.log(propertiesArray, "propertiesArray shardul chaudhary");
      

      // Insert all properties at once
      const savedProperties = await this.CommercialProperty.insertMany(propertiesArray);

      console.log(savedProperties, "savedProperties shardul chaudhary");
      

      return {
        success: true,
        data: savedProperties,
        count: savedProperties.length,
        message: `${savedProperties.length} commercial property/properties created successfully`
      };
    } catch (error) {
      // Handle bulk write errors
      if (error.name === 'BulkWriteError') {
        const successful = error.result.insertedCount || 0;
        const failed = propertiesArray.length - successful;
        const errorMessage = `Bulk insert partially failed. ${successful} properties created, ${failed} failed.`;
        
        const bulkError = new Error(errorMessage);
        bulkError.statusCode = 207; // Multi-Status
        bulkError.data = {
          successful,
          failed,
          errors: error.writeErrors || []
        };
        throw bulkError;
      }
      
      if (error.statusCode) {
        throw error;
      }
      
      throw error;
    }
  }

  /**
   * Get all commercial properties with pagination
   * @param {Object} options - Pagination options (page, limit, search)
   * @returns {Promise<Object>} Paginated commercial properties
   */
  async getAllCommercialProperties(options = {}) {
    try {
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 10;
      const search = options.search || '';
      
      // Build search query
      let query = {};
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query = {
          $or: [
            { property_type: searchRegex },
            { postcode: searchRegex },
            { comments: searchRegex },
          ]
        };
      }
      
      const result = await this.CommercialProperty.paginate(query, {
        page,
        limit,
        sort: { createdAt: -1 }
      });

      return {
        success: true,
        data: result.docs,
        pagination: {
          current_page: result.page,
          total_pages: result.totalPages,
          total_documents: result.totalDocs,
          limit: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        },
        message: 'Commercial properties retrieved successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific commercial property by ID
   * @param {string} propertyId - Commercial property ID
   * @returns {Promise<Object>} Commercial property object
   */
  async getCommercialPropertyById(propertyId) {
    try {
      const property = await this.CommercialProperty.findById(propertyId);
      
      if (!property) {
        const error = new Error('Commercial property not found');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: property,
        message: 'Commercial property retrieved successfully'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        const castError = new Error('Invalid commercial property ID format');
        castError.statusCode = 400;
        throw castError;
      }
      throw error;
    }
  }

  /**
   * Update a commercial property by ID
   * @param {string} propertyId - Commercial property ID
   * @param {Object} updateData - Update data object
   * @returns {Promise<Object>} Updated commercial property object
   */
  async updateCommercialProperty(propertyId, updateData) {
    try {
      const property = await this.CommercialProperty.findByIdAndUpdate(
        propertyId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!property) {
        const error = new Error('Commercial property not found');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: property,
        message: 'Commercial property updated successfully'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        const castError = new Error('Invalid commercial property ID format');
        castError.statusCode = 400;
        throw castError;
      }
      throw error;
    }
  }

  /**
   * Delete a commercial property by ID
   * @param {string} propertyId - Commercial property ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteCommercialProperty(propertyId) {
    try {
      const property = await this.CommercialProperty.findByIdAndDelete(propertyId);

      if (!property) {
        const error = new Error('Commercial property not found');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: property,
        message: 'Commercial property deleted successfully'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        const castError = new Error('Invalid commercial property ID format');
        castError.statusCode = 400;
        throw castError;
      }
      throw error;
    }
  }

  /**
   * Generate a report of commercial properties
   * @returns {Promise<Object>} Report object
   */
  async generateReport(formData,userId) {
    try {

      const { postcode, address, propertyType, input , valuationType , id , epcData } = formData;

      const formattedPostcode = postcode.trim().split(/\s+/).slice(0,1).join('').toUpperCase();

      const properties = await this.CommercialProperty.find({ postcode: formattedPostcode });

      if(properties.length === 0) {
        return {
          success: false,
          message: 'No properties data found for the given postcode to give you a correct price please check the postcode or wait for the data to be updated !'
        };
      }

      /////////////////////////////////////////////////////////////////
      ///////Details of the property//////////////////////////////////
      /////////////////////////////////////////////////////////////////

      let detailPropertyData = null;
      try {
        const url = `https://api.getAddress.io/get/${id}?api-key=Sy8w71kY8UCbOPT16f8Vsw49379`;
        const response = await axios.get(url);
        detailPropertyData = response.data;
      } catch (error) {
        console.error('Error fetching property details:', error);
        detailPropertyData = null;
      }


      /////////////////////////////////////////////////////////////////
      /////EPC data of the property//////////////////////////////////
      /////////////////////////////////////////////////////////////////

      let epcDataFinal = null;
      if(epcData && epcData.address) {
        epcDataFinal = epcData;
      } else {
        epcDataFinal = null;
      }


      /////////////////////////////////////////////////////////////////
      ////GENERAL ANALYSIS OF THE PROPERTY///////////////////////////
      /////////////////////////////////////////////////////////////////

      let aiAnalysis = [];
      try {
        // OpenRouter API call to get property benefits analysis
        const openRouterApiKey = "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";
        const openRouterUrl = `https://openrouter.ai/api/v1/chat/completions`;
        
        
        const openRouterResponse = await axios.post(
          openRouterUrl,
          {
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert commercial property analyst specializing in UK property markets. Provide detailed, factual insights about commercial property benefits in specific locations."
              },
              {
                role: "user",
                content: `Analyze the commercial property benefits for this specific location:
                              
                Postcode: ${postcode}
                Address: ${address}

                Please provide exactly 10 detailed points explaining the benefits of having a commercial property in this specific area/postcode. For each point, include:
                - Specific information about proximity to amenities (transport links, shopping centers, restaurants, banks, etc.)
                - Business and commerce advantages (footfall, visibility, accessibility, etc.)
                - Local area benefits (demographics, economic activity, growth potential, etc.)
                - Any relevant infrastructure or development that would benefit commercial operations

                Format each point as a clear, detailed explanation with specific distances or proximity information where relevant. Focus on practical benefits that would help a business or commercial operation succeed in this location.`
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          },
          {
            headers: {
              'Authorization': `Bearer ${openRouterApiKey}`,
              'HTTP-Referer': 'https://99commercial.co.uk',
              'X-Title': '99 Commercial',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (openRouterResponse.data && openRouterResponse.data.choices && openRouterResponse.data.choices.length > 0) {
          const rawContent = openRouterResponse.data.choices[0].message.content;
          
          // Parse the content into structured format
          const parseAnalysis = (content) => {
            const points = [];
            let summary = '';
            let currentPoint = null;
            let currentContent = [];
            let isSummarySection = false;
            let titleFound = false;
            
            // Split by newlines but keep empty lines for context
            const lines = content.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const trimmedLine = line.trim();
              const prevLine = i > 0 ? lines[i - 1].trim() : '';
              const prevPrevLine = i > 1 ? lines[i - 2].trim() : '';
              
              // Check for "\n\nIn summary" pattern - two empty/newline lines before "In summary"
              const isSummaryStart = trimmedLine.toLowerCase().startsWith('in summary') && 
                                     (prevLine === '' || prevPrevLine === '');
              
              // Skip empty lines unless we're in summary section or checking for summary pattern
              if (!trimmedLine && !isSummarySection && !currentPoint && !isSummaryStart) {
                continue;
              }
              
              // Check if this is a numbered point (n1, n2, n3, etc.)
              const pointMatch = trimmedLine.match(/^n?(\d+)[\.\)]?\s*(.*)/i);
              
              if (pointMatch) {
                // Save previous point if exists
                if (currentPoint) {
                  currentPoint.content = currentContent.join(' ').trim();
                  points.push(currentPoint);
                }
                
                // Start new point
                const pointNumber = parseInt(pointMatch[1]);
                const restOfLine = pointMatch[2].trim();
                
                // Extract title from ** ** markers if present on same line
                const titleMatch = restOfLine.match(/\*\*(.*?)\*\*/);
                let title = '';
                let afterTitle = '';
                
                if (titleMatch) {
                  title = titleMatch[1].trim();
                  afterTitle = restOfLine.replace(/\*\*.*?\*\*/g, '').trim();
                  titleFound = true;
                } else {
                  // Title might be on next line, check next non-empty line
                  titleFound = false;
                }
                
                currentPoint = {
                  number: pointNumber,
                  title: title,
                  content: afterTitle
                };
                currentContent = afterTitle ? [afterTitle] : [];
                isSummarySection = false;
              } else if (isSummaryStart) {
                // Detected "\n\nIn summary" pattern - this is the overall summary
                // Save current point before entering summary
                if (currentPoint) {
                  currentPoint.content = currentContent.join(' ').trim();
                  points.push(currentPoint);
                  currentPoint = null;
                }
                isSummarySection = true;
                // Remove "In summary" prefix and keep the rest
                summary = trimmedLine.replace(/^in summary\s*:?\s*/i, '').trim();
              } else if (currentPoint) {
                // Check if this line contains a title in ** ** (for current point)
                const titleMatch = trimmedLine.match(/\*\*(.*?)\*\*/);
                
                if (titleMatch && !titleFound) {
                  // This is the title for the current point
                  currentPoint.title = titleMatch[1].trim();
                  titleFound = true;
                  const afterTitle = trimmedLine.replace(/\*\*.*?\*\*/g, '').trim();
                  if (afterTitle) {
                    currentContent.push(afterTitle);
                  }
                } else {
                  // Check if we're entering summary section (fallback check)
                  const lowerLine = trimmedLine.toLowerCase();
                  if ((lowerLine.includes('summary') || lowerLine.includes('conclusion') || lowerLine.includes('overall')) && 
                      (lowerLine.length < 50 || lowerLine.startsWith('summary') || lowerLine.startsWith('conclusion') || lowerLine.startsWith('in summary'))) {
                    // Save current point before entering summary
                    if (currentPoint) {
                      currentPoint.content = currentContent.join(' ').trim();
                      points.push(currentPoint);
                      currentPoint = null;
                    }
                    isSummarySection = true;
                    summary = trimmedLine.replace(/^(in\s+)?summary\s*:?\s*/i, '').trim();
                  } else if (isSummarySection) {
                    summary += (summary ? ' ' : '') + trimmedLine;
                  } else if (trimmedLine) {
                    // Regular content for current point
                    currentContent.push(trimmedLine);
                  }
                }
              } else {
                // Check if we're entering summary section (before any points)
                const lowerLine = trimmedLine.toLowerCase();
                if (lowerLine.startsWith('in summary') || 
                    ((lowerLine.includes('summary') || lowerLine.includes('conclusion')) && 
                     (lowerLine.length < 50 || lowerLine.startsWith('summary') || lowerLine.startsWith('conclusion')))) {
                  isSummarySection = true;
                  summary = trimmedLine.replace(/^(in\s+)?summary\s*:?\s*/i, '').trim();
                } else if (isSummarySection) {
                  summary += (summary ? ' ' : '') + trimmedLine;
                }
              }
            }
            
            // Save last point if exists
            if (currentPoint) {
              currentPoint.content = currentContent.join(' ').trim();
              points.push(currentPoint);
            }
            
            // If no structured points found, return original content
            if (points.length === 0) {
              return {
                points: [],
                summary: summary || content,
                raw: content
              };
            }
            
            return {
              points: points,
              summary: summary.trim(),
              raw: content
            };
          };
          
          aiAnalysis = parseAnalysis(rawContent);

        } else {
          console.error('Unexpected OpenRouter response structure:', openRouterResponse.data);
          aiAnalysis = {
            points: [],
            summary: 'Unable to generate analysis at this time',
            raw: 'Unable to generate analysis at this time'
          };
        }
      } catch (error) {
        console.error('Error fetching AI analysis:', error.message);
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received from OpenRouter API');
        }
        aiAnalysis = {
          points: [],
          summary: 'Unable to generate analysis at this time',
          raw: 'Unable to generate analysis at this time'
        };
      }

      /////////////////////////////////////////////////////////////////
      /////PREDICTIVE PRICING OF THE PROPERTY///////////////////////
      /////////////////////////////////////////////////////////////////

      function getEffectiveArea(areaSqft) {
        if (typeof areaSqft === "number") return areaSqft;
      
        const min = areaSqft?.minimum ?? 0;
        const max = areaSqft?.maximum ?? 0;
      
        if (min && max) return (min + max) / 2;
        if (min) return min;
        if (max) return max;
      
        return 0;
      }   

      function predictCommercialPrice(input, comparatives) {
        // Handle both input.areaSqft and input with direct minimum/maximum properties
        const areaSqft = input.areaSqft !== undefined ? input.areaSqft : input;
        const inputArea = getEffectiveArea(areaSqft);
      
        let weightedPA = 0;
        let weightedPCM = 0;
        let totalWeight = 0;
      
        comparatives.forEach(p => {
          const compArea = getEffectiveArea(p.sizeSQFT);
      
          const sizeDiff = Math.abs(compArea - inputArea);
      
          // Size weight (never zero, smooth decay)
          const sizeWeight = 1 / Math.log(sizeDiff + 10);
      
          // Property type influence - check if input has propertyType or use from formData
          const inputPropertyType = input.property_type || input.propertyType;
          const typeWeight =
            p.property_type === inputPropertyType ? 1 : 0.6;
      
          const finalWeight = sizeWeight * typeWeight;
      
          weightedPA += p.pricePerSqftPA * finalWeight;
          weightedPCM += p.pricePerSqftPCM * finalWeight;
          totalWeight += finalWeight;
        });
      
        if (!totalWeight || !inputArea) return null;
      
        const pricePerSqftPA = weightedPA / totalWeight;
        const pricePerSqftPCM = weightedPCM / totalWeight;
      
        const pricingPA = pricePerSqftPA * inputArea;
        const pricingPCM = pricingPA / 12;
      
        return {
          effectiveAreaSqft: Math.round(inputArea),
          pricePerSqftPA: Number(pricePerSqftPA.toFixed(2)),
          pricePerSqftPCM: Number(pricePerSqftPCM.toFixed(3)),
          pricingPA: Math.round(pricingPA),
          pricingPCM: Math.round(pricingPCM)
        };
      }

      let predictedPrice = null;
      try {
        if (input) {
          // Merge input with propertyType for type matching
          const inputWithType = {
            ...input,
            propertyType: propertyType || input.propertyType || input.property_type
          };
          predictedPrice = predictCommercialPrice(inputWithType, properties);
        }
      } catch (error) {
        console.error('Error calculating predicted price:', error);
        predictedPrice = null;
      }

      /////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////

      /////////////////////////////////////////////////////////////////
      ////////FINAL REPORT OF THE PROPERTY////////////////////////////
      /////////////////////////////////////////////////////////////////

      // Check if epcData is an error object
      // const epcDataFinal = epcData && typeof epcData === 'object' && epcData.message 
      //   ? 'no epc available' 
      //   : epcData;

      const report = new this.Report({
        location: {
          postcode: postcode,
          address: address,
          propertyType: propertyType,
          valuationType: valuationType,
          input: input || null
        },
        reportOwner: userId,
        propertyDetails: detailPropertyData,
        epcData: epcDataFinal,
        aiAnalysis: aiAnalysis,
        predictedPrice: predictedPrice,
      });

      const savedReport = await report.save();

      console.log(savedReport, "savedReport shardul chaudhary");

      return {
        success: true,
        data: {
          id: savedReport._id,
        },
        message: 'Report generated successfully'
      };

    } catch (error) {
      console.error('Error in generateReport:', error);
      return {
        success: false,
        message: 'An error occurred while generating the report',
        error: error.message
      };
    }
  }

  /**
   * Get all reports by userId
   * @param {string} userId - User ID
   * @param {Object} options - Pagination options (page, limit)
   * @returns {Promise<Object>} Paginated reports
   */
  async getReportsByUserId(userId, options = {}) {
    try {
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 10;

      const result = await this.Report.paginate(
        { reportOwner: userId },
        {
          page,
          limit,
          sort: { createdAt: -1 },
          populate: {
            path: 'reportOwner',
            select: 'name email'
          }
        }
      );

      return {
        success: true,
        data: result.docs,
        pagination: {
          current_page: result.page,
          total_pages: result.totalPages,
          total_documents: result.totalDocs,
          limit: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        },
        message: 'Reports retrieved successfully'
      };
    } catch (error) {
      if (error.name === 'CastError') {
        const castError = new Error('Invalid user ID format');
        castError.statusCode = 400;
        throw castError;
      }
      throw error;
    }
  }

  /**
   * Get a single report by _id
   * @param {string} reportId - Report ID
   * @returns {Promise<Object>} Report object
   */
  async getReportById(reportId) {
    try {
      const report = await this.Report.findById(reportId).populate({
        path: 'reportOwner',
        select: 'name email'
      });

      if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
      }

      return {
        success: true,
        data: report,
        message: 'Report retrieved successfully'
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        const castError = new Error('Invalid report ID format');
        castError.statusCode = 400;
        throw castError;
      }
      throw error;
    }
  }
}

export default AICalService;
