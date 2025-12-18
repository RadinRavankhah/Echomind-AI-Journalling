# journals/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    JournalEntryViewSet,
    PromptResponseViewSet,
    PromptViewSet,
    ReflectionSessionViewSet,
    EmotionTagViewSet,
)

router = DefaultRouter()
router.register(r"entries", JournalEntryViewSet, basename="entry")
router.register(r"responses", PromptResponseViewSet, basename="response")
router.register(r"prompts", PromptViewSet, basename="prompt")
router.register(r"sessions", ReflectionSessionViewSet, basename="session")
router.register(r"emotions", EmotionTagViewSet, basename="emotion")

urlpatterns = [
    path("", include(router.urls)),
]
