# journals/serializers.py
from rest_framework import serializers
from .models import (
    JournalEntry,
    Prompt,
    PromptResponse,
    ReflectionSession,
    EmotionTag,
)


class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ["id", "slug", "title", "body", "is_system"]


class PromptResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromptResponse
        fields = [
            "id",
            "entry",
            "prompt",
            "user_text",
            "llm_reflection",
            "embedding_id",
            "order",
            "created_at",
        ]
        read_only_fields = ["llm_reflection", "embedding_id", "order", "created_at"]


class EmotionTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionTag
        fields = ["id", "emotion", "intensity", "created_at"]
        read_only_fields = ["created_at"]


class JournalEntrySerializer(serializers.ModelSerializer):
    # responses = PromptResponseSerializer(many=True, read_only=True)
    # emotion_tags = EmotionTagSerializer(many=True, read_only=True)

    class Meta:
        model = JournalEntry
        fields = [
            "id",
            "title",
            "created_at",
            "updated_at",
            "pinned",
            "emotion",
            "trigger",
            "intensity",
            "physical_effect",
            "context",
            "patterns",
            "related_people",
            "self_view_effect",
            "preferred_outcome",
            "plan_to_do",
            # "reflection",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            # "reflection"
        ]


class ReflectionSessionSerializer(serializers.ModelSerializer):
    entries = JournalEntrySerializer(many=True, read_only=True)

    class Meta:
        model = ReflectionSession
        fields = ["id", "title", "started_at", "ended_at", "entries"]
        read_only_fields = ["started_at", "entries"]
