from rest_framework import serializers

class StreakSerializer(serializers.Serializer):
    current_streak = serializers.IntegerField()

class FrequencySerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()
