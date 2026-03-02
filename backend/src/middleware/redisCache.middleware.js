import crypto from 'crypto';
import redisClient from '../config/redis.client.js';

const DEFAULT_SCAN_COUNT = 200;
const CACHE_VERSION = 'v2';
const ALL_WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const CACHE_POLICIES = [
  // /api/agent (Property module)
  { id: 'agent_properties_all', methods: ['GET'], pattern: /^\/api\/agent\/properties\/all$/, ttlSeconds: 120, scope: 'public' },
  { id: 'agent_property_detail', methods: ['GET'], pattern: /^\/api\/agent\/properties\/[^/]+$/, ttlSeconds: 300, scope: 'public' },
  { id: 'agent_properties_by_agent', methods: ['GET'], pattern: /^\/api\/agent\/agents\/[^/]+\/properties$/, ttlSeconds: 60, scope: 'auth' },
  { id: 'agent_queries_by_agent', methods: ['GET'], pattern: /^\/api\/agent\/agents\/[^/]+\/queries$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'agent_queries_my', methods: ['GET'], pattern: /^\/api\/agent\/queries\/my-queries$/, ttlSeconds: 30, scope: 'auth' },
  { id: 'agent_query_detail', methods: ['GET'], pattern: /^\/api\/agent\/queries\/[^/]+$/, ttlSeconds: 60, scope: 'auth' },

  // /api/user (Property module)
  { id: 'user_properties_all', methods: ['GET'], pattern: /^\/api\/user\/properties\/all$/, ttlSeconds: 120, scope: 'public' },
  { id: 'user_property_detail', methods: ['GET'], pattern: /^\/api\/user\/properties\/[^/]+$/, ttlSeconds: 300, scope: 'public' },
  { id: 'user_properties_by_agent', methods: ['GET'], pattern: /^\/api\/user\/agents\/[^/]+\/properties$/, ttlSeconds: 60, scope: 'auth' },
  { id: 'user_queries_by_agent', methods: ['GET'], pattern: /^\/api\/user\/agents\/[^/]+\/queries$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'user_queries_my', methods: ['GET'], pattern: /^\/api\/user\/queries\/my-queries$/, ttlSeconds: 30, scope: 'auth' },
  { id: 'user_query_detail', methods: ['GET'], pattern: /^\/api\/user\/queries\/[^/]+$/, ttlSeconds: 60, scope: 'auth' },

  // /api/admin (Features module)
  { id: 'admin_dashboard', methods: ['GET'], pattern: /^\/api\/admin\/dashboard$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'admin_properties', methods: ['GET'], pattern: /^\/api\/admin\/properties$/, ttlSeconds: 60, scope: 'auth' },
  { id: 'admin_property_detail', methods: ['GET'], pattern: /^\/api\/admin\/properties\/[^/]+$/, ttlSeconds: 120, scope: 'auth' },
  { id: 'admin_users', methods: ['GET'], pattern: /^\/api\/admin\/users$/, ttlSeconds: 60, scope: 'auth' },
  { id: 'admin_user_detail', methods: ['GET'], pattern: /^\/api\/admin\/users\/[^/]+$/, ttlSeconds: 120, scope: 'auth' },
  { id: 'admin_users_list', methods: ['GET'], pattern: /^\/api\/admin\/users-list$/, ttlSeconds: 120, scope: 'auth' },
  { id: 'admin_agents_list', methods: ['GET'], pattern: /^\/api\/admin\/agents-list$/, ttlSeconds: 120, scope: 'auth' },
  { id: 'admin_discount_codes', methods: ['GET'], pattern: /^\/api\/admin\/discount-codes$/, ttlSeconds: 60, scope: 'auth' },
  { id: 'admin_static_general_page', methods: ['GET'], pattern: /^\/api\/admin\/static-pages\/general-page$/, ttlSeconds: 600, scope: 'public' },

  // /api/admin/user-activity
  { id: 'admin_user_activity', methods: ['GET'], pattern: /^\/api\/admin\/user-activity\/[^/]+$/, ttlSeconds: 20, scope: 'auth' },

  // /api/aical
  { id: 'aical_commercial_properties', methods: ['GET'], pattern: /^\/api\/aical\/commercial-properties$/, ttlSeconds: 60, scope: 'auth' },
  { id: 'aical_commercial_property_detail', methods: ['GET'], pattern: /^\/api\/aical\/commercial-properties\/[^/]+$/, ttlSeconds: 120, scope: 'auth' },
  { id: 'aical_reports_by_user', methods: ['GET'], pattern: /^\/api\/aical\/reports\/user\/[^/]+$/, ttlSeconds: 60, scope: 'auth' },
  { id: 'aical_report_detail', methods: ['GET'], pattern: /^\/api\/aical\/reports\/[^/]+$/, ttlSeconds: 300, scope: 'public' },
  { id: 'aical_business_rates', methods: ['GET'], pattern: /^\/api\/aical\/business-rates$/, ttlSeconds: 300, scope: 'public' },

  // /api/payment
  { id: 'payment_subscription', methods: ['GET'], pattern: /^\/api\/payment\/subscription$/, ttlSeconds: 20, scope: 'auth' },
  { id: 'payment_intent_detail', methods: ['GET'], pattern: /^\/api\/payment\/intent\/[^/]+$/, ttlSeconds: 15, scope: 'auth' },

  // /api/agent and /api/user (Account module)
  { id: 'agent_profile', methods: ['GET'], pattern: /^\/api\/agent\/users\/profile$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'agent_favorites', methods: ['GET'], pattern: /^\/api\/agent\/favorites$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'agent_favorites_details', methods: ['GET'], pattern: /^\/api\/agent\/favorites\/details$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'user_profile', methods: ['GET'], pattern: /^\/api\/user\/users\/profile$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'user_favorites', methods: ['GET'], pattern: /^\/api\/user\/favorites$/, ttlSeconds: 45, scope: 'auth' },
  { id: 'user_favorites_details', methods: ['GET'], pattern: /^\/api\/user\/favorites\/details$/, ttlSeconds: 45, scope: 'auth' },
];

