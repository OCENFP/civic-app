import json
import os

import requests

API_KEY = os.getenv("GOOGLE_API_KEY")

# NOTE: Google shut down the Civic Information representatives endpoint in
# April 2025. We still try it when a key is configured (in case of a proxy
# or replacement), but fall back to the local politicians dataset so the
# endpoint keeps returning data.
BASE_URL = "https://www.googleapis.com/civicinfo/v2/representatives"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _local_representatives(address=""):
    try:
        with open(os.path.join(BASE_DIR, "politicians.json"), "r") as f:
            politicians = json.load(f)
    except Exception:
        return []

    query = address.strip().lower()
    results = []

    for p in politicians:
        state = str(p.get("state", ""))
        if query and query not in state.lower() and query not in str(p.get("name", "")).lower():
            continue
        results.append({
            "name": p.get("name"),
            "role": p.get("position", "Representative"),
            "party": p.get("party", "Unknown"),
            "state": state or "USA",
        })

    return results


def get_representatives(address=""):
    if API_KEY:
        params = {
            "key": API_KEY,
            "address": address if address else "United States",
        }

        try:
            res = requests.get(BASE_URL, params=params, timeout=10)

            if res.status_code == 200:
                data = res.json()

                officials = data.get("officials", [])
                offices = data.get("offices", [])

                results = []
                for office in offices:
                    for index in office.get("officialIndices", []):
                        if index >= len(officials):
                            continue
                        official = officials[index]
                        results.append({
                            "name": official.get("name"),
                            "role": office.get("name"),
                            "party": official.get("party", "Unknown"),
                            "state": address if address else "USA",
                        })

                if results:
                    return results
        except requests.RequestException:
            pass

    return _local_representatives(address)
