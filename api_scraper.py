# api_scraper.py (Enhanced)
import asyncio
import json
from playwright.async_api import async_playwright

TARGET_URL = "https://tkt.ge/en/events"
IMAGE_BASE_URL = "https://static.tkt.ge/img/posters/v3/"

async def scrape_tkt_ge():
    """
    Uses Playwright to scrape detailed event data from tkt.ge,
    including description, category, and GPS coordinates if available.
    """
    print("🚀 Starting Enhanced Playwright scraper...")
    events_data = []
    browser = None

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            print(f"Navigating to {TARGET_URL}...")
            await page.goto(TARGET_URL, wait_until="networkidle", timeout=90000)

            await page.wait_for_selector("div[class*='event-card-style__EventCardWrapper']", timeout=30000)
            
            raw_data_element = await page.query_selector("script#__NEXT_DATA__")
            if not raw_data_element:
                raise Exception("Could not find __NEXT_DATA__ script tag.")
                
            raw_json = await raw_data_element.inner_html()
            data = json.loads(raw_json)
            
            events_list = data.get("props", {}).get("pageProps", {}).get("events", {}).get("items", [])
            
            if not events_list:
                print("⚠️  Could not find events in the page's initial data.")
            else:
                print(f"✅ Found {len(events_list)} events in the page's JSON data.")
                for event in events_list:
                    venue = event.get('venue', {})
                    location_name = venue.get('name', "Tbilisi")
                    
                    image_filename = event.get('v3ImageName')
                    full_image_url = f"{IMAGE_BASE_URL}{image_filename}" if image_filename else "N/A"

                    structured_event = {
                        "id": event.get('id', ''),
                        "title": event.get('name', 'N/A').strip(),
                        "description": event.get('description', 'No details available.'),
                        "category": event.get('categoryName', 'General'),
                        "time": event.get('eventDate', 'N/A'),
                        "location_name": location_name.strip(),
                        "latitude": venue.get('latitude'),
                        "longitude": venue.get('longitude'),
                        "picture": full_image_url,
                    }
                    events_data.append(structured_event)

        except Exception as e:
            print(f"❌ An error occurred during Playwright scraping: {e}")
        finally:
            if browser and browser.is_connected():
                await browser.close()

    return events_data

if __name__ == "__main__":
    extracted_events = asyncio.run(scrape_tkt_ge())
    
    if extracted_events:
        output_filename = "tkt_events_from_api.json"
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(extracted_events, f, ensure_ascii=False, indent=4)
        print(f"\nData successfully saved to {output_filename}")