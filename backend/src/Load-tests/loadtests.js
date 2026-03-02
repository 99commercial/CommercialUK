import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

// 100 users with concurrency at 3 to 4 seconds
// 200 users with concurrency at 2 to 3 seconds

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const GET_ALL_PROPERTIES_ENDPOINT = '/api/agent/properties/all?page=1&limit=12';
const REQUEST_TIMEOUT = __ENV.REQUEST_TIMEOUT || '10s';
const LOCAL_MODE = (__ENV.LOCAL_MODE || 'true').toLowerCase() !== 'false';
const TEST_PROFILE = __ENV.TEST_PROFILE || 'quick'; // quick | full | heavy

export const options = {
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
  scenarios:
    LOCAL_MODE && TEST_PROFILE === 'quick'
      ? {
          // Fast feedback profile for local development.
          smoke: {
            executor: 'shared-iterations',
            vus: 2,
            iterations: 20,
            maxDuration: '1m',
            exec: 'smokeScenario',
          },
          baseline: {
            executor: 'ramping-arrival-rate',
            startRate: 2,
            timeUnit: '1s',
            preAllocatedVUs: 5,
            maxVUs: 30,
            stages: [
              { target: 5, duration: '1m' },
              { target: 8, duration: '1m' },
              { target: 0, duration: '30s' },
            ],
            exec: 'baselineScenario',
          },
        }
      : LOCAL_MODE && TEST_PROFILE === 'heavy'
      ? {
          // Heavier local profile for stronger stress checks on localhost.
          smoke: {
            executor: 'shared-iterations',
            vus: 8,
            iterations: 80,
            maxDuration: '2m',
            exec: 'smokeScenario',
          },
          baseline: {
            executor: 'ramping-arrival-rate',
            startRate: 6,
            timeUnit: '1s',
            preAllocatedVUs: 20,
            maxVUs: 120,
            stages: [
              { target: 15, duration: '2m' },
              { target: 25, duration: '3m' },
              { target: 35, duration: '3m' },
              { target: 0, duration: '1m' },
            ],
            exec: 'baselineScenario',
          },
          peak: {
            executor: 'constant-arrival-rate',
            rate: 32,
            timeUnit: '1s',
            duration: '4m',
            preAllocatedVUs: 40,
            maxVUs: 180,
            exec: 'peakScenario',
          },
          spike: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            timeUnit: '1s',
            preAllocatedVUs: 30,
            maxVUs: 220,
            stages: [
              { target: 15, duration: '45s' },
              { target: 55, duration: '30s' },
              { target: 55, duration: '60s' },
              { target: 15, duration: '45s' },
            ],
            exec: 'spikeScenario',
          },
          soak: {
            executor: 'constant-arrival-rate',
            rate: 14,
            timeUnit: '1s',
            duration: '15m',
            preAllocatedVUs: 25,
            maxVUs: 120,
            exec: 'soakScenario',
          },
        }
      : LOCAL_MODE
      ? {
          // Full local profile: realistic but still laptop-friendly.
          smoke: {
            executor: 'shared-iterations',
            vus: 5,
            iterations: 50,
            maxDuration: '2m',
            exec: 'smokeScenario',
          },
          baseline: {
            executor: 'ramping-arrival-rate',
            startRate: 3,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 60,
            stages: [
              { target: 8, duration: '2m' },
              { target: 12, duration: '3m' },
              { target: 0, duration: '1m' },
            ],
            exec: 'baselineScenario',
          },
          peak: {
            executor: 'constant-arrival-rate',
            rate: 15,
            timeUnit: '1s',
            duration: '3m',
            preAllocatedVUs: 20,
            maxVUs: 100,
            exec: 'peakScenario',
          },
          spike: {
            executor: 'ramping-arrival-rate',
            startRate: 4,
            timeUnit: '1s',
            preAllocatedVUs: 15,
            maxVUs: 120,
            stages: [
              { target: 8, duration: '45s' },
              { target: 25, duration: '30s' },
              { target: 25, duration: '45s' },
              { target: 8, duration: '30s' },
            ],
            exec: 'spikeScenario',
          },
          soak: {
            executor: 'constant-arrival-rate',
            rate: 8,
            timeUnit: '1s',
            duration: '10m',
            preAllocatedVUs: 10,
            maxVUs: 60,
            exec: 'soakScenario',
          },
        }
      : {
          // Non-local profile (CI/staging/perf env).
          smoke: {
            executor: 'shared-iterations',
            vus: 5,
            iterations: 50,
            maxDuration: '2m',
            exec: 'smokeScenario',
          },
          baseline: {
            executor: 'ramping-arrival-rate',
            startRate: 5,
            timeUnit: '1s',
            preAllocatedVUs: 20,
            maxVUs: 150,
            stages: [
              { target: 20, duration: '3m' },
              { target: 30, duration: '5m' },
              { target: 0, duration: '2m' },
            ],
            exec: 'baselineScenario',
          },
          peak: {
            executor: 'constant-arrival-rate',
            rate: 45,
            timeUnit: '1s',
            duration: '5m',
            preAllocatedVUs: 80,
            maxVUs: 300,
            exec: 'peakScenario',
          },
          spike: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            timeUnit: '1s',
            preAllocatedVUs: 50,
            maxVUs: 400,
            stages: [
              { target: 20, duration: '1m' },
              { target: 110, duration: '45s' },
              { target: 110, duration: '90s' },
              { target: 20, duration: '45s' },
            ],
            exec: 'spikeScenario',
          },
          soak: {
            executor: 'constant-arrival-rate',
            rate: 20,
            timeUnit: '1s',
            duration: '20m',
            preAllocatedVUs: 40,
            maxVUs: 200,
            exec: 'soakScenario',
          },
        },

  thresholds: {
    // Global health
    http_req_failed: LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['rate<0.07'] : LOCAL_MODE ? ['rate<0.05'] : ['rate<0.02'],
    checks: ['rate>0.99'],

    // Scenario-specific SLOs
    'http_req_duration{scenario:smoke}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['p(95)<1800'] : LOCAL_MODE ? ['p(95)<1500'] : ['p(95)<800'],
    'http_req_duration{scenario:baseline}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['p(95)<2600'] : LOCAL_MODE ? ['p(95)<2200'] : ['p(95)<1200'],
    'http_req_duration{scenario:peak}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['p(95)<3600'] : LOCAL_MODE ? ['p(95)<3000'] : ['p(95)<1800'],
    'http_req_duration{scenario:spike}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['p(95)<5000'] : LOCAL_MODE ? ['p(95)<4000'] : ['p(95)<2500'],
    'http_req_duration{scenario:soak}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['p(95)<3200'] : LOCAL_MODE ? ['p(95)<2500'] : ['p(95)<1500'],

    'http_req_failed{scenario:smoke}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['rate<0.03'] : LOCAL_MODE ? ['rate<0.02'] : ['rate<0.01'],
    'http_req_failed{scenario:baseline}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['rate<0.05'] : LOCAL_MODE ? ['rate<0.03'] : ['rate<0.01'],
    'http_req_failed{scenario:peak}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['rate<0.07'] : LOCAL_MODE ? ['rate<0.05'] : ['rate<0.02'],
    'http_req_failed{scenario:spike}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['rate<0.10'] : LOCAL_MODE ? ['rate<0.08'] : ['rate<0.05'],
    'http_req_failed{scenario:soak}': LOCAL_MODE && TEST_PROFILE === 'heavy' ? ['rate<0.07'] : LOCAL_MODE ? ['rate<0.05'] : ['rate<0.02'],
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
    'status is 200 or 304': (r) => r.status === 200 || r.status === 304,
    'response is JSON when 200': (r) => r.status !== 200 || isJson,
  });

  if (__ITER % 10 === 0 && res.status === 304 && parsedBody) {
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

