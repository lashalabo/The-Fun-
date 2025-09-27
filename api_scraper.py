# api_scraper.py (Final Playwright Version)
import asyncio
# api_scraper.py (Final Playwright Version)
import asyncio
import json
from playwright.async_api import async_playwright

TARGET_URL = "https://tkt.ge/en/events" # The real events page
IMAGE_BASE_URL = "https://static.tkt.ge/img/posters/v3/"

async def scrape_tkt_ge():
    """
    Uses Playwright to scrape event data from tkt.ge by controlling a real browser,
    bypassing anti-bot measures.
from playwright.async_api import async_playwright

TARGET_URL = "https://tkt.ge/en/events" # The real events page
IMAGE_BASE_URL = "https://static.tkt.ge/img/posters/v3/"

async def scrape_tkt_ge():
    """
    Uses Playwright to scrape event data from tkt.ge by controlling a real browser,
    bypassing anti-bot measures.
    """
    print("🚀 Starting Playwright scraper...")
    print("🚀 Starting Playwright scraper...")
    events_data = []

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            print(f"Navigating to {TARGET_URL}...")
            await page.goto(TARGET_URL, wait_until="networkidle", timeout=90000)

            # Wait for the event cards to be present on the page
            await page.wait_for_selector("div[class*='event-card-style__EventCardWrapper']", timeout=30000)
            
            # Extract the raw data from the hidden JSON data island in the HTML
            # This is a modern and efficient way to get data from React sites
            raw_data_element = await page.query_selector("script#__NEXT_DATA__")
            if not raw_data_element:
                raise Exception("Could not find __NEXT_DATA__ script tag. Site structure may have changed.")
                
            raw_json = await raw_data_element.inner_html()
            data = json.loads(raw_json)
            
            # Navigate through the complex JSON structure to find the events list
            events_list = data.get("props", {}).get("pageProps", {}).get("events", {}).get("items", [])
            
            if not events_list:
                print("⚠️  Could not find events in the page's initial data. Scraping visible cards as a fallback.")
                # Fallback to scraping visible cards if the JSON island method fails (less reliable)
                # This part is omitted for clarity but could be added if needed.
            else:
                print(f"✅ Found {len(events_list)} events in the page's JSON data.")
                for event in events_list:
                    location = event.get('venue', {}).get('name')
                    if not location or not location.strip():
                        location = "Tbilisi"
                    
                    image_filename = event.get('v3ImageName')
                    full_image_url = f"{IMAGE_BASE_URL}{image_filename}" if image_filename else "N/A"

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            print(f"Navigating to {TARGET_URL}...")
            await page.goto(TARGET_URL, wait_until="networkidle", timeout=90000)

            # Wait for the event cards to be present on the page
            await page.wait_for_selector("div[class*='event-card-style__EventCardWrapper']", timeout=30000)
            
            # Extract the raw data from the hidden JSON data island in the HTML
            # This is a modern and efficient way to get data from React sites
            raw_data_element = await page.query_selector("script#__NEXT_DATA__")
            if not raw_data_element:
                raise Exception("Could not find __NEXT_DATA__ script tag. Site structure may have changed.")
                
            raw_json = await raw_data_element.inner_html()
            data = json.loads(raw_json)
            
            # Navigate through the complex JSON structure to find the events list
            events_list = data.get("props", {}).get("pageProps", {}).get("events", {}).get("items", [])
            
            if not events_list:
                print("⚠️  Could not find events in the page's initial data. Scraping visible cards as a fallback.")
                # Fallback to scraping visible cards if the JSON island method fails (less reliable)
                # This part is omitted for clarity but could be added if needed.
            else:
                print(f"✅ Found {len(events_list)} events in the page's JSON data.")
                for event in events_list:
                    location = event.get('venue', {}).get('name')
                    if not location or not location.strip():
                        location = "Tbilisi"
                    
                    image_filename = event.get('v3ImageName')
                    full_image_url = f"{IMAGE_BASE_URL}{image_filename}" if image_filename else "N/A"

                    structured_event = {
                        "title": event.get('name', 'N/A').strip(),
                        "time": event.get('eventDate', 'N/A'),
                        "location": location.strip(),
                        "picture": full_image_url,
                        "unique_id": f"tkt_{event.get('id', '')}"
                    }
                    events_data.append(structured_event)
                    structured_event = {
                        "title": event.get('name', 'N/A').strip(),
                        "time": event.get('eventDate', 'N/A'),
                        "location": location.strip(),
                        "picture": full_image_url,
                        "unique_id": f"tkt_{event.get('id', '')}"
                    }
                    events_data.append(structured_event)

        except Exception as e:
            print(f"❌ An error occurred during Playwright scraping: {e}")
        finally:
            if 'browser' in locals() and browser.is_connected():
                await browser.close()
        except Exception as e:
            print(f"❌ An error occurred during Playwright scraping: {e}")
        finally:
            if 'browser' in locals() and browser.is_connected():
                await browser.close()

    return events_data

if __name__ == "__main__":
    extracted_events = asyncio.run(scrape_tkt_ge())
    extracted_events = asyncio.run(scrape_tkt_ge())
    
    if extracted_events:
        output_filename = "tkt_events_from_api.json"
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(extracted_events, f, ensure_ascii=False, indent=4)
        print(f"\nData successfully saved to {output_filename}")