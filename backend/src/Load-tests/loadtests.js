import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

// 100 users with concurrency at 3 to 4 seconds
// 200 users with concurrency at 2 to 3 seconds

const BASE_URL = 'https://backend.commercialuk.co.uk';
const GET_ALL_PROPERTIES_ENDPOINT = '/api/agent/properties/all?page=1&limit=12';
const REQUEST_TIMEOUT = __ENV.REQUEST_TIMEOUT || '10s';
const LOCAL_MODE = (__ENV.LOCAL_MODE || 'true').toLowerCase() !== 'false';
const TEST_PROFILE = __ENV.TEST_PROFILE || 'quick'; // quick | full | heavy

export const options = {
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
  // Single load/stress scenario targeting ~500 concurrent users.
  scenarios: {
    load_500: {
      executor: 'constant-arrival-rate',
      rate: 500, // 500 iterations per second
      timeUnit: '1s',
      duration: '10m',
      preAllocatedVUs: 500,
      maxVUs: 500,
      exec: 'peakScenario',
    },
  },

  thresholds: {
    // Global health
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.99'],

    // Scenario-specific SLOs for the 500-user load.
    'http_req_duration{scenario:load_500}': ['p(95)<2000'], // 95% under 2s
    'http_req_failed{scenario:load_500}': ['rate<0.05'],
  },
};

function buildUrl() {
  return `${BASE_URL.replace(/\/+$/, '')}${GET_ALL_PROPERTIES_ENDPOINT}`;
}

function runRequest() {
  const res = http.get(buildUrl(), {
    headers: { 'Accept': 'application/json' },
    timeout: REQUEST_TIMEOUT,
    tags: { endpoint: 'agent_properties_all' },
  });

  const contentType = (res.headers['content-type'] || res.headers['Content-Type'] || '').toLowerCase();
  const isJson = contentType.includes('application/json');
  const parsedBody = isJson && res.body ? (() => {
    try {
      return JSON.parse(res.body);
    } catch {
      return null;
    }
  })() : null;

  const baseChecks = check(res, {
    'status is 200 or 304': (r) => r.success === true,
  });

  if (__ITER % 10 === 0 && res.success === true && parsedBody) {
    check(res, {
      'response has success + message': () =>
        parsedBody?.success === true &&
        parsedBody?.message === 'Properties retrieved successfully',
      'response has properties array': () =>
        Array.isArray(parsedBody?.data?.properties),
      'response has pagination payload': () => {
        const p = parsedBody?.data?.pagination;
        return (
          p &&
          typeof p.current_page === 'number' &&
          typeof p.total_pages === 'number' &&
          typeof p.total_documents === 'number'
        );
      },
    });
  }

  return baseChecks;
}


export function smokeScenario() {
  runRequest();
  sleep(0.2);
}

export function baselineScenario() {
  runRequest();
  sleep(1);
}

export function peakScenario() {
  runRequest();
  sleep(0.4);
}

export function spikeScenario() {
  runRequest();
  sleep(0.1);
}

export function soakScenario() {
  runRequest();
  sleep(1.5);
}

export default function () {
  // Fallback only when running without named scenario exec.
  if (!exec.scenario.name) {
    runRequest();
    sleep(1);
  }
}

