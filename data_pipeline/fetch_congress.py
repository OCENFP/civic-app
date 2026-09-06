import os
import sys

import requests
import sqlite3

# Congress.gov API key (https://api.congress.gov/sign-up/)
API_KEY = os.getenv("CONGRESS_API_KEY")

if not API_KEY:
    sys.exit("Set CONGRESS_API_KEY in your environment first.")

# congress API endpoint
url = f"https://api.congress.gov/v3/member?api_key={API_KEY}&limit=50"

# request data from congress API
response = requests.get(url, timeout=30)
response.raise_for_status()

data = response.json()

# database lives next to the backend, wherever this script is run from
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

members = data["members"]

for member in members:

    name = member["name"]
    party = member.get("partyName", "Unknown")
    state = member.get("state", "Unknown")

    # INSERT OR IGNORE keeps re-runs idempotent (no duplicate rows)
    cursor.execute("""
    INSERT OR IGNORE INTO politicians (name, position, party, state)
    VALUES (?, ?, ?, ?)
    """, (name, "Congress Member", party, state))

connection.commit()
connection.close()

print(f"{len(members)} congress members processed.")
