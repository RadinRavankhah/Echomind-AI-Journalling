# journals/views.py
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from reflect.services import reflect_entry

from .models import (
    JournalEntry,
    Prompt,
    PromptResponse,
    ReflectionSession,
    EmotionTag,
)
from .serializers import (
    JournalEntrySerializer,
    PromptSerializer,
    PromptResponseSerializer,
    ReflectionSessionSerializer,
    EmotionTagSerializer,
)
from .permissions import IsOwner


class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "responses__user_text"]
    ordering_fields = ["created_at", "updated_at"]

    def get_queryset(self):
        return (
            JournalEntry.objects.filter(user=self.request.user)
            .prefetch_related("responses", "emotion_tags")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def toggle_pin(self, request, pk=None):
        entry = self.get_object()
        entry.pinned = not entry.pinned
        entry.save()
        return Response({"pinned": entry.pinned})

    @action(detail=True, methods=["post"])
    def reflect(self, request, pk=None):
        entry = self.get_object()  # ownership already enforced

        updated_ids = reflect_entry(entry)

        serializer = self.get_serializer(entry)
        return Response(
            {
                "detail": "Reflection completed",
                "reflected_responses": updated_ids,
                "entry": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class PromptResponseViewSet(viewsets.ModelViewSet):
    serializer_class = PromptResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PromptResponse.objects.filter(entry__user=self.request.user)

    def perform_create(self, serializer):
        entry = serializer.validated_data["entry"]
        if entry.user != self.request.user:
            raise permissions.PermissionDenied()

        order = entry.responses.count()
        serializer.save(order=order)


class PromptViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Prompt.objects.filter(is_system=True)


class ReflectionSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ReflectionSessionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return ReflectionSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EmotionTagViewSet(viewsets.ModelViewSet):
    serializer_class = EmotionTagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmotionTag.objects.filter(entry__user=self.request.user)

    def perform_create(self, serializer):
        entry = serializer.validated_data["entry"]
        if entry.user != self.request.user:
            raise permissions.PermissionDenied()
        serializer.save()
