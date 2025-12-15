import requests
from datetime import datetime

class TrafficLogger:
    def __init__(self, api_url="http://localhost:5000/api/log"):
        self.api_url = api_url

    def log_vehicle(self, label, location="Location A"):
        data = {
            'vehicle_type': label,
            'timestamp': datetime.now().isoformat(),
            'location': location
        }
        try:
            response = requests.post(self.api_url, json=data)
            if response.status_code == 201:
                print(f"Logged: {label}")
            else:
                print(f"Failed: {response.text}")
        except Exception as e:
            print(f"❌ Error: {str(e)}")