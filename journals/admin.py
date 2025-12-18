# journals/admin.py
from django.contrib import admin
from .models import (
    JournalEntry,
    Prompt,
    PromptResponse,
    ReflectionSession,
    EmotionTag,
)

admin.site.register(JournalEntry)
admin.site.register(Prompt)
admin.site.register(PromptResponse)
admin.site.register(ReflectionSession)
admin.site.register(EmotionTag)
