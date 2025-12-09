#!/usr/bin/env python3
"""
Debug script to check environment variable parsing
"""
import os
from dotenv import load_dotenv

print("Before loading .env file:")
print(f"QWEN_API_KEY = {os.getenv('QWEN_API_KEY', 'NOT SET')}")

# Load environment variables
load_dotenv()

print("\nAfter loading .env file:")
print(f"QWEN_API_KEY = {os.getenv('QWEN_API_KEY', 'NOT SET')}")
print(f"QWEN_API_KEY length = {len(os.getenv('QWEN_API_KEY', '')) if os.getenv('QWEN_API_KEY') else 'N/A'}")

# Show the actual content of the .env file related to QWEN
with open('../.env', 'r') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'QWEN' in line.upper():
            print(f"\nLine {i+1}: {line.strip()}")