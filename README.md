# Real-Estate-Scraper
A JavaScript DOM scraper for property listings from real estate portal (Bayut).

This JavaScript script scrapes real estate property listings from a paginated site using DOM parsing and `fetch` calls. Intended to be run directly in the browser console.

## 🔧 Features

- Scrapes multiple pages (you'll have to specify the number of pages you want to scrape)
- Extracts: Title, Price, Location, Beds, Baths, Area, Link, Agent, Company
- Visits each listing detail page to fetch more info
- Exports results as downloadable CSV
- Copies full JSON to clipboard

## 🚀 Usage

1. Open the search results page (e.g., Bayut.com).
2. Press `F12` or right-click > **Inspect** > go to **Console**
3. Paste the script.
4. Hit Enter and wait for scraping to complete.
5. A `.csv` file will automatically download.


> This script is for educational and personal use only.

