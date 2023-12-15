import { countOptions } from "./countOptions.ts";
import { type Spring } from "./index.ts";

self.onmessage = async (e) => {
  const spring = e.data as Spring;
  const result = countOptions(spring);

  self.postMessage(result);
};