const INVALIDATION_POLICIES = [
  // Property writes: agent/user + admin property writes
  {
    methods: ALL_WRITE_METHODS,
    pattern:
      /^\/api\/(agent|user)\/(properties|business-rates|descriptions|sale-types|property-location|property-virtual-tours|property-features)(\/|$)|^\/api\/admin\/properties(\/|$)/,
    cacheIds: [
      'agent_properties_all',
      'agent_property_detail',
      'agent_properties_by_agent',
      'user_properties_all',
      'user_property_detail',
      'user_properties_by_agent',
      'admin_properties',
      'admin_property_detail',
      'admin_dashboard',
    ],
  },
  // Query writes
  {
    methods: ALL_WRITE_METHODS,
    pattern: /^\/api\/(agent|user)\/(properties\/[^/]+\/queries|queries\/[^/]+(\/status)?)$/,
    cacheIds: [
      'agent_queries_by_agent',
      'agent_queries_my',
      'agent_query_detail',
      'user_queries_by_agent',
      'user_queries_my',
      'user_query_detail',
    ],
  },
  // Favorites writes
  {
    methods: ALL_WRITE_METHODS,
    pattern: /^\/api\/(agent|user)\/favorites\/[^/]+$/,
    cacheIds: [
      'agent_favorites',
      'agent_favorites_details',
      'user_favorites',
      'user_favorites_details',
    ],
  },
  // Discount code writes
  {
    methods: ALL_WRITE_METHODS,
    pattern: /^\/api\/admin\/discount-codes(\/|$)/,
    cacheIds: ['admin_discount_codes'],
  },
  // Payment writes
  {
    methods: ALL_WRITE_METHODS,
    pattern:
      /^\/api\/payment\/(confirm-intent|confirm-intent-one-time|refund|check-expired|create-intent|apply-discount-code)$/,
    cacheIds: [
      'payment_subscription',
      'payment_intent_detail',
      'agent_properties_all',
      'user_properties_all',
      'admin_properties',
      'admin_property_detail',
    ],
  },
  // AICal writes including report generation
  {
    methods: ALL_WRITE_METHODS,
    pattern: /^\/api\/aical\/(commercial-properties|generate-report)(\/|$)/,
    cacheIds: [
      'aical_commercial_properties',
      'aical_commercial_property_detail',
      'aical_reports_by_user',
      'aical_report_detail',
    ],
  },
  // Static page updates
  {
    methods: ['PATCH'],
    pattern: /^\/api\/admin\/static-pages\/general-page$/,
    cacheIds: ['admin_static_general_page'],
  },
];

