import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 4,
  duration: '20s',
};

export default function () {
  const base = __ENV.K6_API || 'http://backend:3000/api';
  const res = http.get(`${base}/filmes`);
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
