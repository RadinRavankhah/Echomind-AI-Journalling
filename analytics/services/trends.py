from django.db.models.functions import TruncDate
from django.db.models import Count
from journals.models import JournalEntry

def entry_frequency(user, days=30):
    qs = (
        JournalEntry.objects
        .filter(user=user)
        .annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )
    return list(qs)
