import os
import sys

import requests
import sqlite3

# Congress.gov API key (https://api.congress.gov/sign-up/)
API_KEY = os.getenv("CONGRESS_API_KEY")

if not API_KEY:
    sys.exit("Set CONGRESS_API_KEY in your environment first.")

url = f"https://api.congress.gov/v3/member?api_key={API_KEY}&limit=50"

response = requests.get(url)
response.raise_for_status()
data = response.json()

connection = sqlite3.connect("../backend/freedomparty.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS politicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT,
    party TEXT,
    state TEXT
)
""")

members = data["members"]

for member in members:

    name = member["name"]
    party = member["partyName"]
    state = member["state"]

    cursor.execute(
        """
        INSERT INTO politicians (name, position, party, state)
        VALUES (?, ?, ?, ?)
        """,
        (name, "Congress Member", party, state)
    )

connection.commit()
connection.close()

print("House members added to database.")
