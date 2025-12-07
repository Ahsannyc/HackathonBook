
import os
from qdrant_client import QdrantClient, models
from openai import OpenAI
from dotenv import load_dotenv
import markdown
from bs4 import BeautifulSoup

# Load environment variables from .env file
load_dotenv()

# Configuration
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
COLLECTION_NAME = "module1_robotics"

# Initialize OpenAI client
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set")
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Qdrant client
# If QDRANT_API_KEY is provided, connect to Qdrant Cloud
if QDRANT_API_KEY:
    qdrant_client = QdrantClient(
        host=QDRANT_HOST,
        port=QDRANT_PORT,
        api_key=QDRANT_API_KEY,
    )
else:
    # Connect to local Qdrant instance
    qdrant_client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

def clean_markdown(markdown_text: str) -> str:
    # Convert markdown to HTML
    html = markdown.markdown(markdown_text)
    # Use BeautifulSoup to strip HTML tags
    soup = BeautifulSoup(html, 'html.parser')
    return soup.get_text()

def ingest_module_content(file_path: str):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove frontmatter for cleaner text processing
    if content.startswith('---'):
        _, _, content = content.split('---', 2)

    # Clean markdown to plain text
    cleaned_content = clean_markdown(content)

    # Simple chunking for now (e.g., by paragraph or sentence for better context)
    # For production, consider more advanced chunking strategies (e.g., recursive character text splitter)
    chunks = [chunk.strip() for chunk in cleaned_content.split('\n\n') if chunk.strip()]

    # Ensure the collection exists
    qdrant_client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(size=len(get_embedding("test")), distance=models.Distance.COSINE),
    )
    print(f"Collection '{COLLECTION_NAME}' recreated.")

    points = []
    for i, chunk in enumerate(chunks):
        if not chunk: # Skip empty chunks
            continue
        embedding = get_embedding(chunk)
        points.append(models.PointStruct(
            id=i,
            vector=embedding,
            payload={"text": chunk, "source": file_path}
        ))

    if points:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=points
        )
        print(f"Successfully ingested {len(points)} chunks into Qdrant collection '{COLLECTION_NAME}'.")
    else:
        print("No content chunks to ingest.")

if __name__ == "__main__":
    module1_file = "C:\\Users\\14loa\\Desktop\\IT\\GIAIC\\Q4 spec kit\\HackathonBook\\book\\docs\\module-1-robotic-nervous-system\\01-ros2-fundamentals.md"
    ingest_module_content(module1_file)
