import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token : process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});



