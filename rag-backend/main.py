from rag import app
import uvicorn
from config import Config

if __name__ == "__main__":
    uvicorn.run(
        "rag:app",
        host=Config.BACKEND_HOST,
        port=Config.BACKEND_PORT,
        reload=True
    )