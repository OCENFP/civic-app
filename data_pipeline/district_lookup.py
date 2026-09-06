import requests
import sqlite3

zipcode = "90210"

# get location from ZIP
url = f"https://api.zippopotam.us/us/{zipcode}"

response = requests.get(url)

data = response.json()

state = data["places"][0]["state"]

print("ZIP Code:", zipcode)
print("State:", state)

# connect to database (path is script-relative, not CWD-relative)
import os
DB_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "backend", "freedomparty.db"
)
connection = sqlite3.connect(DB_PATH)

cursor = connection.cursor()

cursor.execute(
    "SELECT name, position, party, state FROM politicians WHERE state = ?",
    (state,)
)

rows = cursor.fetchall()

print("\nRepresentatives from this state:\n")

for row in rows:
    print(row)

connection.close()