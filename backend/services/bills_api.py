import requests

BASE_URL = "https://www.govtrack.us/api/v2/bill"


def search_bills(query=""):
    params = {
        "q": query,
        "limit": 10,
    }

    try:
        res = requests.get(BASE_URL, params=params, timeout=10)

        if res.status_code != 200:
            return []

        data = res.json()

        results = []

        for bill in data.get("objects", []):
            # Canonical GovTrack URLs use congress + bill type + number;
            # links built from internal API ids 404.
            congress = bill.get("congress")
            bill_type = bill.get("bill_type")
            number = bill.get("number")

            if all(v is not None for v in (congress, bill_type, number)):
                link = f"https://www.govtrack.us/congress/bills/{congress}/{bill_type}{number}"
            else:
                link = "https://www.govtrack.us/congress/bills"

            results.append({
                "title": bill.get("title"),
                "summary": bill.get("summary", "No summary available"),
                "status": bill.get("current_status"),
                "link": link,
            })

        return results

    except requests.RequestException:
        return []
