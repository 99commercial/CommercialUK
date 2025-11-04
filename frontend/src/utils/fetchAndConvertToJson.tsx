import axios, { AxiosResponse } from 'axios';

/**
 * Converts XML string to JSON object
 */
const xmlToJson = (xmlString: string): any => {
  try {
    // Use DOMParser for browser environment
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('XML parsing error: ' + parserError.textContent);
      }
      
      return xmlNodeToJson(xmlDoc.documentElement);
    } else {
      // Fallback for server-side or environments without DOMParser
      throw new Error('DOMParser not available');
    }
  } catch (error) {
    console.error('XML to JSON conversion error:', error);
    throw new Error(`Failed to convert XML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Recursively converts XML node to JSON object
 */
const xmlNodeToJson = (node: Element | Document): any => {
  const result: any = {};
  
  if (node.nodeType === 1 && node instanceof Element) { // Element node
    // Handle attributes
    if (node.attributes && node.attributes.length > 0) {
      result['@attributes'] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        result['@attributes'][attr.name] = attr.value;
      }
    }
    
    // Handle child nodes
    const children = Array.from(node.childNodes);
    const textNodes = children.filter(n => n.nodeType === 3); // Text nodes
    const elementNodes = children.filter(n => n.nodeType === 1); // Element nodes
    
    // If there are only text nodes, use text content
    if (elementNodes.length === 0 && textNodes.length > 0) {
      const textContent = textNodes.map(n => n.textContent?.trim()).join(' ').trim();
      if (textContent) {
        if (Object.keys(result).length === 0) {
          return textContent;
        }
        result['#text'] = textContent;
      }
    }
    
    // Process element nodes
    elementNodes.forEach((child) => {
      if (child instanceof Element) {
        const childName = child.nodeName;
        const childValue = xmlNodeToJson(child);
        
        if (result[childName]) {
          // If multiple children with same name, convert to array
          if (!Array.isArray(result[childName])) {
            result[childName] = [result[childName]];
          }
          result[childName].push(childValue);
        } else {
          result[childName] = childValue;
        }
      }
    });
    
    return Object.keys(result).length === 0 ? '' : result;
  }
  
  return node.textContent?.trim() || '';
};

/**
 * Converts HTML string to JSON object by extracting structured data
 */
const htmlToJson = (htmlString: string): any => {
  try {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlString, 'text/html');
      const result: any = {};
      
      // Extract meta tags
      const metaTags = htmlDoc.querySelectorAll('meta');
      result.meta = {};
      metaTags.forEach((meta) => {
        const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('itemprop');
        const content = meta.getAttribute('content');
        if (name && content) {
          result.meta[name] = content;
        }
      });
      
      // Extract title
      const title = htmlDoc.querySelector('title');
      if (title) {
        result.title = title.textContent?.trim();
      }
      
      // Extract JSON-LD structured data
      const jsonLdScripts = htmlDoc.querySelectorAll('script[type="application/ld+json"]');
      if (jsonLdScripts.length > 0) {
        result.structuredData = [];
        jsonLdScripts.forEach((script) => {
          try {
            const jsonData = JSON.parse(script.textContent || '{}');
            result.structuredData.push(jsonData);
          } catch (e) {
            console.warn('Failed to parse JSON-LD:', e);
          }
        });
      }
      
      // Extract form data if present
      const forms = htmlDoc.querySelectorAll('form');
      if (forms.length > 0) {
        result.forms = [];
        forms.forEach((form, index) => {
          const formData: any = {
            action: form.getAttribute('action') || '',
            method: form.getAttribute('method') || 'get',
            inputs: [],
          };
          
          const inputs = form.querySelectorAll('input, select, textarea');
          inputs.forEach((input: Element) => {
            const name = (input as HTMLInputElement).name;
            const value = (input as HTMLInputElement).value;
            const type = (input as HTMLInputElement).type || 'text';
            
            if (name) {
              formData.inputs.push({ name, value, type });
            }
          });
          
          result.forms.push(formData);
        });
      }
      
      // Extract links
      const links = htmlDoc.querySelectorAll('a[href]');
      if (links.length > 0) {
        result.links = Array.from(links).map((link: Element) => ({
          href: (link as HTMLAnchorElement).href,
          text: link.textContent?.trim(),
        }));
      }
      
      // Extract main content text
      const body = htmlDoc.querySelector('body');
      if (body) {
        result.bodyText = body.textContent?.trim().substring(0, 1000); // Limit to first 1000 chars
      }
      
      return result;
    } else {
      throw new Error('DOMParser not available');
    }
  } catch (error) {
    console.error('HTML to JSON conversion error:', error);
    throw new Error(`Failed to convert HTML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Detects content type from response headers or content
 */
const detectContentType = (response: AxiosResponse, content: string): string => {
  // Check Content-Type header first
  const contentType = response.headers['content-type'] || response.headers['Content-Type'] || '';
  
  if (contentType.includes('application/json') || contentType.includes('text/json')) {
    return 'json';
  }
  
  if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
    return 'xml';
  }
  
  if (contentType.includes('text/html')) {
    return 'html';
  }
  
  // Fallback: detect by content
  const trimmedContent = content.trim();
  
  if (trimmedContent.startsWith('<')) {
    if (trimmedContent.startsWith('<?xml') || trimmedContent.startsWith('<root') || trimmedContent.startsWith('<data')) {
      return 'xml';
    }
    return 'html';
  }
  
  if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
    return 'json';
  }
  
  return 'unknown';
};

/**
 * Fetches data from an external API URL and converts it to JSON format
 * Supports: JSON, XML, and HTML formats
 * 
 * @param url - The external API URL to fetch property data from
 * @returns Promise that resolves to JSON object with property data
 */
export const fetchAndConvertToJson = async (url: string): Promise<any> => {
  try {
    // Validate URL
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }
    
    // Fetch data from external API
    const response: AxiosResponse = await axios.get(url, {
      responseType: 'text', // Get as text first to handle all formats
      timeout: 30000, // 30 second timeout
      headers: {
        'Accept': '*/*', // Accept all content types
      },
    });

    console.log('response', response);
    
    const content = response.data;
    
    if (!content || typeof content !== 'string') {
      throw new Error('No content received from API');
    }
    
    // Detect content type
    const contentType = detectContentType(response, content);
    
    let jsonResult: any;
    
    // Convert based on content type
    switch (contentType) {
      case 'json':
        try {
          jsonResult = JSON.parse(content);
        } catch (error) {
          throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        break;
        
      case 'xml':
        jsonResult = xmlToJson(content);
        break;
        
      case 'html':
        jsonResult = htmlToJson(content);
        break;
        
      default:
        // Try to parse as JSON first, then fallback to plain text object
        try {
          jsonResult = JSON.parse(content);
        } catch {
          // If all else fails, return as plain text object
          jsonResult = {
            rawContent: content,
            contentType: 'unknown',
            message: 'Content type could not be determined, returning raw content',
          };
        }
    }
    
    // Return structured data with metadata
    return {
      data: jsonResult,
      metadata: {
        url,
        contentType,
        contentLength: content.length,
        timestamp: new Date().toISOString(),
      },
    };
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response received from server. Please check the URL and try again.');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
    
    throw error instanceof Error ? error : new Error('Unknown error occurred while fetching data');
  }
};

export default fetchAndConvertToJson;

