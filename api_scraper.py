# api_scraper.py (Version 6 - With Headers)
import requests
import json
import time
from datetime import date, timedelta

# --- CONFIGURATION ---
DAYS_TO_FETCH = 7 
API_KEY = "7d8d34d1-e9af-4897-9f0f-5c36c179be77"
IMAGE_BASE_URL = "https://static.tkt.ge/img/posters/v3/"
# This header makes our request look like it's coming from a regular browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
# --------------------

def fetch_events_by_date():
    print(f"🚀 Fetching all events for the next {DAYS_TO_FETCH} days (with headers)...")
    all_events = []
    seen_event_ids = set()
    start_date = date.today()

    for i in range(DAYS_TO_FETCH):
        current_date = start_date + timedelta(days=i)
        date_str = current_date.strftime("%Y-%m-%d")
        api_url = f"https://gateway.tkt.ge/Events/Day?date={date_str}&api_key={API_KEY}"
        
        try:
            print(f"-> Fetching events for {date_str}...")
            # We now pass the HEADERS with the request
            response = requests.get(api_url, headers=HEADERS)
            response.raise_for_status()
            
            raw_events = response.json()

            if not raw_events:
                print(f"   - No events found for {date_str}.")
                continue

            for event in raw_events:
                event_id = event.get('id')
                if event_id and event_id not in seen_event_ids:
                    seen_event_ids.add(event_id)
                    venue = event.get('venue', {})
                    image_filename = event.get('v3ImageName')
                    
                    structured_event = {
                        "unique_id": f"tkt_{event_id}",
                        "title": event.get('name', 'N/A').strip(),
                        "description": event.get('description', 'No details available.'),
                        "category": event.get('categoryName', 'General'),
                        "time": event.get('eventDate', 'N/A'),
                        "location": venue.get('name', "Tbilisi").strip(),
                        "latitude": venue.get('latitude'),
                        "longitude": venue.get('longitude'),
                        "picture": f"{IMAGE_BASE_URL}{image_filename}" if image_filename else None,
                    }
                    all_events.append(structured_event)
            
            time.sleep(0.5)

        except requests.exceptions.RequestException as e:
            print(f"❌ Error fetching date {date_str}: {e}")
            continue

    return all_events

if __name__ == "__main__":
    extracted_events = fetch_events_by_date()
    
    if extracted_events:
        output_filename = "tkt_events_from_api.json"
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(extracted_events, f, ensure_ascii=False, indent=2)
        print(f"\n✅ Success! Data for {len(extracted_events)} unique events saved to {output_filename}")
    else:
        print("\n❌ Failed to fetch any events.")