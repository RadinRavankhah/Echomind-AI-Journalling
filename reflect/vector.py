# reflect/vector.py
from langchain_community.vectorstores import Chroma
from django.conf import settings
from .embeddings import CustomEmbeddings
import os

VECTOR_DIR = os.path.join(settings.BASE_DIR, "chroma")

_embeddings = CustomEmbeddings()

def get_vectorstore(user_id: int) -> Chroma:
    return Chroma(
        collection_name=f"user_{user_id}",
        embedding_function=_embeddings,
        persist_directory=VECTOR_DIR,
    )
