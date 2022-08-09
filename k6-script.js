import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
import http from 'k6/http'
import { Counter } from 'k6/metrics';

export let options = {
  // discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'per-vu-iterations',
      vus: 1000,
      iterations: 1,
      maxDuration: '1m',
    }
  }
}

const hostURL = "http://flashsales.easyabp.io";
const planId = "3a0580c5-d7e6-7d4b-8994-301aaad55546";

let orderURL = hostURL + "/api/e-shop/plugins/flash-sales/flash-sale-plan/{planId}/order".replace('{planId}', planId);

let none200Counter = new Counter("none200Counter");

export default function () {
  let userId = uuidv4();

  let orderResponse = http.post(orderURL, "{}", {
    headers: {
      "user-id": userId,
      'Content-Type': 'application/json'
    }
  });

  if (orderResponse.status !== 200) none200Counter.add(1);
}