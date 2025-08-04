(async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const baseUrl = window.location.href.split('?')[0];
  const results = [];

  function downloadCSV(data, filename = 'bayut_listings.csv') {
    if (data.length === 0) {
      console.warn("No data to save.");
      return;
    }

    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = (row[header] ?? '').toString().replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function scrapePage(pageNum) {
    const url = pageNum === 1 ? baseUrl : `${baseUrl}?page=${pageNum}`;
    console.log(`\n🔎 Scraping Page ${pageNum}: ${url}`);

    try {
      const res = await fetch(url);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const listings = Array.from(doc.querySelectorAll('[aria-label="Listing"]'));

      for (const listing of listings) {
        const title = listing.querySelector('[aria-label="Title"]')?.innerText || '';
        const price = listing.querySelector('[aria-label="Price"]')?.innerText || '';
        const location = listing.querySelector('[aria-label="Location"]')?.innerText || '';
        const beds = listing.querySelector('[aria-label="Beds"]')?.innerText || '';
        const baths = listing.querySelector('[aria-label="Baths"]')?.innerText || '';
        const area = listing.querySelector('[aria-label="Area"]')?.innerText || '';
        const link = listing.querySelector('a')?.href || '';

        let agent = "N/A";
        let company = "N/A";
        let companyLink = "N/A";

        if (link) {
          try {
            const detailRes = await fetch(link);
            const detailText = await detailRes.text();
            const detailDoc = new DOMParser().parseFromString(detailText, 'text/html');

            const agentEl = detailDoc.querySelector('a[aria-label="Agent name"] h2');
            agent = agentEl ? agentEl.innerText.trim() : "N/A";

            const companyLinkEl = detailDoc.querySelector('a[aria-label="View all properties"]');
            if (companyLinkEl) {
              companyLink = companyLinkEl.href;
              const slug = companyLinkEl.getAttribute("href").split("/companies/")[1];
              company = slug ? slug.split('-').slice(0, -1).join(' ') : "N/A";
            }
          } catch (err) {
            console.error("❌ Error fetching detail page:", err);
          }

          const waitMs = randomDelay(3000, 7000);
          console.log(`⏳ Waiting ${waitMs / 1000}s before next listing...`);
          await delay(waitMs);
        }

        results.push({ title, price, location, beds, baths, area, link, agent, company, companyLink });
        console.log("✅ Scraped:", results[results.length - 1]);
      }
    } catch (err) {
      console.error("❌ Error fetching search page:", err);
    }
  }

  // Scrape pages 1 to 5 (change range as needed)
  for (let i = 1; i <= 5; i++) {
    await scrapePage(i);

    const waitMs = randomDelay(3000, 7000);
    console.log(`✅ Finished page ${i}, waiting ${waitMs / 1000}s before next page...`);
    await delay(waitMs);
  }

  // One final CSV download at the end
  console.log(`\n📦 Scraping complete. Downloading ${results.length} records as CSV...`);
  downloadCSV(results, 'bayut_listings.csv');

  // Still copy to clipboard as JSON if needed
  copy(JSON.stringify(results, null, 2));
})();
