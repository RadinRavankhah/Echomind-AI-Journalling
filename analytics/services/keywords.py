import re
from collections import Counter
from journals.models import PromptResponse

EMOTION_KEYWORDS = [
    "sad", "anxious", "angry", "lonely", "empty",
    "hopeful", "calm", "overwhelmed", "tired",
    "numb", "happy", "fear", "guilt"
]

def extract_emotions(user, limit=10):
    reflections = PromptResponse.objects.filter(
        entry__user=user,
        llm_reflection__isnull=False
    ).values_list("llm_reflection", flat=True)

    counter = Counter()

    for text in reflections:
        text = text.lower()
        for word in EMOTION_KEYWORDS:
            if re.search(rf"\b{word}\b", text):
                counter[word] += 1

    return counter.most_common(limit)
