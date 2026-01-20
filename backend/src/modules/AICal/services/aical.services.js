import CommercialProperty from '../../../models/commercial_property.model.js';
import axios from 'axios';
import Report from '../../../models/report.model.js';
import User from '../../../models/user.model.js';
import {emailService} from '../../../emails/auth.email.js';
import { FRONTEND_URL } from '../../../config/env.config.js';
import { PATMA_API_TOKEN } from '../../../config/env.config.js';

class AICalService {
  constructor() {
    this.CommercialProperty = CommercialProperty;
    this.Report = Report;
    this.User = User;
    this.emailService = new emailService();
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
      console.log(formattedPostcode, "formattedPostcode shardul chaudhary");

      const properties = await this.CommercialProperty.find({ postcode: formattedPostcode });

      console.log(properties, "properties shardul chaudhary");

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
        // const openRouterApiKey = "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";
        const openRouterUrl = `https://openrouter.ai/api/v1/chat/completions`;

        console.log(`Bearer ${process.env.OPENROUTERAPIKEY}`);
        
        
        
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
              'Authorization': `Bearer ${process.env.OPENROUTERAPIKEY}`,
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
            let currentRawLines = []; // Track raw lines for current point
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
              
              // Check if this is a numbered point (n1, n2, n3, etc., with or without markdown headers)
              // Match patterns like: "1.", "### 1.", "1)", "### 1. Title", etc.
              const pointMatch = trimmedLine.match(/^#*\s*n?(\d+)[\.\)]?\s*(.*)/i);
              
              if (pointMatch) {
                // Save previous point if exists
                if (currentPoint) {
                  currentPoint.content = currentContent.join(' ').trim();
                  // Set raw text for the point (all lines that belong to this point)
                  currentPoint.raw = currentRawLines.join('\n').trim();
                  // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
                  if (currentPoint.title) {
                    currentPoint.summary = currentPoint.title;
                  } else if (currentPoint.content) {
                    const firstSentence = currentPoint.content.split('.')[0];
                    currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
                  } else {
                    currentPoint.summary = '';
                  }
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
                } else if (restOfLine) {
                  // If restOfLine exists and looks like a title (not too long, doesn't end with period, starts with capital)
                  // Consider it as a title if it's less than 100 chars and doesn't look like a sentence
                  const looksLikeTitle = restOfLine.length < 100 && 
                                        !restOfLine.endsWith('.') && 
                                        restOfLine.length > 0 &&
                                        (restOfLine[0] === restOfLine[0].toUpperCase() || restOfLine.match(/^[A-Z]/));
                  
                  if (looksLikeTitle) {
                    title = restOfLine;
                    afterTitle = '';
                    titleFound = true;
                  } else {
                    // Might be content or title might be on next line
                    afterTitle = restOfLine;
                    titleFound = false;
                  }
                } else {
                  // Title might be on next line, check next non-empty line
                  titleFound = false;
                }
                
                currentPoint = {
                  number: pointNumber,
                  title: title,
                  content: afterTitle,
                  raw: '', // Will be set when point is complete
                  summary: '' // Will be set when point is complete
                };
                currentContent = afterTitle ? [afterTitle] : [];
                currentRawLines = [line]; // Start tracking raw lines for this point
                isSummarySection = false;
              } else if (isSummaryStart) {
                // Detected "\n\nIn summary" pattern - this is the overall summary
                // Save current point before entering summary
                if (currentPoint) {
                  currentPoint.content = currentContent.join(' ').trim();
                  currentPoint.raw = currentRawLines.join('\n').trim();
                  // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
                  if (currentPoint.title) {
                    currentPoint.summary = currentPoint.title;
                  } else if (currentPoint.content) {
                    const firstSentence = currentPoint.content.split('.')[0];
                    currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
                  } else {
                    currentPoint.summary = '';
                  }
                  points.push(currentPoint);
                  currentPoint = null;
                }
                isSummarySection = true;
                // Remove "In summary" prefix and keep the rest
                summary = trimmedLine.replace(/^in summary\s*:?\s*/i, '').trim();
              } else if (currentPoint) {
                // Add line to raw tracking for current point
                if (trimmedLine) {
                  currentRawLines.push(line);
                }
                
                // Check if this line contains a title in ** ** (for current point) or is a standalone title
                const titleMatch = trimmedLine.match(/\*\*(.*?)\*\*/);
                
                if (titleMatch && !titleFound) {
                  // This is the title for the current point (in bold markers)
                  currentPoint.title = titleMatch[1].trim();
                  titleFound = true;
                  const afterTitle = trimmedLine.replace(/\*\*.*?\*\*/g, '').trim();
                  if (afterTitle) {
                    currentContent.push(afterTitle);
                  }
                } else if (!titleFound && trimmedLine && 
                          trimmedLine.length < 100 && 
                          !trimmedLine.endsWith('.') &&
                          (trimmedLine[0] === trimmedLine[0].toUpperCase() || trimmedLine.match(/^[A-Z]/)) &&
                          !trimmedLine.includes('approximately') && 
                          !trimmedLine.includes('The property') &&
                          !trimmedLine.includes('This') &&
                          !trimmedLine.includes('Just') &&
                          !trimmedLine.includes('Recent')) {
                  // This looks like a standalone title (short, capitalized, no period)
                  currentPoint.title = trimmedLine;
                  titleFound = true;
                } else {
                  // Check if we're entering summary section (fallback check)
                  const lowerLine = trimmedLine.toLowerCase();
                  if ((lowerLine.includes('summary') || lowerLine.includes('conclusion') || lowerLine.includes('overall')) && 
                      (lowerLine.length < 50 || lowerLine.startsWith('summary') || lowerLine.startsWith('conclusion') || lowerLine.startsWith('in summary'))) {
                    // Save current point before entering summary
                    if (currentPoint) {
                      currentPoint.content = currentContent.join(' ').trim();
                      currentPoint.raw = currentRawLines.join('\n').trim();
                      // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
                      if (currentPoint.title) {
                        currentPoint.summary = currentPoint.title;
                      } else if (currentPoint.content) {
                        const firstSentence = currentPoint.content.split('.')[0];
                        currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
                      } else {
                        currentPoint.summary = '';
                      }
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
              currentPoint.raw = currentRawLines.join('\n').trim();
              // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
              if (currentPoint.title) {
                currentPoint.summary = currentPoint.title;
              } else if (currentPoint.content) {
                const firstSentence = currentPoint.content.split('.')[0];
                currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
              } else {
                currentPoint.summary = '';
              }
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
      ////GENERAL ANALYSIS OF THE PROPERTY///////////////////////////
      /////////////////////////////////////////////////////////////////

      let psychographicsAnalysis = [];
      try {
        // OpenRouter API call to get psychographics analysis
        const openRouterUrl = `https://openrouter.ai/api/v1/chat/completions`;

        // Calculate property dimensions from input
        const areaSqft = input.areaSqft !== undefined ? input.areaSqft : input;
        let dimensionsText = '';
        if (typeof areaSqft === 'number') {
          dimensionsText = `${areaSqft} sq ft`;
        } else if (areaSqft && (areaSqft.minimum || areaSqft.maximum)) {
          const min = areaSqft.minimum || 0;
          const max = areaSqft.maximum || 0;
          if (min && max) {
            dimensionsText = `${min} - ${max} sq ft (average: ${(min + max) / 2} sq ft)`;
          } else if (min) {
            dimensionsText = `minimum ${min} sq ft`;
          } else if (max) {
            dimensionsText = `maximum ${max} sq ft`;
          }
        }

        console.log(`Generating psychographics analysis for postcode: ${postcode}, propertyType: ${propertyType}, dimensions: ${dimensionsText}`);
        
        const psychographicsResponse = await axios.post(
          openRouterUrl,
          {
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert commercial property market analyst and consumer psychologist specializing in UK markets. You provide detailed psychographic analysis of target customers, their behaviors, values, lifestyles, and purchasing motivations relevant to commercial properties."
              },
              {
                role: "user",
                content: `Provide a comprehensive psychographics analysis for a commercial property with the following details:

                Postcode: ${postcode}
                Address: ${address}
                Property Type: ${propertyType}
                Property Size: ${dimensionsText || 'Not specified'}

                Please provide exactly 10 detailed points analyzing the psychographics of the target customer base for this commercial property. For each point, include:

                1. **Target Customer Demographics & Lifestyle**: Age groups, income levels, lifestyle preferences of people who would frequent or work in this type of property in this area.

                2. **Consumer Values & Motivations**: What values drive the target audience? (e.g., convenience, quality, sustainability, status, community)

                3. **Purchasing Behavior Patterns**: How do customers in this area typically make purchasing decisions? What influences their choices?

                4. **Work-Life Preferences**: For office/retail spaces - what are the work culture expectations? Remote work trends? Shopping habits?

                5. **Brand Affinity & Expectations**: What types of brands or businesses would resonate with the local demographic?

                6. **Social & Community Engagement**: How socially active is the target market? What community activities are they drawn to?

                7. **Technology Adoption**: How tech-savvy is the target audience? What digital experiences do they expect?

                8. **Spending Priorities**: What do people in this area prioritize spending on? Premium services, value deals, experiences?

                9. **Peak Activity Patterns**: When is the target demographic most active? Morning commuters, lunch crowds, evening shoppers, weekend visitors?

                10. **Growth Potential & Trends**: Emerging psychographic trends in this area that would benefit a business operating from this property.

                Format each point with a clear title and detailed explanation specific to this postcode, property type, and size. Be specific about the local area characteristics and how they influence consumer psychology.`
              }
            ],
            temperature: 0.7,
            max_tokens: 2500
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENROUTERAPIKEY}`,
              'HTTP-Referer': 'https://99commercial.co.uk',
              'X-Title': '99 Commercial',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (psychographicsResponse.data && psychographicsResponse.data.choices && psychographicsResponse.data.choices.length > 0) {
          const rawContent = psychographicsResponse.data.choices[0].message.content;
          
          // Parse the content into structured format
          const parsePsychographicsAnalysis = (content) => {
            const points = [];
            let summary = '';
            let currentPoint = null;
            let currentContent = [];
            let currentRawLines = []; // Track raw lines for current point
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
              
              // Check if this is a numbered point (n1, n2, n3, etc., with or without markdown headers)
              // Match patterns like: "1.", "### 1.", "1)", "### 1. Title", etc.
              const pointMatch = trimmedLine.match(/^#*\s*n?(\d+)[\.\)]?\s*(.*)/i);
              
              if (pointMatch) {
                // Save previous point if exists
                if (currentPoint) {
                  currentPoint.content = currentContent.join(' ').trim();
                  // Set raw text for the point (all lines that belong to this point)
                  currentPoint.raw = currentRawLines.join('\n').trim();
                  // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
                  if (currentPoint.title) {
                    currentPoint.summary = currentPoint.title;
                  } else if (currentPoint.content) {
                    const firstSentence = currentPoint.content.split('.')[0];
                    currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
                  } else {
                    currentPoint.summary = '';
                  }
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
                } else if (restOfLine) {
                  // If restOfLine exists and looks like a title (not too long, doesn't end with period, starts with capital)
                  // Consider it as a title if it's less than 100 chars and doesn't look like a sentence
                  const looksLikeTitle = restOfLine.length < 100 && 
                                        !restOfLine.endsWith('.') && 
                                        restOfLine.length > 0 &&
                                        (restOfLine[0] === restOfLine[0].toUpperCase() || restOfLine.match(/^[A-Z]/));
                  
                  if (looksLikeTitle) {
                    title = restOfLine;
                    afterTitle = '';
                    titleFound = true;
                  } else {
                    // Might be content or title might be on next line
                    afterTitle = restOfLine;
                    titleFound = false;
                  }
                } else {
                  // Title might be on next line, check next non-empty line
                  titleFound = false;
                }
                
                currentPoint = {
                  number: pointNumber,
                  title: title,
                  content: afterTitle,
                  raw: '', // Will be set when point is complete
                  summary: '' // Will be set when point is complete
                };
                currentContent = afterTitle ? [afterTitle] : [];
                currentRawLines = [line]; // Start tracking raw lines for this point
                isSummarySection = false;
              } else if (isSummaryStart) {
                // Detected "\n\nIn summary" pattern - this is the overall summary
                // Save current point before entering summary
                if (currentPoint) {
                  currentPoint.content = currentContent.join(' ').trim();
                  currentPoint.raw = currentRawLines.join('\n').trim();
                  // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
                  if (currentPoint.title) {
                    currentPoint.summary = currentPoint.title;
                  } else if (currentPoint.content) {
                    const firstSentence = currentPoint.content.split('.')[0];
                    currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
                  } else {
                    currentPoint.summary = '';
                  }
                  points.push(currentPoint);
                  currentPoint = null;
                }
                isSummarySection = true;
                // Remove "In summary" prefix and keep the rest
                summary = trimmedLine.replace(/^in summary\s*:?\s*/i, '').trim();
              } else if (currentPoint) {
                // Add line to raw tracking for current point
                if (trimmedLine) {
                  currentRawLines.push(line);
                }
                
                // Check if this line contains a title in ** ** (for current point) or is a standalone title
                const titleMatch = trimmedLine.match(/\*\*(.*?)\*\*/);
                
                if (titleMatch && !titleFound) {
                  // This is the title for the current point (in bold markers)
                  currentPoint.title = titleMatch[1].trim();
                  titleFound = true;
                  const afterTitle = trimmedLine.replace(/\*\*.*?\*\*/g, '').trim();
                  if (afterTitle) {
                    currentContent.push(afterTitle);
                  }
                } else if (!titleFound && trimmedLine && 
                          trimmedLine.length < 100 && 
                          !trimmedLine.endsWith('.') &&
                          (trimmedLine[0] === trimmedLine[0].toUpperCase() || trimmedLine.match(/^[A-Z]/)) &&
                          !trimmedLine.includes('approximately') && 
                          !trimmedLine.includes('The property') &&
                          !trimmedLine.includes('This') &&
                          !trimmedLine.includes('Just') &&
                          !trimmedLine.includes('Recent')) {
                  // This looks like a standalone title (short, capitalized, no period)
                  currentPoint.title = trimmedLine;
                  titleFound = true;
                } else {
                  // Check if we're entering summary section (fallback check)
                  const lowerLine = trimmedLine.toLowerCase();
                  if ((lowerLine.includes('summary') || lowerLine.includes('conclusion') || lowerLine.includes('overall')) && 
                      (lowerLine.length < 50 || lowerLine.startsWith('summary') || lowerLine.startsWith('conclusion') || lowerLine.startsWith('in summary'))) {
                    // Save current point before entering summary
                    if (currentPoint) {
                      currentPoint.content = currentContent.join(' ').trim();
                      currentPoint.raw = currentRawLines.join('\n').trim();
                      // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
                      if (currentPoint.title) {
                        currentPoint.summary = currentPoint.title;
                      } else if (currentPoint.content) {
                        const firstSentence = currentPoint.content.split('.')[0];
                        currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
                      } else {
                        currentPoint.summary = '';
                      }
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
              currentPoint.raw = currentRawLines.join('\n').trim();
              // Set summary (use title if available, otherwise first sentence or first 100 chars of content)
              if (currentPoint.title) {
                currentPoint.summary = currentPoint.title;
              } else if (currentPoint.content) {
                const firstSentence = currentPoint.content.split('.')[0];
                currentPoint.summary = firstSentence.length > 0 ? firstSentence + '.' : currentPoint.content.substring(0, 100);
              } else {
                currentPoint.summary = '';
              }
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
          
          psychographicsAnalysis = parsePsychographicsAnalysis(rawContent);

        } else {
          console.error('Unexpected OpenRouter response structure for psychographics:', psychographicsResponse.data);
          psychographicsAnalysis = {
            points: [],
            summary: 'Unable to generate psychographics analysis at this time',
            raw: 'Unable to generate psychographics analysis at this time'
          };
        }
      } catch (error) {
        console.error('Error fetching psychographics analysis:', error.message);
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received from OpenRouter API for psychographics');
        }
        psychographicsAnalysis = {
          points: [],
          summary: 'Unable to generate psychographics analysis at this time',
          raw: 'Unable to generate psychographics analysis at this time'
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
      ////////AREA DETAILS OF THE PROPERTY////////////////////////////
      /////////////////////////////////////////////////////////////////

      const encodedPostcode = encodeURIComponent(postcode);
      const patmaToken = PATMA_API_TOKEN;

      // Fetch Crime Data
      let crimeData = null;
      try {
        const crimeResponse = await axios.get(
          `https://app.patma.co.uk/api/prospector/v1/crime/?postcode=${encodedPostcode}&token=${patmaToken}`
        );
        const data = crimeResponse.data;
        // Check if data is valid (not null/empty)
        const isValidData = data.status === 'success' && 
          data.data?.crime_rating !== null && 
          data.data?.population !== null &&
          data.data?.crimes_last_12m?.total > 0;
        
        if (isValidData) {
          crimeData = data;
        }
      } catch (error) {
        console.error('Error fetching crime data:', error.message);
      }

      // Fetch Article 4 Data
      let article4Data = null;
      try {
        const article4Response = await axios.get(
          `https://app.patma.co.uk/api/prospector/v1/article4/?postcode=${encodedPostcode}&token=${patmaToken}`
        );
        const data = article4Response.data;
        if (data.status === 'success') {
          article4Data = data;
        }
      } catch (error) {
        console.error('Error fetching Article 4 data:', error.message);
      }

      // Fetch BRMA/LHA Data
      let brmaLhaData = null;
      try {
        const brmaLhaResponse = await axios.get(
          `https://app.patma.co.uk/api/prospector/v1/brma-lha-lookup/?postcode=${encodedPostcode}&token=${patmaToken}`
        );
        const data = brmaLhaResponse.data;
        if (data.status === 'success' && data.data?.brma_name) {
          brmaLhaData = data;
        }
      } catch (error) {
        console.error('Error fetching BRMA/LHA data:', error.message);
      }

      // Fetch Demographics Data
      let demographicsData = null;
      try {
        const demographicsResponse = await axios.get(
          `https://app.patma.co.uk/api/prospector/v2/demographics/?postcode=${encodedPostcode}&token=${patmaToken}`
        );
        const data = demographicsResponse.data;
        if (data.status === 'success' && data.data) {
          demographicsData = data;
        }
      } catch (error) {
        console.error('Error fetching Demographics data:', error.message);
      }

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
        psychographicsAnalysis: psychographicsAnalysis,
        predictedPrice: predictedPrice,
        crimeData: crimeData,
        article4Data: article4Data,
        brmaLhaData: brmaLhaData,
        demographicsData: demographicsData,
      });

      const savedReport = await report.save();

      console.log(savedReport, "savedReport shardul chaudhary");

      const reportLink = `${FRONTEND_URL}/report/${savedReport._id}`;
      const user = await this.User.findById(userId);
      const email = user.email;
      const firstName = user.firstName;
      const lastName = user.lastName;

      await this.emailService.sendEvaluatedReportEmail(email, reportLink, firstName, lastName);

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

  /**
   * Get HMRC Business Rates data
   * @returns {Promise<Object>} Business rates data
   */
  async getBusinessRates(postcode) {
    try {
      if (!postcode) {
        throw new Error('Postcode is required');
      }
      
      const encodedPostcode = encodeURIComponent(postcode);

      console.log(encodedPostcode, "encodedPostcode shardul chaudhary");

      // Step 1: Get OAuth access token using axios auth option
      const tokenRes = await axios.post(
        'https://test-api.service.hmrc.gov.uk/oauth/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.CLIENT_API_ID,
          client_secret: process.env.CLIENT_API_SECRET,
        }).toString(),
        {
          auth: {
            username: process.env.CLIENT_API_ID,
            password: process.env.CLIENT_API_SECRET,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const accessToken = tokenRes.data.access_token;

      console.log(accessToken, "accessToken shardul chaudhary");

      if (!accessToken) {
        throw new Error('Failed to obtain HMRC access token');
      }

      // Step 2: Call Business Rates API with the token
      const res = await axios.get(
        'https://test-api.service.hmrc.gov.uk/business-rates/non-domestic-rating-multiplier',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );
      
      console.log(res.data);

      return {
        success: true,
        data: ratesRes.data,
        message: 'Business rates data retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching HMRC business rates:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error_description ||
        error.message || 
        'Failed to fetch business rates data'
      );
    }
  }
}

export default AICalService;
