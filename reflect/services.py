# reflect/services.py
from journals.models import JournalEntry, PromptResponse
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

def reflect_entry(entry: JournalEntry):
    """
    Reflect all prompt responses in a journal entry.
    Skips already-reflected responses.
    """
    vectorstore = get_vectorstore(entry.user.id)
    updated = []

    for response in entry.responses.all():
        if response.llm_reflection:
            continue

        chain = prompt | llm
        reflection = chain.invoke({
            "system": SYSTEM_PROMPT,
            "text": response.user_text,
        })

        ids = vectorstore.add_texts(
            texts=[response.user_text],
            metadatas=[{
                "entry_id": str(entry.id),
                "response_id": response.id,
                "user_id": entry.user.id,
            }],
        )

        response.llm_reflection = reflection
        response.embedding_id = ids[0]
        response.save()

        updated.append(response.id)

    vectorstore.persist()
    return updated
