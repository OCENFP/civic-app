import os
import sys

import requests
import sqlite3

# Congress.gov API key (https://api.congress.gov/sign-up/)
API_KEY = os.getenv("CONGRESS_API_KEY")

if not API_KEY:
    sys.exit("Set CONGRESS_API_KEY in your environment first.")

url = f"https://api.congress.gov/v3/member?api_key={API_KEY}&limit=250&currentMember=true"

response = requests.get(url, timeout=30)
response.raise_for_status()
data = response.json()

DB_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "backend", "freedomparty.db"
)

connection = sqlite3.connect(DB_PATH)
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS politicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT,
    party TEXT,
    state TEXT,
    UNIQUE(name, position, state)
)
""")


def latest_chamber(member):
    terms = member.get("terms", {}).get("item", [])
    if not terms:
        return ""
    return terms[-1].get("chamber", "")


house_count = 0

for member in data.get("members", []):
    if "House" not in latest_chamber(member):
        continue

    name = member["name"]
    party = member.get("partyName", "Unknown")
    state = member.get("state", "Unknown")

    cursor.execute(
        """
        INSERT OR IGNORE INTO politicians (name, position, party, state)
        VALUES (?, ?, ?, ?)
        """,
        (name, "House Member", party, state)
    )
    house_count += 1

connection.commit()
connection.close()

print(f"{house_count} House members processed.")
