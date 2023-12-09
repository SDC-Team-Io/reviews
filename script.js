import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 3000 },
    { duration: '15s', target: 4000 },
    { duration: '5s', target: 0 },
  ],
};

export default function() {
  const random = Math.floor(Math.random() * 40000) + 1;
  http.get(`http://localhost:3000/reviews/meta/${random}`);
  sleep(1);
}
