import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
import http from 'k6/http'
import { Counter } from 'k6/metrics';

export let options = {
  // discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'per-vu-iterations',
      vus: 3000,
      iterations: 1,
      maxDuration: '1m',
    }
  }
}

const hostURL = "http://localhost:44331";
const planId = "3a05957c-a91e-afbd-1e37-84cb004aa09b";

let orderURL = hostURL + "/api/e-shop/plugins/flash-sales/flash-sale-plan/{planId}/order".replace('{planId}', planId);

let none200Counter = new Counter("none200Counter");
let successCounter = new Counter("flashsale-Success");
let failureCounter = new Counter("flashsales-Failure");

export default function () {
  let userId = uuidv4();

  let orderResponse = http.post(orderURL, "{}", {
    headers: {
      "user-id": userId,
      'Content-Type': 'application/json'
    }
  });

  if (orderResponse.status !== 200) none200Counter.add(1);
  let result = JSON.parse(orderResponse.body)
  if (result && result.isSuccess) successCounter.add(1);
  if (result && !result.isSuccess) failureCounter.add(1);
}