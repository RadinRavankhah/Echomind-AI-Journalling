from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services.streaks import calculate_streak
from .services.trends import entry_frequency
from .services.summaries import reflection_coverage
from .services.keywords import extract_emotions

class AnalyticsOverview(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "streak": calculate_streak(user),
            "entry_frequency": entry_frequency(user),
            "reflection_coverage": reflection_coverage(user),
            "emotional_trends": extract_emotions(user),
        })
