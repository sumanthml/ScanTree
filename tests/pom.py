from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

MOCK_SCRIPT = """
(function() {
    if (window.__networks_mocked) return;
    window.__networks_mocked = true;
    console.log("[MOCK NETWORK] Initializing Fetch and XHR Interceptors");

    const mockUser = {
        id: "mock-uid",
        name: "Test User",
        email: "test@example.com"
    };

    const mockProfile = {
        id: "mock-profile-id",
        full_name: "Test Profile",
        gender: "Male",
        date_of_birth: "1995-01-01",
        blood_group: "O+",
        relationship_type: "Self",
        is_primary: true
    };

    const mockReport = {
        id: "mock-report-id",
        report_name: "Blood Test Report",
        file_name: "blood_test_report.pdf",
        created_at: "2026-06-22T00:00:00Z",
        health_score: 85,
        status: "completed",
        summary: "Your overall biomarkers are within normal range with minor variations.",
        biomarkers: [
            { id: "b1", name: "Hemoglobin", value: "14.2", unit: "g/dL", severity: "normal", reference_range: "13.8-17.2", category: "Blood" },
            { id: "b2", name: "Cholesterol", value: "210", unit: "mg/dL", severity: "warning", reference_range: "<200", category: "Lipids" }
        ],
        ai_insights: [
            { id: "i1", title: "Slightly Elevated Cholesterol", description: "Your cholesterol level is slightly above normal. Consider a low-fat diet.", severity: "warning", recommendation: "Incorporate more fiber and exercise." }
        ]
    };

    const mockDashboard = {
        overview: {
            total_reports: 1,
            average_health_score: 85,
            latest_health_score: 85,
            abnormal_biomarkers: 1
        },
        health_history: [
            { health_score: 85, date: "2026-06-22" }
        ],
        critical_changes: [
            { name: "Cholesterol", change_percent: 5.2, trend: "up", risk_level: "low", clinical_status: "stable" }
        ],
        risk_progression: [
            { risk_level: "low", date: "2026-06-22" }
        ],
        biomarker_trends: [
            { biomarker: "Hemoglobin", value: 14.2, date: "2026-06-22" }
        ],
        recent_reports: [
            { id: "mock-report-id", file_name: "blood_test_report.pdf", health_score: 85, created_at: "2026-06-22" }
        ],
        ai_summary: [
            { title: "General Health Status", description: "Based on your latest scan, your general health parameters are stable. Pay attention to cholesterol levels." }
        ]
    };

    const mockAnalytics = {
        overview: {
            total_reports: 1,
            average_health_score: 85,
            latest_health_score: 85,
            abnormal_biomarkers: 1
        },
        health_history: [
            { health_score: 85, date: "2026-06-22" }
        ],
        dynamic_biomarkers: [
            {
                name: "Hemoglobin",
                unit: "g/dL",
                status: "normal",
                history: [{ date: "2026-06-22", value: 14.2 }]
            },
            {
                name: "Cholesterol",
                unit: "mg/dL",
                status: "warning",
                history: [{ date: "2026-06-22", value: 210 }]
            }
        ],
        critical_changes: [
            { name: "Cholesterol", change_percent: 5.2, trend: "up", risk_level: "low", clinical_status: "stable" }
        ],
        comparison_insights: [
            { title: "Lipids management", description: "Slight improvement or elevation in lipids. Maintain standard dietary care." }
        ]
    };

    const mockNotifications = {
        data: [
            { id: "notif-1", title: "Welcome to ScanTrace", message: "Start by uploading your lab report PDF to get instant insights.", type: "info", is_read: false, created_at: "2026-06-22T00:00:00Z" }
        ],
        unread_count: 1
    };

    const mockMembers = {
        success: true,
        data: [
            { id: "member-1", name: "Family Member", email: "family@example.com", permission_level: "viewer", status: "Accepted", created_at: "2026-06-22T00:00:00Z" }
        ]
    };

    const mockRequests = {
        success: true,
        data: [
            { id: "req-1", owner_name: "Doctor Friend", owner_email: "doc@example.com", permission_level: "editor", created_at: "2026-06-22T00:00:00Z" }
        ]
    };

    function getMockResponse(url, method, body) {
        console.log("[MOCK NETWORK] Intercepting request:", method, url);
        
        if (url.includes('signInWithPassword') || url.includes('signInWithCustomToken')) {
            return { idToken: "mock-id-token", localId: "mock-uid", email: "test@example.com" };
        }
        if (url.includes('resetPassword')) {
            return { email: "test@example.com", requestType: "PASSWORD_RESET" };
        }
        if (url.includes('/auth/register')) {
            return {
                custom_token: "mock-custom-token",
                user_id: "mock-uid",
                name: "Test User",
                email: "test@example.com"
            };
        }
        if (url.includes('/auth/sync')) {
            return {
                user_id: "mock-uid",
                name: "Test User",
                email: "test@example.com"
            };
        }
        if (url.includes('/auth/forgot-password')) {
            return { success: true, message: "Password reset link sent." };
        }
        if (url.includes('/profiles') && !url.includes('/reports') && !url.includes('/summary')) {
            const parts = url.split('/profiles/');
            if (parts.length > 1 && parts[1].length > 0) {
                return { success: true, data: mockProfile };
            }
            return { success: true, count: 1, data: [mockProfile] };
        }
        if (url.includes('/reports/')) {
            if (url.includes('/comparison')) {
                return {
                    success: true,
                    data: {
                        current_report_id: "mock-report-id",
                        previous_report_id: "prev-report-id",
                        comparison: {
                            biomarkers: [
                                { name: "Cholesterol", current: 210, previous: 200, change_percent: 5.0, trend: "up" }
                            ]
                        }
                    }
                };
            }
            if (url.includes('/download')) {
                return new Blob(["mock pdf content"], { type: "application/pdf" });
            }
            return mockReport;
        }
        if (url.includes('/reports') && url.includes('/profiles/')) {
            return {
                success: true,
                data: [mockReport],
                total: 1,
                pages: 1,
                page: 1
            };
        }
        if (url.includes('/dashboard')) {
            return mockDashboard;
        }
        if (url.includes('/analytics/profile/')) {
            return { success: true, data: mockAnalytics };
        }
        if (url.includes('/notifications')) {
            return mockNotifications;
        }
        if (url.includes('/access/members')) {
            return mockMembers;
        }
        if (url.includes('/access/requests')) {
            return mockRequests;
        }
        if (url.includes('/access/invite')) {
            return {
                success: true,
                message: "Invitation sent successfully",
                data: { id: "new-invite-id", shared_user_email: "guest@example.com", permission_level: "viewer", status: "Pending" }
            };
        }
        if (url.includes('/scans/upload')) {
            return { success: true, data: { scan_job_id: "mock-scan-job-id" } };
        }
        if (url.includes('/scans/') && url.includes('/status')) {
            return { success: true, data: { status: "COMPLETED", report_id: "mock-report-id" } };
        }
        return { success: true, data: {} };
    }

    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        const urlStr = typeof url === 'string' ? url : url.url;
        const method = (options && options.method) || 'GET';
        const isMockable = urlStr.includes('identitytoolkit.googleapis.com') ||
            urlStr.includes('/auth/') ||
            urlStr.includes('/profiles') ||
            urlStr.includes('/reports') ||
            urlStr.includes('/dashboard') ||
            urlStr.includes('/analytics') ||
            urlStr.includes('/notifications') ||
            urlStr.includes('/scans') ||
            urlStr.includes('/access');

        if (isMockable) {
            const mockData = getMockResponse(urlStr, method, options && options.body);
            return new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return originalFetch.apply(this, arguments);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        this._method = method;
        this._isMock = url.includes('identitytoolkit.googleapis.com') ||
            url.includes('/auth/') ||
            url.includes('/profiles') ||
            url.includes('/reports') ||
            url.includes('/dashboard') ||
            url.includes('/analytics') ||
            url.includes('/notifications') ||
            url.includes('/scans') ||
            url.includes('/access');
        originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(data) {
        const self = this;
        if (self._isMock) {
            const responseData = getMockResponse(self._url, self._method, data);
            const responseStr = JSON.stringify(responseData);
            
            Object.defineProperty(self, 'status', { get: function() { return 200; } });
            Object.defineProperty(self, 'statusText', { get: function() { return 'OK'; } });
            Object.defineProperty(self, 'readyState', { get: function() { return 4; } });
            Object.defineProperty(self, 'responseText', { get: function() { return responseStr; } });
            Object.defineProperty(self, 'response', { get: function() { 
                if (self.responseType === 'json') {
                    return responseData;
                }
                return responseStr; 
            } });
            Object.defineProperty(self, 'getAllResponseHeaders', { value: function() { return "content-type: application/json"; } });
            Object.defineProperty(self, 'getResponseHeader', { value: function(header) { if (header.toLowerCase() === 'content-type') return 'application/json'; return null; } });
            
            setTimeout(function() {
                if (self.onreadystatechange) {
                    self.onreadystatechange();
                }
                self.dispatchEvent(new Event('readystatechange'));
                
                if (self.onload) {
                    self.onload();
                }
                self.dispatchEvent(new Event('load'));
                
                if (self.onloadend) {
                    self.onloadend();
                }
                self.dispatchEvent(new Event('loadend'));
            }, 10);
        } else {
            originalSend.apply(this, arguments);
        }
    };
})();
"""

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
        # Injects mock authentication credentials directly into localStorage matching frontend types
        mock_user = '{"id":"mock-uid","name":"Test User","email":"test@example.com"}'
        mock_profile = '{"id":"mock-profile-id","full_name":"Test Profile"}'
        self.driver.execute_script("localStorage.setItem('access_token', 'mock-id-token');")
        self.driver.execute_script(f"localStorage.setItem('scantree_user', '{mock_user}');")
        self.driver.execute_script(f"localStorage.setItem('scantree_active_profile', '{mock_profile}');")
        self.driver.execute_script("localStorage.setItem('backend_url', 'http://localhost:8000');")

    def mock_api_calls(self):
        # Inject network mocks for API responses
        self.driver.execute_script(MOCK_SCRIPT)

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
