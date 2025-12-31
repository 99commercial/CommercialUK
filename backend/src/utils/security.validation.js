// securityMiddleware.js
function toStringSafe(value) {
    // Convert any primitive / object to a stable string for inspection
    try {
      if (typeof value === 'string') return value;
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    } catch (e) {
      return String(value);
    }
  }
  
  function isMaliciousString(s) {
    if (!s || typeof s !== 'string') return false;
    const str = s.trim();
  
    // Check if it's a valid URL - if so, skip certain checks that would cause false positives
    const isUrl = /^https?:\/\/[^\s<>"']+$/i.test(str) || /^[a-z][a-z0-9+.-]*:\/\/[^\s<>"']+$/i.test(str);
  
    // Common injection / malicious patterns (broad coverage)
    const patterns = [
      // HTML / XSS - but not in URLs
      /<\s*script\b[^>]*>/i,              // script tags (more specific)
      /<\/?\s*(script|iframe|object|embed|form|input|textarea|select|button|link|meta|style)\b[^>]*>/i,  // specific dangerous HTML tags
      /\bon\w+\s*=/i,                     // onerror=, onclick= handlers
      /javascript:\s*[^\/]/i,             // javascript: urls (but not javascript://)
  
      // JS code injection / eval / constructors
      /\b(eval|Function|new Function|setTimeout|setInterval|import\(|require\()\s*\(/i,  // require function call
      /(document|window|location|globalThis)\s*\.\s*(write|innerHTML|outerHTML|eval|exec)/i,  // dangerous DOM methods
  
      // SQL injection patterns
      /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bTRUNCATE\b|\bALTER\b|\bCREATE\b|\bREPLACE\b|\bMERGE\b|\bGRANT\b|\bREVOKE\b)\s+.*\s+(FROM|INTO|TABLE|DATABASE|USER)/i,  // SQL statements with context
      /(\bUNION\b.*\bSELECT\b)/i,
      /(--\s+|\/\*|\*\/)/,                // SQL comments: --, /*, */ (removed standalone #)
      /#\s*(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|WHERE)/i,  // # only when followed by SQL keywords
      /(['"`])\s*or\s+1\s*=\s*1/i,         // tautology ' OR 1=1
      /\bWHERE\b.*=.*\bOR\b.*=/i,
  
      // NoSQL / MongoDB injection
      /"\s*\$where\s*":/i,
      /\$\s*(where|ne|gt|lt|gte|lte|regex|in|nin|or|and)\s*:/i,  // MongoDB operators in object context
      /ObjectId\s*\(/i,
  
      // LDAP, XPath patterns
      /\b(&\(uid|cn\)=|\(|\)\s*=\s*)/i,    // crude LDAP/XPath-ish hints
  
      // Command injection / shell - but not in URLs
      /(;\s*(rm|del|format|mkfs|dd|shutdown|reboot|killall)|&&\s*(rm|del|format|mkfs|dd|shutdown|reboot|killall)|\|\|\s*(rm|del|format|mkfs|dd|shutdown|reboot|killall))/i,  // dangerous commands
      /`[^`]*\$\{/i,                       // template literals with ${}
      /\$\([^)]*(rm|del|format|mkfs|dd|shutdown|reboot|killall)/i,  // command substitution with dangerous commands
      /\b(nc|netcat|bash|sh|powershell|cmd\.exe)\s+(-c|-e|-l|-p)/i,  // shell commands with dangerous flags
  
      // CRLF / header injection - but not in URLs
      /(\r\n|\n\r|\r|\n)\s*(Host:|GET|POST|PUT|DELETE|PATCH|HTTP\/|Content-Type:|Content-Length:|Authorization:)/i,  // HTTP headers
  
      // Template injection / server-side template languages
      /\{\{\s*(eval|exec|system|import|include|require)\s*[^}]*\}\}/i,  // template injection with dangerous functions
      /<%\s*(eval|exec|system|import|include|require)\s*[^%]*%>/i,      // EJS / ERB style with dangerous functions
      /\$\{\s*(eval|exec|system|import|include|require)\s*[^}]*\}/i,   // ${...} with dangerous functions
  
      // Encoded payloads (data URIs / base64 with script)
      /data:\s*text\/html[^,]*base64/i,
      /data:\s*image\/svg\+xml[^,]*base64[^,]*<script/i,
  
      // Generic suspicious characters often used in injections
      /[\x00-\x08\x0B\x0C\x0E-\x1F]/,     // control chars
    ];
  
    // If it's a URL, skip patterns that commonly appear in URLs
    if (isUrl) {
      // Only check for the most dangerous patterns even in URLs
      const urlSafePatterns = [
        /<\s*script\b[^>]*>/i,
        /javascript:\s*[^\/]/i,
        /\b(eval|Function|new Function|setTimeout|setInterval|import\(|require\()\s*\(/i,
        /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bTRUNCATE\b|\bALTER\b|\bCREATE\b)\s+.*\s+(FROM|INTO|TABLE|DATABASE|USER)/i,
        /(\r\n|\n\r|\r|\n)\s*(Host:|GET|POST|PUT|DELETE|PATCH|HTTP\/|Content-Type:|Content-Length:|Authorization:)/i,
        /[\x00-\x08\x0B\x0C\x0E-\x1F]/,
      ];
      return urlSafePatterns.some((re) => re.test(str));
    }
  
    return patterns.some((re) => re.test(str));
  }
  
  function traverseAndCheck(obj, path = '') {
    // returns { ok: true } or { ok: false, path, value }
    if (obj === null || obj === undefined) return { ok: true };
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'bigint') {
      const str = toStringSafe(obj);
      if (isMaliciousString(str)) return { ok: false, path, value: str };
      return { ok: true };
    }
  
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const res = traverseAndCheck(obj[i], `${path}[${i}]`);
        if (!res.ok) return res;
      }
      return { ok: true };
    }
  
    if (typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        const nextPath = path ? `${path}.${key}` : key;
        const res = traverseAndCheck(obj[key], nextPath);
        if (!res.ok) return res;
      }
      return { ok: true };
    }
  
    // fallback for functions/symbols/etc.
    const str = toStringSafe(obj);
    if (isMaliciousString(str)) return { ok: false, path, value: str };
    return { ok: true };
  }
  
  /**
   * Express middleware: checks req.body, req.query, req.params for injections.
   * If malicious input is found -> 400 with offending path.
   */
  export default function validateSecurity(req, res, next) {
    try {
      const sources = { body: req.body, query: req.query, params: req.params };
  
      for (const [sourceName, sourceObj] of Object.entries(sources)) {
        if (!sourceObj) continue;
        const result = traverseAndCheck(sourceObj, sourceName);
        if (!result.ok) {
          return res.status(400).json({
            success: false,
            message: `Malicious or injection-like content detected in "${result.path}"`,
          });
        }
      }
  
      // All clear
      return next();
    } catch (err) {
      // Fail-safe: if the middleware itself errors, block the request
      return res.status(400).json({
        success: false,
        message: 'Invalid input detected',
      });
    }
  }
  