
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")

# Set the OpenAI API key
openai.api_key = openai_api_key

class TranslationRequest(BaseModel):
    text: str
    target_language: str = "Urdu" # Default to Urdu

@app.post("/translate/")
async def translate_text(request: TranslationRequest):
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo", # Or gpt-4, depending on availability and preference
            messages=[
                {"role": "system", "content": f"You are a helpful assistant that translates text into {request.target_language}."},
                {"role": "user", "content": f"Translate the following text into {request.target_language}:\n\n{request.text}"}
            ]
        )
        translated_text = response.choices[0].message.content
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}
