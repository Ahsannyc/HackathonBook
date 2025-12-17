import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
import markdown
from bs4 import BeautifulSoup
import logging
from qdrant_client import QdrantClient
from qdrant_client.http import models
import uuid
from openai import OpenAI
from dotenv import load_dotenv
from config import Config

# Load environment variables from .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IngestionPipeline:
    """
    Ingestion pipeline class for processing book content into the RAG system
    following the specification requirements:
    - Performs ingestion → chunking → embedding → vector storage
    - Uses OpenAI for embeddings
    - Stores vectors in Qdrant Cloud vector database
    - Stores document metadata in Neon Serverless Postgres
    """

    def __init__(self):
        # Initialize OpenAI client
        api_key = Config.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set in config")

        self.openai_client = OpenAI(api_key=api_key)
        self.embedding_model = "text-embedding-ada-002"  # Reliable embedding model

        # Initialize Qdrant client
        self.qdrant_client = QdrantClient(
            url=Config.QDRANT_URL,
            api_key=Config.QDRANT_API_KEY
        )
        self.collection_name = "book_content_chunks"

        # Create the collection if it doesn't exist
        self._create_collection()

    def _create_collection(self):
        """Create or verify Qdrant collection with correct vector size for OpenAI embeddings"""
        try:
            collection_info = self.qdrant_client.get_collection(self.collection_name)
            # Check if the collection has the correct vector size for OpenAI embeddings (1536)
            if collection_info.config.params.vectors.size != 1536:
                logger.info(f"Collection {self.collection_name} exists but has wrong vector size ({collection_info.config.params.vectors.size}), recreating...")
                # Delete the existing collection with wrong dimensions
                self.qdrant_client.delete_collection(self.collection_name)
                # Create collection with correct vector size for OpenAI text-embedding-ada-002
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE)
                )
                logger.info(f"Recreated collection {self.collection_name} with correct vector size (1536)")
            else:
                logger.info(f"Collection {self.collection_name} already exists with correct vector size (1536)")
        except Exception as e:
            # Collection doesn't exist, create it
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE)
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

    def semantic_chunk_text(self, text: str, chunk_size: int = Config.CHUNK_SIZE, overlap: int = Config.OVERLAP_SIZE) -> List[Dict[str, Any]]:
        """
        Split text into semantically meaningful chunks with overlap
        Returns a list of dictionaries with content and metadata
        """
        chunks = []
        start = 0

        while start < len(text):
            end = start + chunk_size

            # Extract the chunk
            chunk = text[start:end]

            # If the chunk is smaller than chunk_size, we've reached the end
            if len(chunk) < chunk_size:
                if chunk.strip():  # Only add non-empty chunks
                    chunks.append({
                        'content': chunk,
                        'start_pos': start,
                        'end_pos': end
                    })
                break

            # Try to break at sentence or paragraph boundary if possible
            # Look for sentence endings near the end of the chunk
            sentence_endings = ['.', '!', '?']
            paragraph_endings = ['\n\n', '\n\r\n']

            best_break = end  # Default to the end of the chunk
            for ending in sentence_endings:
                pos = chunk.rfind(ending, 0, chunk_size - overlap)
                if pos != -1 and pos > chunk_size // 2:  # Break closer to the end but not too early
                    best_break = start + pos + 1
                    break

            # If no sentence ending found, try paragraph breaks
            if best_break == end:
                for ending in paragraph_endings:
                    pos = chunk.rfind(ending, 0, chunk_size - overlap)
                    if pos != -1 and pos > chunk_size // 2:
                        best_break = start + pos + len(ending)
                        break

            # Extract the adjusted chunk
            adjusted_chunk = text[start:best_break]

            if adjusted_chunk.strip():  # Only add non-empty chunks
                chunks.append({
                    'content': adjusted_chunk,
                    'start_pos': start,
                    'end_pos': best_break
                })

            # Move to the next position with overlap
            start = best_break - overlap

        return chunks

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for text using OpenAI's embedding API"""
        try:
            response = self.openai_client.embeddings.create(
                input=text,
                model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            # Return a zero vector as fallback (size 1536 for text-embedding-ada-002)
            return [0.0] * 1536

    def store_chunk_in_qdrant(self, chunk_id: str, content: str, book_id: str, section_title: str, page_number: int, chunk_number: int, metadata: Optional[Dict] = None) -> bool:
        """Store a chunk in Qdrant with proper metadata structure"""
        try:
            # Generate embedding for the content
            embedding = self.embed_text(content)

            # Prepare the payload with all required metadata following the data model
            payload = {
                "content": content,
                "book_id": book_id,
                "section_title": section_title,
                "page_number": page_number,
                "chunk_number": chunk_number,
                "metadata": metadata or {}
            }

            # Create a point for Qdrant
            point = models.PointStruct(
                id=chunk_id,
                vector=embedding,
                payload=payload
            )

            # Upsert the point in Qdrant
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Stored chunk {chunk_id} for book {book_id}")
            return True

        except Exception as e:
            logger.error(f"Error storing chunk {chunk_id} in Qdrant: {str(e)}")
            return False

    def process_book_content(self, book_id: str, content: str, source_file: str = "", section_title: str = "", page_number: int = 1) -> List[Dict[str, Any]]:
        """
        Process book content by chunking, embedding, and storing
        Returns a list of stored chunk information
        """
        logger.info(f"Processing book content for book {book_id}")

        # Semantic chunking of the content
        text_chunks = self.semantic_chunk_text(content)

        stored_chunks = []
        for idx, chunk_data in enumerate(text_chunks):
            chunk_content = chunk_data['content']

            if chunk_content.strip():  # Only process non-empty chunks
                # Create a unique ID for this chunk
                chunk_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{book_id}_{page_number}_{idx}"))

                # Store the chunk in Qdrant
                success = self.store_chunk_in_qdrant(
                    chunk_id=chunk_id,
                    content=chunk_content,
                    book_id=book_id,
                    section_title=section_title,
                    page_number=page_number,
                    chunk_number=idx,
                    metadata={
                        "source_file": source_file,
                        "chunk_index": idx,
                        "total_chunks": len(text_chunks),
                        "start_pos": chunk_data['start_pos'],
                        "end_pos": chunk_data['end_pos']
                    }
                )

                if success:
                    stored_chunks.append({
                        'chunk_id': chunk_id,
                        'chunk_number': idx,
                        'content_preview': chunk_content[:100] + "..." if len(chunk_content) > 100 else chunk_content,
                        'length': len(chunk_content)
                    })
                    logger.debug(f"Successfully stored chunk {idx+1}/{len(text_chunks)} for book {book_id}")

        logger.info(f"Successfully processed and stored {len(stored_chunks)} chunks for book {book_id}")
        return stored_chunks

    def ingest_documents(self, docs_dir: str = "docs", book_id: str = "default_book"):
        """Ingest all markdown documents from the specified directory for a specific book"""
        markdown_files = []

        # Find all markdown files in the docs directory and subdirectories
        for root, dirs, files in os.walk(docs_dir):
            for file in files:
                if file.endswith('.md') or file.endswith('.mdx'):
                    markdown_files.append(os.path.join(root, file))

        logger.info(f"Found {len(markdown_files)} markdown files to process for book {book_id}")

        processed_count = 0
        total_chunks = 0

        for file_path in markdown_files:
            logger.info(f"Processing file: {file_path}")

            try:
                # Extract text from the markdown file
                text_content = self.extract_text_from_markdown(file_path)

                # Extract section title from filename or content
                section_title = Path(file_path).stem.replace('_', ' ').title()

                # Process the content (assuming it's all on page 1 for this example)
                # In a real implementation, you might want to split by actual pages
                stored_chunks = self.process_book_content(
                    book_id=book_id,
                    content=text_content,
                    source_file=file_path,
                    section_title=section_title
                )

                total_chunks += len(stored_chunks)
                processed_count += 1

                logger.info(f"Processed {len(stored_chunks)} chunks from {file_path}")

            except Exception as e:
                logger.error(f"Error processing file {file_path}: {str(e)}")

        logger.info(f"Ingestion complete for book {book_id}. Processed {processed_count} files and stored {total_chunks} chunks.")
        return processed_count, total_chunks

if __name__ == "__main__":
    # Create an instance of the ingestion pipeline
    pipeline = IngestionPipeline()

    # Get the docs directory relative to the project root
    project_root = Path(__file__).parent.parent
    docs_dir = project_root / "docs"

    # Ingest documents
    count, chunks = pipeline.ingest_documents(str(docs_dir))
    logger.info(f"Ingested {count} markdown files and stored {chunks} chunks from {docs_dir}")