import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";




import netlify from "@astrojs/netlify";




import preact from "@astrojs/preact";




// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  site: "https://catascat.netlify.app/",
  integrations: [mdx(), sitemap(), preact()],
  adapter: netlify(),
});