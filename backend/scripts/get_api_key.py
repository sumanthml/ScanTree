import json
import httpx
from google.oauth2 import service_account
from google.auth.transport.requests import Request

def get_web_app_config():
    try:
        creds = service_account.Credentials.from_service_account_file(
            '/Users/applemac/Desktop/TREESCAN/backend/serviceAccountKey.json',
            scopes=['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/firebase']
        )
        creds.refresh(Request())
        access_token = creds.token
        project_id = creds.project_id
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }
        
        app_id = "1:372553281794:web:884cd82d03317b418a121b"
        config_url = f"https://firebase.googleapis.com/v1beta1/projects/{project_id}/webApps/{app_id}/config"
        config_response = httpx.get(config_url, headers=headers)
        if config_response.status_code == 200:
            config_data = config_response.json()
            print("App Config:")
            print(json.dumps(config_data, indent=2))
        else:
            print(f"Error getting config: {config_response.status_code}")
            print(config_response.text)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    get_web_app_config()
