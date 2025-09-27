# api_scraper.py (Final Working Version)
import requests
import json
from datetime import datetime

today_date = datetime.now().strftime('%Y-%m-%d')
API_URL = f"https://gateway.tkt.ge/Events/Day?date={today_date}&api_key=7d8d34d1-e9af-4897-9f0f-5c36c179be77"
IMAGE_BASE_URL = "https://static.tkt.ge/img/posters/v3/" # Base URL for constructing the full image path

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://tkt.ge/',
    'Origin': 'https://tkt.ge',
}

def fetch_events_from_api():
    """
    Fetches event data from the tkt.ge API using the correct keys
    and constructs the full image URL.
    """
    print(f"🚀 Calling API: {API_URL}")
    events_data = []
    
    try:
        response = requests.get(API_URL, headers=HEADERS)
        response.raise_for_status()
        raw_events = response.json()

        if isinstance(raw_events, list):
            print(f"✅ API call successful. Found {len(raw_events)} events.")
            for event in raw_events:
                location = event.get('venueName')
                if not location or not location.strip():
                    location = "Tbilisi"
                
                # Construct the full image URL
                image_filename = event.get('v3ImageName')
                full_image_url = f"{IMAGE_BASE_URL}{image_filename}" if image_filename else "N/A"

                structured_event = {
                    "title": event.get('eventName', 'N/A').strip(),
                    "time": event.get('eventDate', 'N/A'),
                    "location": location.strip(),
                    "picture": full_image_url,
                    "unique_id": f"tkt_{event.get('eventId', '')}"
                }
                events_data.append(structured_event)
        else:
            print("⚠️ No events found in the API response for today.")

    except requests.exceptions.RequestException as e:
        print(f"❌ An error occurred during the API request: {e}")
    except json.JSONDecodeError:
        print("❌ Failed to parse the response as JSON. The API might be down or has changed.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

    return events_data

if __name__ == "__main__":
    extracted_events = fetch_events_from_api()
    
    if extracted_events:
        output_filename = "tkt_events_from_api.json"
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(extracted_events, f, ensure_ascii=False, indent=4)
        print(f"\nData successfully saved to {output_filename}")

        print("\n--- First 3 Events (Corrected) ---")
        for event in extracted_events[:3]:
            print(json.dumps(event, indent=2, ensure_ascii=False))
        print("-" * 34)