function normalizeQuery(query = {}) {
  const entries = [];
  for (const key of Object.keys(query).sort()) {
    if (key === 'noCache') continue;
    const value = query[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      const arr = [...value].map(String).sort();
      for (const item of arr) {
        entries.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
      }
    } else {
      entries.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return entries.join('&');
}

function getPathname(req) {
  return (req.originalUrl || req.url || '').split('?')[0];
}

function findCachePolicy(req) {
  if (req.method !== 'GET') return null;
  const pathname = getPathname(req);
  for (const policy of CACHE_POLICIES) {
    if (policy.methods.includes(req.method) && policy.pattern.test(pathname)) {
      return policy;
    }
  }
  return null;
}

function getScopeFromRequest(req, policy) {
  if (policy.scope === 'public') return 'public';
  const authHeader = req.headers.authorization || '';
  if (!authHeader) return 'anonymous';
  return crypto.createHash('sha1').update(authHeader).digest('hex');
}

function makeCacheKey(req, policy) {
  const scope = getScopeFromRequest(req, policy);
  const pathname = getPathname(req);
  const query = normalizeQuery(req.query);
  const pathWithQuery = query ? `${pathname}?${query}` : pathname;
  return `route-cache:${CACHE_VERSION}:${policy.id}:${scope}:${encodeURIComponent(pathWithQuery)}`;
}

async function deleteByPattern(pattern) {
  if (!redisClient?.isOpen) return;

  const keysToDelete = [];
  for await (const key of redisClient.scanIterator({
    MATCH: pattern,
    COUNT: DEFAULT_SCAN_COUNT,
  })) {
    keysToDelete.push(key);
    if (keysToDelete.length >= DEFAULT_SCAN_COUNT) {
      await redisClient.unlink(...keysToDelete);
      keysToDelete.length = 0;
    }
  }

  if (keysToDelete.length > 0) {
    await redisClient.unlink(...keysToDelete);
  }
}

async function deleteByCacheIds(cacheIds = []) {
  for (const cacheId of cacheIds) {
    await deleteByPattern(`route-cache:${CACHE_VERSION}:${cacheId}:*`);
  }
}

export function cacheByRoutePolicy() {
  return async (req, res, next) => {
    try {
      if (req.query?.noCache === 'true') return next();
      if (!redisClient?.isOpen) return next();
      const policy = findCachePolicy(req);
      if (!policy) return next();

      const cacheKey = makeCacheKey(req, policy);
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);
      res.json = (payload) => {
        // Only cache successful JSON responses.
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient
            .setEx(cacheKey, policy.ttlSeconds, JSON.stringify(payload))
            .catch((error) => {
              console.error('Redis cache write failed:', error.message);
            });
        }
        return originalJson(payload);
      };

      return next();
    } catch (error) {
      return next();
    }
  };
}

function getCacheIdsForInvalidation(req) {
  const pathname = getPathname(req);
  const matched = new Set();
  for (const policy of INVALIDATION_POLICIES) {
    if (policy.methods.includes(req.method) && policy.pattern.test(pathname)) {
      policy.cacheIds.forEach((id) => matched.add(id));
    }
  }
  return [...matched];
}

export function invalidateByRoutePolicy() {
  return (req, res, next) => {
    if (!ALL_WRITE_METHODS.includes(req.method)) return next();
    // Skip Redis cache invalidation for PATCH - refetch uses noCache to get fresh data
    if (req.method === 'PATCH') return next();

    res.on('finish', async () => {
      try {
        if (!redisClient?.isOpen) return;
        if (res.statusCode < 200 || res.statusCode >= 300) return;

        const cacheIds = getCacheIdsForInvalidation(req);
        if (cacheIds.length === 0) return;
        await deleteByCacheIds(cacheIds);
      } catch (error) {
        console.error('Redis cache invalidation failed:', error.message);
      }
    });

    return next();
  };
}
