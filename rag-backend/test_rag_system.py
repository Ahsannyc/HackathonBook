#!/usr/bin/env python3
"""
Test script to verify RAG system components work individually
"""
import os
from dotenv import load_dotenv
from rag import RAGSystem

# Load environment variables
load_dotenv()

def test_openai_connection():
    """Test if OpenAI API is accessible"""
    print("Testing OpenAI API connection...")
    try:
        rag_system = RAGSystem()
        print("[OK] RAGSystem initialized successfully")

        # Test embedding generation
        test_text = "This is a test sentence."
        embedding = rag_system.embed_text(test_text)
        print(f"[OK] Embedding generated successfully, length: {len(embedding)}")

        # Test answer generation with selected text
        answer = rag_system.answer_from_selected_text(
            "What is this text about?",
            "This is a sample text about robotics and AI technologies."
        )
        print(f"[OK] Selected text answer generated: {answer}")

        return True
    except Exception as e:
        print(f"[ERROR] Error testing OpenAI connection: {e}")
        return False

def test_qdrant_connection():
    """Test if Qdrant connection works"""
    print("\nTesting Qdrant connection...")
    try:
        rag_system = RAGSystem()

        # Try to get collection info
        collection_info = rag_system.qdrant_client.get_collection(rag_system.collection_name)
        print(f"[OK] Qdrant collection exists: {rag_system.collection_name}")
        print(f"[OK] Points count: {collection_info.points_count}")
        return True
    except Exception as e:
        print(f"[ERROR] Error testing Qdrant connection: {e}")
        return False

if __name__ == "__main__":
    print("Testing RAG System Components\n")

    # Test OpenAI connection
    openai_ok = test_openai_connection()

    # Test Qdrant connection
    qdrant_ok = test_qdrant_connection()

    print(f"\nSummary:")
    print(f"OpenAI API: {'[OK]' if openai_ok else '[ERROR]'}")
    print(f"Qdrant: {'[OK]' if qdrant_ok else '[ERROR]'}")

    if openai_ok and qdrant_ok:
        print("[SUCCESS] All systems are working!")
    else:
        print("[WARNING] Some systems have issues that need to be addressed.")