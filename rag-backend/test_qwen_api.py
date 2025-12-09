#!/usr/bin/env python3
"""
Test script to verify Qwen API integration works properly
"""
import os
from dotenv import load_dotenv
from rag import RAGSystem

# Load environment variables
load_dotenv()

def test_qwen_embeddings():
    """Test Qwen embeddings functionality"""
    print("Testing Qwen embeddings...")
    try:
        rag_system = RAGSystem()
        print("[OK] RAGSystem initialized with Qwen successfully")

        # Test embedding generation
        test_text = "This is a test sentence for embedding."
        embedding = rag_system.embed_text(test_text)
        print(f"[OK] Embedding generated successfully, length: {len(embedding)}")

        # Test answer generation
        answer = rag_system.generate_answer(
            "What is this about?",
            [{"content": "This is a sample text about artificial intelligence and machine learning."}]
        )
        print(f"[OK] General answer generated: {answer[:50]}...")

        # Test selected text answer
        selected_answer = rag_system.answer_from_selected_text(
            "What is this text about?",
            "This is a sample text about robotics and AI technologies."
        )
        print(f"[OK] Selected text answer generated: {selected_answer[:50]}...")

        return True
    except Exception as e:
        print(f"[ERROR] Error testing Qwen: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_ingestion_qwen():
    """Test ingestion system with Qwen"""
    print("\nTesting ingestion system with Qwen...")
    try:
        from ingestion import DocumentIngestor
        ingestor = DocumentIngestor()
        print("[OK] DocumentIngestor initialized with Qwen successfully")

        # Test embedding generation in ingestion
        test_text = "Test document for ingestion."
        embedding = ingestor.embed_text(test_text)
        print(f"[OK] Ingestion embedding generated successfully, length: {len(embedding)}")

        return True
    except Exception as e:
        print(f"[ERROR] Error testing ingestion: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing Qwen API Integration\n")

    # Test RAG system
    rag_ok = test_qwen_embeddings()

    # Test ingestion system
    ingestion_ok = test_ingestion_qwen()

    print(f"\nSummary:")
    print(f"RAG System: {'[OK]' if rag_ok else '[ERROR]'}")
    print(f"Ingestion: {'[OK]' if ingestion_ok else '[ERROR]'}")

    if rag_ok and ingestion_ok:
        print("[SUCCESS] Qwen API integration is working!")
    else:
        print("[ERROR] Some issues were found with Qwen API integration.")