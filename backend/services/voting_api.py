import requests

BASE_URL = "https://www.govtrack.us/api/v2/vote"


def search_votes(query=""):
    # GovTrack's /api/v2/vote endpoint has no full-text `q` parameter, so
    # fetch the most recent votes and filter locally on the question text.
    params = {
        "order_by": "-created",
        "limit": 50,
    }

    try:
        res = requests.get(BASE_URL, params=params, timeout=10)

        if res.status_code != 200:
            return []

        data = res.json()

        query_lower = query.lower().strip()
        results = []

        for vote in data.get("objects", []):
            question = vote.get("question") or ""

            if query_lower and query_lower not in question.lower():
                continue

            congress = vote.get("congress")
            session = vote.get("session")
            chamber = vote.get("chamber")
            number = vote.get("number")

            if all(v is not None for v in (congress, session, chamber, number)):
                chamber_letter = "h" if str(chamber).lower().startswith("h") else "s"
                link = f"https://www.govtrack.us/congress/votes/{congress}-{session}/{chamber_letter}{number}"
            else:
                link = "https://www.govtrack.us/congress/votes"

            results.append({
                "question": question,
                "result": vote.get("result"),
                "date": vote.get("created"),
                "link": link,
            })

            if len(results) >= 10:
                break

        return results

    except requests.RequestException:
        return []
