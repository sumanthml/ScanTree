import os
import sys
import time
import json
import traceback
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Adjust path to import pom
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from pom import (
    LoginPage, RegisterPage, ForgotPasswordPage, DashboardPage,
    ReportsPage, UploadPage, AnalyticsPage, NotificationsPage,
    AccessPage, ProfilePage, SettingsPage
)

# Output Directories
RESULTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Test Results"))
SCREENSHOTS_DIR = os.path.join(RESULTS_DIR, "Screenshots")
LOGS_DIR = os.path.join(RESULTS_DIR, "Logs")

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

log_file_path = os.path.join(LOGS_DIR, "selenium.log")

def log(msg):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] [Selenium] {msg}"
    print(formatted)
    with open(log_file_path, "a") as f:
        f.write(formatted + "\n")

# Base URL from env or fallback to local Expo web port
BASE_URL = os.getenv("BASE_URL", "http://localhost:8081").rstrip("/")

def run_tests():
    global BASE_URL
    
    # Validate if configured live URL is responsive
    is_live = False
    if "localhost" not in BASE_URL and "127.0.0.1" not in BASE_URL:
        log(f"Validating live URL: {BASE_URL}")
        try:
            import requests
            resp = requests.get(BASE_URL, timeout=5.0)
            if resp.status_code == 200:
                is_live = True
                log("Live URL is active and responsive!")
            else:
                log(f"Live URL returned status {resp.status_code}. Using local fallback.")
        except Exception as e:
            log(f"Live URL check failed: {e}. Using local fallback.")
            
    if not is_live:
        log("Redirecting target URL to local server fallback: http://localhost:8081")
        BASE_URL = "http://localhost:8081"

    # Setup Chrome Options
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1280,1024")

    log(f"Initializing Chrome WebDriver. Target URL: {BASE_URL}")
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(5)

    test_runs = []
    
    def run_case(name, func):
        start = time.perf_counter()
        log(f"Running Test: {name}...")
        # Sanitize filename by replacing non-alphanumeric characters with underscores
        safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', name.lower())
        try:
            func()
            elapsed = (time.perf_counter() - start) * 1000.0
            test_runs.append({
                "name": name,
                "status": "Passed",
                "duration_ms": elapsed,
                "error": ""
            })
            log(f"SUCCESS: {name} ({elapsed:.1f}ms)")
            # Capture success screenshot
            driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, f"{safe_name}.png"))
        except Exception as e:
            elapsed = (time.perf_counter() - start) * 1000.0
            err_msg = str(e) or traceback.format_exc()
            test_runs.append({
                "name": name,
                "status": "Failed",
                "duration_ms": elapsed,
                "error": err_msg
            })
            log(f"FAILED: {name} ({elapsed:.1f}ms) - Error: {err_msg}")
            # Capture error screenshot
            driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, f"{safe_name}_error.png"))

    try:
        # Initial navigation
        login_page = LoginPage(driver)
        
        # Test 1: Page Title Verification
        def test1():
            login_page.navigate_to(BASE_URL)
            time.sleep(3) # Wait for Expo JS bundle
            title = driver.title
            log(f"Page title is '{title}'")
            assert "ScanTrace" in title or "scantrace" in title.lower(), f"Page title does not match: {title}"
        run_case("Test 1: Web App Title Verification", test1)

        # Test 2: Login Screen Inputs
        def test2():
            assert login_page.check_inputs_present(), "Login input fields not found"
        run_case("Test 2: Login Screen Inputs", test2)

        # Test 3: Register Navigation
        def test3():
            login_page.navigate_to(BASE_URL + "/register")
            time.sleep(1)
            reg_page = RegisterPage(driver)
            assert reg_page.check_inputs_present(), "Register input fields not found"
        run_case("Test 3: Register Navigation", test3)

        # Test 4: Forgot Password Navigation
        def test4():
            login_page.navigate_to(BASE_URL + "/forgot-password")
            time.sleep(1)
            fp_page = ForgotPasswordPage(driver)
            assert fp_page.check_inputs_present(), "Forgot password input fields not found"
        run_case("Test 4: Forgot Password Navigation", test4)

        # Test 5: Authenticated Session Initialization
        def test5():
            # Inject credentials in localStorage and reload
            login_page.navigate_to(BASE_URL)
            time.sleep(1)
            login_page.inject_mock_auth()
            driver.refresh()
            time.sleep(2)
            # Should redirect to /dashboard
            current_url = driver.current_url
            log(f"Current URL after session restoration: {current_url}")
        run_case("Test 5: Authenticated Session Initialization", test5)

        # Test 6: Dashboard View
        def test6():
            # Ensure mock API works
            login_page.mock_api_calls()
            db_page = DashboardPage(driver)
            assert db_page.is_loaded(), "Dashboard failed to load"
        run_case("Test 6: Dashboard View", test6)

        # Test 7: Reports Screen
        def test7():
            driver.get(BASE_URL + "/reports")
            time.sleep(1)
            login_page.mock_api_calls()
            rep_page = ReportsPage(driver)
            assert rep_page.is_loaded(), "Reports screen failed to load"
        run_case("Test 7: Reports Screen", test7)

        # Test 8: Upload Screen
        def test8():
            driver.get(BASE_URL + "/upload")
            time.sleep(1)
            login_page.mock_api_calls()
            up_page = UploadPage(driver)
            assert up_page.is_loaded(), "Upload screen failed to load"
        run_case("Test 8: Upload Screen", test8)

        # Test 9: Analytics Screen
        def test9():
            driver.get(BASE_URL + "/analytics")
            time.sleep(1)
            login_page.mock_api_calls()
            an_page = AnalyticsPage(driver)
            assert an_page.is_loaded(), "Analytics screen failed to load"
        run_case("Test 9: Analytics Screen", test9)

        # Test 10: Notifications Screen
        def test10():
            driver.get(BASE_URL + "/notifications")
            time.sleep(1)
            login_page.mock_api_calls()
            notif_page = NotificationsPage(driver)
            assert notif_page.is_loaded(), "Notifications screen failed to load"
        run_case("Test 10: Notifications Screen", test10)

        # Test 11: Access Screen
        def test11():
            driver.get(BASE_URL + "/access")
            time.sleep(1)
            login_page.mock_api_calls()
            ac_page = AccessPage(driver)
            assert ac_page.is_loaded(), "Access management screen failed to load"
        run_case("Test 11: Access Screen", test11)

        # Test 12: Profile Screen
        def test12():
            driver.get(BASE_URL + "/profile")
            time.sleep(1)
            login_page.mock_api_calls()
            prof_page = ProfilePage(driver)
            assert prof_page.is_loaded(), "Profile screen failed to load"
        run_case("Test 12: Profile Screen", test12)

        # Test 13: Settings Screen
        def test13():
            driver.get(BASE_URL + "/settings")
            time.sleep(1)
            login_page.mock_api_calls()
            set_page = SettingsPage(driver)
            assert set_page.is_loaded(), "Settings screen failed to load"
        run_case("Test 13: Settings Screen", test13)

        # Test 14: Logout Flow
        def test14():
            driver.get(BASE_URL + "/settings")
            time.sleep(1)
            # Clear storage to simulate logout
            driver.execute_script("localStorage.clear();")
            driver.get(BASE_URL)
            time.sleep(2)
            # Should land back on login page
            login_page = LoginPage(driver)
            assert login_page.check_inputs_present(), "Logout failed to redirect to Login screen"
        run_case("Test 14: Logout Flow", test14)

    finally:
        driver.quit()

    # Save results to json
    results_json = os.path.join(RESULTS_DIR, "test_results.json")
    with open(results_json, "w") as f:
        json.dump(test_runs, f, indent=4)
        
    log("All test cases completed and results stored.")
    
    # Check if there's any failure
    failed_count = len([r for r in test_runs if r["status"] == "Failed"])
    if failed_count > 0:
        log(f"Execution finished with {failed_count} failures.")
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(run_tests())
