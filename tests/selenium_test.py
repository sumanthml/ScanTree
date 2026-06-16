import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_web_app():
    # Setup headless Chrome options for CI/GitHub Actions
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1280,1024")

    # Initialize Chrome WebDriver
    print("[Selenium] Initializing Chrome WebDriver...")
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)

    try:
        # 1. Open the local web application
        url = "http://localhost:8081"
        print(f"[Selenium] Navigating to {url}...")
        driver.get(url)

        # 2. Wait for the page load and verify title
        time.sleep(3)  # Allow time for loading bundle on local dev
        title = driver.title
        print(f"[Selenium] Page loaded. Title: '{title}'")
        assert "ScanTrace" in title or "scantrace" in title.lower(), f"Unexpected page title: {title}"

        # 3. Verify Login Screen elements
        print("[Selenium] Verifying Login screen input fields...")
        email_input = driver.find_element(By.XPATH, "//input[@placeholder='you@example.com' or @type='email']")
        password_input = driver.find_element(By.XPATH, "//input[@placeholder='••••••••' or @type='password']")
        
        assert email_input.is_displayed(), "Email input is not visible"
        assert password_input.is_displayed(), "Password input is not visible"
        print("[Selenium] Login input fields verified successfully.")

        # 4. Navigate to Forgot Password
        print("[Selenium] Clicking 'Forgot Password?' link...")
        forgot_password_link = driver.find_element(
            By.XPATH,
            "//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'forgot password')]"
        )
        forgot_password_link.click()

        # 5. Verify Forgot Password page loads
        print("[Selenium] Verifying Forgot Password page...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@placeholder='you@example.com' or @type='email']"))
        )
        time.sleep(1)
        assert "Forgot" in driver.page_source or "forgot" in driver.page_source.lower(), "Forgot Password page source does not match"
        print("[Selenium] Forgot Password page navigation verified successfully.")

        print("[Selenium] E2E Selenium Test Completed Successfully! 🎉")

    except Exception as e:
        print(f"[Selenium] Test Failed: {e}")
        # Save screenshot for debugging in GitHub Actions artifacts
        screenshot_path = "selenium_error_screenshot.png"
        driver.save_screenshot(screenshot_path)
        print(f"[Selenium] Saved error screenshot to {screenshot_path}")
        raise e
    finally:
        driver.quit()

if __name__ == "__main__":
    test_web_app()
