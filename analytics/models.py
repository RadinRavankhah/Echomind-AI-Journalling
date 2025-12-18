from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DailyStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()

    entries_count = models.PositiveIntegerField(default=0)
    reflections_count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "date")
        ordering = ["date"]

    def __str__(self):
        return f"{self.user} - {self.date}"
