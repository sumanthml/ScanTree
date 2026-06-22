from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(self.driver, 10)

    def navigate_to(self, url):
        self.driver.get(url)

    def wait_for_element(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_element(self, locator):
        return self.driver.find_element(*locator)

    def click_element(self, locator):
        element = self.wait.until(EC.element_to_be_clickable(locator))
        element.click()

    def type_text(self, locator, text):
        element = self.wait_for_element(locator)
        element.clear()
        element.send_keys(text)

    def inject_mock_auth(self):
        # Injects mock authentication credentials directly into localStorage
        mock_user = '{"id":"mock-uid","name":"Test User","email":"test@example.com"}'
        mock_profile = '{"id":"mock-profile-id","name":"Test Profile"}'
        self.driver.execute_script(f"localStorage.setItem('access_token', 'mock-token');")
        self.driver.execute_script(f"localStorage.setItem('scantree_user', '{mock_user}');")
        self.driver.execute_script(f"localStorage.setItem('scantree_active_profile', '{mock_profile}');")
        self.driver.execute_script("localStorage.setItem('backend_url', 'http://localhost:8000');")

    def mock_api_calls(self):
        # Inject network mocks for API responses
        mock_script = """
        window.fetch = async function(url, options) {
            console.log("Mock fetch intercepting URL:", url);
            if (url.includes('/profiles')) {
                return new Response(JSON.stringify([{
                    id: "mock-profile-id",
                    name: "Test Profile",
                    age: 30,
                    gender: "Male",
                    is_primary: true
                }]), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (url.includes('/reports')) {
                return new Response(JSON.stringify([{
                    id: "mock-report-id",
                    profile_id: "mock-profile-id",
                    file_name: "blood_test_report.pdf",
                    status: "completed",
                    created_at: "2026-06-22T00:00:00Z"
                }]), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (url.includes('/dashboard')) {
                return new Response(JSON.stringify({
                    recent_scans: 12,
                    pending_scans: 0,
                    health_status: "Excellent"
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (url.includes('/analytics')) {
                return new Response(JSON.stringify({
                    trends: [
                        { biomarker: "Hemoglobin", value: 14.2, date: "2026-06-22" }
                    ]
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (url.includes('/notifications')) {
                return new Response(JSON.stringify([
                    { id: "notif-1", title: "Welcome to ScanTrace", read: false }
                ]), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (url.includes('/access/members')) {
                return new Response(JSON.stringify([
                    { id: "member-1", name: "Family Member", role: "Viewer" }
                ]), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            // Fallback response
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        };
        """
        self.driver.execute_script(mock_script)

class LoginPage(BasePage):
    EMAIL_INPUT = (By.XPATH, "//input[@placeholder='you@example.com' or @type='email']")
    PASSWORD_INPUT = (By.XPATH, "//input[@placeholder='••••••••' or @type='password']")
    LOGIN_BUTTON = (By.XPATH, "//*[text()='Login' or text()='LOGIN' or @type='submit' or contains(text(), 'Login')]")
    REGISTER_LINK = (By.XPATH, "//*[contains(text(), 'Register') or contains(text(), 'Sign Up') or contains(text(), 'Create Account')]")
    FORGOT_PASSWORD_LINK = (By.XPATH, "//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'forgot password')]")

    def check_inputs_present(self):
        return self.wait_for_element(self.EMAIL_INPUT) and self.wait_for_element(self.PASSWORD_INPUT)

class RegisterPage(BasePage):
    EMAIL_INPUT = (By.XPATH, "//input[@placeholder='you@example.com' or @type='email']")
    PASSWORD_INPUT = (By.XPATH, "//input[@placeholder='••••••••' or @type='password']")
    NAME_INPUT = (By.XPATH, "//input[@placeholder='Your Name' or @placeholder='John Doe' or @type='text']")
    REGISTER_BUTTON = (By.XPATH, "//*[text()='Register' or text()='REGISTER' or contains(text(), 'Register')]")

    def check_inputs_present(self):
        return self.wait_for_element(self.EMAIL_INPUT) and self.wait_for_element(self.PASSWORD_INPUT)

class ForgotPasswordPage(BasePage):
    EMAIL_INPUT = (By.XPATH, "//input[@placeholder='you@example.com' or @type='email']")
    BACK_TO_LOGIN = (By.XPATH, "//*[contains(text(), 'Back to Login') or contains(text(), 'Sign In')]")

    def check_inputs_present(self):
        return self.wait_for_element(self.EMAIL_INPUT)

class DashboardPage(BasePage):
    DASHBOARD_HEADER = (By.XPATH, "//*[contains(text(), 'Dashboard') or contains(text(), 'Recent Scans')]")

    def is_loaded(self):
        return self.wait_for_element(self.DASHBOARD_HEADER)

class ReportsPage(BasePage):
    REPORTS_HEADER = (By.XPATH, "//*[contains(text(), 'Reports') or contains(text(), 'All Reports')]")

    def is_loaded(self):
        return self.wait_for_element(self.REPORTS_HEADER)

class UploadPage(BasePage):
    DROPZONE = (By.XPATH, "//*[contains(text(), 'Upload') or contains(text(), 'Select File') or contains(text(), 'Drag')]")

    def is_loaded(self):
        return self.wait_for_element(self.DROPZONE)

class AnalyticsPage(BasePage):
    ANALYTICS_HEADER = (By.XPATH, "//*[contains(text(), 'Analytics') or contains(text(), 'Trends')]")

    def is_loaded(self):
        return self.wait_for_element(self.ANALYTICS_HEADER)

class NotificationsPage(BasePage):
    NOTIFICATIONS_HEADER = (By.XPATH, "//*[contains(text(), 'Notifications') or contains(text(), 'Alerts')]")

    def is_loaded(self):
        return self.wait_for_element(self.NOTIFICATIONS_HEADER)

class AccessPage(BasePage):
    ACCESS_HEADER = (By.XPATH, "//*[contains(text(), 'Access') or contains(text(), 'Members')]")

    def is_loaded(self):
        return self.wait_for_element(self.ACCESS_HEADER)

class ProfilePage(BasePage):
    PROFILE_HEADER = (By.XPATH, "//*[contains(text(), 'Profile') or contains(text(), 'My Account')]")

    def is_loaded(self):
        return self.wait_for_element(self.PROFILE_HEADER)

class SettingsPage(BasePage):
    SETTINGS_HEADER = (By.XPATH, "//*[contains(text(), 'Settings')]")
    DARK_MODE_TOGGLE = (By.XPATH, "//*[contains(text(), 'Dark Mode') or contains(text(), 'Theme') or @type='checkbox']")

    def is_loaded(self):
        return self.wait_for_element(self.SETTINGS_HEADER)
