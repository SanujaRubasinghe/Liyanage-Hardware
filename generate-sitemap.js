// generate-sitemap.js
const fs = require("fs");
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

// Replace with your actual domain
const BASE_URL = "https://newliyanagehardware.lk";

// Static routes only (no dynamic params like /:id)
const staticRoutes = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/products", changefreq: "weekly", priority: 0.8 },
  { url: "/categories", changefreq: "weekly", priority: 0.7 },
  { url: "/category/sample-category/products", changefreq: "weekly", priority: 0.7 }, // example static category route
  { url: "/about-us", changefreq: "monthly", priority: 0.6 },
  { url: "/contact-us", changefreq: "monthly", priority: 0.6 },
  { url: "/policy", changefreq: "monthly", priority: 0.4 },
  { url: "/terms", changefreq: "yearly", priority: 0.4 },
  { url: "/return-policy", changefreq: "yearly", priority: 0.4 },
  { url: "/shipping-policy", changefreq: "yearly", priority: 0.4 },
  { url: "/disclaimer", changefreq: "yearly", priority: 0.4 },
];

(async () => {
  const sitemap = new SitemapStream({ hostname: BASE_URL });
  const writeStream = fs.createWriteStream(path.resolve(__dirname, "public", "sitemap.xml"));

  streamToPromise(Readable.from(staticRoutes).pipe(sitemap)).then((data) => {
    fs.writeFileSync(path.resolve(__dirname, "public", "sitemap.xml"), data.toString());
    console.log("✅ Sitemap generated at public/sitemap.xml");
  });
})();
