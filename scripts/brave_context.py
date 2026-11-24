#!/usr/bin/env python3
"""
SADV41 Brave Search LLM Context Client
Endpoint: https://api.search.brave.com/res/v1/llm/context
"""
import os
import sys
import json
import requests

BRAVE_CONTEXT_URL = "https://api.search.brave.com/res/v1/llm/context"

def get_api_key() -> str:
    key = os.environ.get("BRAVE_API_KEY", "").strip()
    if key:
        return key
    env_path = os.path.expanduser("~/.sadv41.env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("BRAVE_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""

def search_llm_context(query: str) -> dict:
    api_key = get_api_key()
    if not api_key:
        raise RuntimeError("Falta BRAVE_API_KEY en el entorno o en ~/.sadv41.env")

    response = requests.get(
        BRAVE_CONTEXT_URL,
        headers={
            "Accept": "application/json",
            "X-Subscription-Token": api_key,
        },
        params={"q": query},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()

if __name__ == "__main__":
    q = " ".join(sys.argv[1:]).strip() or "S&P 500 Panama"
    data = search_llm_context(q)
    print(json.dumps(data, indent=2, ensure_ascii=False))
