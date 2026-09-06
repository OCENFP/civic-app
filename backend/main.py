from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

# -----------------------
# ENV SETUP
# -----------------------
# Load .env BEFORE importing services: they read env vars at import time.
load_dotenv()

from services.google_civic_api import get_representatives
from services.bills_api import search_bills
from services.voting_api import search_votes
from rate_limit import is_rate_limited

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# -----------------------
# APP INIT
# -----------------------
app = FastAPI(title="Civic API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# SAFE JSON LOADER
# -----------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_json_file(path):
    try:
        with open(os.path.join(BASE_DIR, path), "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed loading {path}: {e}")
        return []

# -----------------------
# LOAD DATA
# -----------------------
constitution_data = load_json_file("constitution.json")
politicians_data = load_json_file("politicians.json")
lobbying_data = load_json_file("lobbying.json")

# -----------------------
# LEGAL SEARCH
# -----------------------
def find_relevant_section(question: str):
    if not constitution_data:
        return None

    question = question.lower()
    best_match = None
    best_score = 0

    for section in constitution_data:
        try:
            score = 0

            keywords = section.get("keywords", [])
            content = section.get("content", "").lower()

            for keyword in keywords:
                if keyword.lower() in question:
                    score += 5

            for word in question.split():
                if word in content:
                    score += 1

            if score > best_score:
                best_score = score
                best_match = section

        except Exception:
            continue

    return best_match

# -----------------------
# ROOT / HEALTH
# -----------------------
@app.get("/")
def root():
    return {"status": "running"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "openai_configured": bool(OPENAI_API_KEY)
    }

# -----------------------
# RIGHTS AI
# -----------------------
@app.get("/ask")
def ask(question: str, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if is_rate_limited(client_ip, limit=10, window_seconds=60):
        raise HTTPException(status_code=429, detail="Too many requests. Try again shortly.")

    if len(question) > 2000:
        raise HTTPException(status_code=400, detail="Question too long (max 2000 chars).")

    section = find_relevant_section(question)
    context = section["content"] if section else "No legal match found"

    if not client:
        return {
            "answer": f"(No AI key configured)\n\n{context}",
            "source": section["title"] if section else "None"
        }

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"""
You are a civic rights assistant.

Use this law:
{context}

Respond clearly:

1. Explanation
2. Your Rights
3. What To Do
"""
                },
                {"role": "user", "content": question}
            ]
        )

        answer = response.choices[0].message.content

    except Exception as e:
        print(f"[ERROR] OpenAI call failed: {e}")
        answer = f"(Fallback Mode)\n\n{context}"

    return {
        "answer": answer,
        "source": section["title"] if section else "None"
    }

# -----------------------
# REPRESENTATIVES
# -----------------------
@app.get("/representatives")
def get_reps(address: str = ""):
    try:
        return get_representatives(address)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------
# BILLS
# -----------------------
@app.get("/bills")
def get_bills(query: str = ""):
    try:
        return search_bills(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------
# VOTES
# -----------------------
@app.get("/votes")
def get_votes(query: str = ""):
    try:
        return search_votes(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------
# LOBBYING / MONEY
# -----------------------
@app.get("/lobbying")
def get_lobbying(name: str = ""):
    if not lobbying_data:
        return []

    if not name:
        return lobbying_data

    name = name.lower()

    results = [
        l for l in lobbying_data
        if name in l.get("politician", "").lower()
        or name in l.get("organization", "").lower()
    ]

    return results