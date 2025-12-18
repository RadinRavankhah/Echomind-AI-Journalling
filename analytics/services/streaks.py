from datetime import timedelta
from django.utils.timezone import now
from journals.models import JournalEntry

def calculate_streak(user):
    today = now().date()
    streak = 0

    current_day = today

    while True:
        exists = JournalEntry.objects.filter(
            user=user,
            created_at__date=current_day
        ).exists()

        if not exists:
            break

        streak += 1
        current_day -= timedelta(days=1)

    return streak
