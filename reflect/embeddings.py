# reflect/embeddings.py
import os
import requests
from typing import List
from langchain_core.embeddings import Embeddings

class CustomEmbeddings(Embeddings):
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        response = requests.post(
            f"{os.environ['CUSTOM_LLM_BASE_URL']}/embeddings",
            headers={
                "Authorization": f"Bearer {os.environ['CUSTOM_LLM_API_KEY']}",
                "Content-Type": "application/json",
            },
            json={
                "model": os.environ["CUSTOM_EMBEDDING_MODEL_NAME"],
                "texts": texts,
            },
            timeout=60,
        )
        response.raise_for_status()
        return response.json()["embeddings"]

    def embed_query(self, text: str) -> List[float]:
        return self.embed_documents([text])[0]
