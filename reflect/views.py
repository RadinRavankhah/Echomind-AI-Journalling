# reflect/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from journals.models import JournalEntry, PromptResponse
from .serializers import ReflectionRequestSerializer, SearchSerializer
from .services import reflect_text
from .vector import get_vectorstore

class ReflectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReflectionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        entry = JournalEntry.objects.get(
            id=serializer.validated_data["entry_id"],
            user=request.user,
        )

        reflection, vector_id = reflect_text(
            user_id=request.user.id,
            text=serializer.validated_data["text"],
            metadata={
                "entry_id": str(entry.id),
                "user_id": request.user.id,
            },
        )

        PromptResponse.objects.filter(
            entry=entry,
            user_text=serializer.validated_data["text"],
        ).update(
            llm_reflection=reflection,
            embedding_id=vector_id,
        )

        return Response({"reflection": reflection})


class SemanticSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        vectorstore = get_vectorstore(request.user.id)

        results = vectorstore.similarity_search(
            serializer.validated_data["query"],
            k=serializer.validated_data["limit"],
        )

        return Response([
            {
                "text": r.page_content,
                "metadata": r.metadata,
            }
            for r in results
        ])
