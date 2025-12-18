# journals/models.py
import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class ReflectionSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reflection_sessions")
    title = models.CharField(max_length=200, blank=True)
    started_at = models.DateTimeField(default=timezone.now)
    ended_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Session {self.id} ({self.user})"


class JournalEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journal_entries")
    title = models.CharField(max_length=250, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    pinned = models.BooleanField(default=False)

    session = models.ForeignKey(
        ReflectionSession,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="entries",
    )

    def __str__(self):
        return f"Entry {self.id} ({self.user})"


class Prompt(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    body = models.TextField()

    is_system = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="custom_prompts",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class PromptResponse(models.Model):
    entry = models.ForeignKey(
        JournalEntry,
        on_delete=models.CASCADE,
        related_name="responses",
    )

    prompt = models.ForeignKey(
        Prompt,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="responses",
    )

    user_text = models.TextField()

    # Filled by reflect app
    llm_reflection = models.TextField(blank=True)
    embedding_id = models.CharField(max_length=255, blank=True)

    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"Response {self.id} for {self.entry_id}"


class EmotionTag(models.Model):
    entry = models.ForeignKey(
        JournalEntry,
        on_delete=models.CASCADE,
        related_name="emotion_tags",
    )

    emotion = models.CharField(max_length=50)
    intensity = models.FloatField(default=0.0)  # 0.0 → 1.0
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.emotion} ({self.intensity})"
