from journals.models import PromptResponse

def reflection_coverage(user):
    total = PromptResponse.objects.filter(
        entry__user=user
    ).count()

    reflected = PromptResponse.objects.filter(
        entry__user=user,
        llm_reflection__isnull=False
    ).count()

    return {
        "total_responses": total,
        "reflected_responses": reflected,
        "coverage": (reflected / total) if total else 0
    }
