
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Home Page Footer
        print("Navigating to Home...")
        page.goto("http://localhost:3000", timeout=60000)

        print("Checking for Footer...")
        # Footer usually has "Americana Stores" or copyright
        footer_locator = page.locator("footer")
        expect(footer_locator).to_be_visible()

        # Check text in footer
        expect(footer_locator).to_contain_text("Americana Stores")

        print("Taking Home Screenshot...")
        page.screenshot(path="verification/home_footer.png")

        # Verify Shop Page Footer
        print("Navigating to Shops...")
        page.goto("http://localhost:3000/shops", timeout=60000)

        expect(footer_locator).to_be_visible()
        print("Taking Shops Screenshot...")
        page.screenshot(path="verification/shops_footer.png")

        browser.close()
        print("Verification Complete")

if __name__ == "__main__":
    run()
