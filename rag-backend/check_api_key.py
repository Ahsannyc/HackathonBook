#!/usr/bin/env python3
"""
Script to check if the required API keys are properly set in the environment
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_api_keys():
    """Check if all required API keys are set"""
    print("Checking API Keys in Environment:")
    print("=" * 40)

    # Check for QWEN_API_KEY (required for RAG system and ingestion)
    qwen_api_key = os.getenv("QWEN_API_KEY")
    if qwen_api_key:
        print(f"[OK] QWEN_API_KEY: Set (length: {len(qwen_api_key)})")
        if "your_" in qwen_api_key or "placeholder" in qwen_api_key.lower():
            print("   [WARN] Warning: This appears to be a placeholder key")
    else:
        print("[MISSING] QWEN_API_KEY: NOT SET (This is required for the RAG system to work)")
        print("   Please add your Qwen API key to the .env file as QWEN_API_KEY")
        print("   Get your key from: https://dashscope.console.aliyun.com/")

    # Check for other keys
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if openai_api_key:
        print(f"[OK] OPENAI_API_KEY: Set (length: {len(openai_api_key)})")
    else:
        print("[MISSING] OPENAI_API_KEY: NOT SET")

    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    if qdrant_api_key:
        print(f"[OK] QDRANT_API_KEY: Set (length: {len(qdrant_api_key)})")
    else:
        print("[MISSING] QDRANT_API_KEY: NOT SET")

    print("=" * 40)

    # Check if the critical key is available
    if not qwen_api_key:
        print("[CRITICAL] QWEN_API_KEY is missing!")
        print("   The RAG system and ingestion will not work without this key.")
        print("   Please add QWEN_API_KEY to your .env file.")
        return False
    else:
        print("[SUCCESS] All required API keys are set!")
        return True

if __name__ == "__main__":
    check_api_keys()