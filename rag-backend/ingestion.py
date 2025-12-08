import os
import re
from pathlib import Path
from typing import List, Dict, Any
import markdown
from bs4 import BeautifulSoup
import logging
from qdrant_client import QdrantClient
from qdrant_client.http import models
import uuid
from openai import OpenAI
from dotenv import load_dotenv
import dashscope
from dashscope import TextEmbedding

# Load environment variables from .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentIngestor:
    def __init__(self):
        self.qdrant_client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        self.collection_name = "hackathon_book_docs"

        # Initialize Qwen (DashScope)
        api_key = os.getenv("QWEN_API_KEY")
        if not api_key:
            raise ValueError("QWEN_API_KEY environment variable is not set")

        dashscope.api_key = api_key

        # Create the collection if it doesn't exist
        self._create_collection()

    def _create_collection(self):
        """Create Qdrant collection if it doesn't exist"""
        try:
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection {self.collection_name} already exists")
        except:
            # Create collection with appropriate vector size for text-embedding-v1
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE)
            )
            logger.info(f"Created collection {self.collection_name}")

    def extract_text_from_markdown(self, file_path: str) -> str:
        """Extract text content from a markdown file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()

        # Convert markdown to HTML and then extract text
        html_content = markdown.markdown(markdown_content)
        soup = BeautifulSoup(html_content, 'html.parser')
        text = soup.get_text()

        # Clean up the text
        text = re.sub(r'\n+', '\n', text)  # Replace multiple newlines with single
        text = re.sub(r' +', ' ', text)    # Replace multiple spaces with single
        text = text.strip()

        return text

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0

        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]

            # If the chunk is smaller than chunk_size, we've reached the end
            if len(chunk) < chunk_size:
                chunks.append(chunk)
                break

            # Try to break at sentence boundary if possible
            last_period = chunk.rfind('.', 0, chunk_size - overlap)
            if last_period != -1 and last_period > chunk_size // 2:
                chunk = text[start:start + last_period + 1]
                end = start + last_period + 1

            chunks.append(chunk)
            start = end - overlap

        return chunks

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for text using Qwen's embedding API"""
        try:
            response = TextEmbedding.call(
                model='text-embedding-v1',
                input=text
            )
            if response.status_code == 200:
                embedding = response.output['embeddings'][0]['embedding']
                return embedding
            else:
                logger.error(f"Error generating embedding: {response.code}, {response.message}")
                return [0.0] * 1024  # text-embedding-v1 returns 1024 dimensional vectors
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            # Return a zero vector as fallback
            return [0.0] * 1024  # text-embedding-v1 returns 1024 dimensional vectors

    def ingest_documents(self, docs_dir: str = "docs"):
        """Ingest all markdown documents from the specified directory"""
        markdown_files = []

        # Find all markdown files in the docs directory and subdirectories
        for root, dirs, files in os.walk(docs_dir):
            for file in files:
                if file.endswith('.md') or file.endswith('.mdx'):
                    markdown_files.append(os.path.join(root, file))

        logger.info(f"Found {len(markdown_files)} markdown files to process")

        processed_count = 0
        points = []

        for file_path in markdown_files:
            logger.info(f"Processing file: {file_path}")

            try:
                # Extract text from the markdown file
                text_content = self.extract_text_from_markdown(file_path)

                # Chunk the text
                chunks = self.chunk_text(text_content)

                # Process each chunk
                for i, chunk in enumerate(chunks):
                    if chunk.strip():  # Only process non-empty chunks
                        # Create embedding for the chunk
                        embedding = self.embed_text(chunk)

                        # Create a unique ID for this chunk
                        chunk_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{file_path}_chunk_{i}"))

                        # Create a point for Qdrant
                        point = models.PointStruct(
                            id=chunk_id,
                            vector=embedding,
                            payload={
                                "content": chunk,
                                "source": file_path,
                                "metadata": {
                                    "file_path": file_path,
                                    "chunk_index": i,
                                    "total_chunks": len(chunks)
                                }
                            }
                        )
                        points.append(point)

                processed_count += 1
                logger.info(f"Processed {len(chunks)} chunks from {file_path}")

            except Exception as e:
                logger.error(f"Error processing file {file_path}: {str(e)}")

        # Upload all points to Qdrant
        if points:
            logger.info(f"Uploading {len(points)} points to Qdrant...")
            self.qdrant_client.upload_points(
                collection_name=self.collection_name,
                points=points
            )
            logger.info(f"Successfully uploaded {len(points)} points to Qdrant")

        logger.info(f"Ingestion complete. Processed {processed_count} files.")
        return processed_count

if __name__ == "__main__":
    # Create an instance of the document ingestor
    ingestor = DocumentIngestor()

    # Get the docs directory relative to the project root
    project_root = Path(__file__).parent.parent
    docs_dir = project_root / "docs"

    # Ingest documents
    count = ingestor.ingest_documents(str(docs_dir))
    logger.info(f"Ingested {count} markdown files from {docs_dir}")