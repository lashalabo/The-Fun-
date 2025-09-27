# api_inspector.py (Updated with better debugging)
import asyncio
from playwright.async_api import async_playwright

# The target URL to inspect
TARGET_URL = "https://tkt.ge/en/event"

async def main():
    """
    Launches a browser, navigates to the target URL, and listens for
    API requests (Fetch/XHR) that return JSON data.
    """
    print("✅ Main function started.")
    try:
        async with async_playwright() as p:
            print("▶️  Attempting to launch browser...")
            browser = await p.chromium.launch(headless=False, slow_mo=50)
            print("✅ Browser launched successfully!")
            
            page = await browser.new_page()
            print("✅ New page created.")

            print("-" * 30)
            print("--- API Inspector Activated ---")
            print(f"Navigating to {TARGET_URL}...")
            print("As you browse the site, I will log potential API endpoints below.")
            print("-" * 30)

            def log_api_requests(request):
                if request.resource_type in ["fetch", "xhr"]:
                    if "application/json" in request.headers.get("accept", ""):
                        print(f"✅ Potential API Endpoint Found: {request.url}")

            page.on("request", log_api_requests)

            await page.goto(TARGET_URL, wait_until="networkidle", timeout=60000)
            print("\nPage loaded. Start browsing and interacting with the event listings.")
            print("Press Ctrl+C in this terminal to exit the inspector.")
            
            await page.wait_for_timeout(300000) # Keep browser open for 5 minutes

    except Exception as e:
        # This will catch any error during the process and print it
        print("\n" + "="*20 + " ERROR " + "="*20)
        print(f"❌ An error occurred: {e}")
        print("="*47)
    finally:
        if 'browser' in locals() and browser.is_connected():
            await browser.close()
        print("\n--- API Inspector Deactivated ---")


if __name__ == "__main__":
    print("▶️  Script execution starting...")
    # We wrap the script run in a try/except as well for safety
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"❌ A critical error occurred at the top level: {e}")
    print("▶️  Script execution finished.")