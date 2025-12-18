# reflect/services.py
from langchain_core.prompts import PromptTemplate
from .llm import CustomLLM
from .vector import get_vectorstore

SYSTEM_PROMPT = """
You are a reflective mirror.
Do NOT give advice.
Do NOT judge.
Do NOT try to fix.
Only reflect emotions, patterns, and inner states.
"""

REFLECTION_TEMPLATE = """
SYSTEM:
{system}

USER:
{text}

REFLECTION:
"""

llm = CustomLLM(model_name="custom")

prompt = PromptTemplate(
    template=REFLECTION_TEMPLATE,
    input_variables=["system", "text"],
)

def reflect_text(user_id: int, text: str, metadata: dict):
    chain = prompt | llm

    reflection = chain.invoke({
        "system": SYSTEM_PROMPT,
        "text": text,
    })

    vectorstore = get_vectorstore(user_id)

    ids = vectorstore.add_texts(
        texts=[text],
        metadatas=[metadata],
    )

    vectorstore.persist()

    return reflection, ids[0]
