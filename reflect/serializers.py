# reflect/serializers.py
from rest_framework import serializers

class ReflectionRequestSerializer(serializers.Serializer):
    text = serializers.CharField()
    entry_id = serializers.UUIDField()

class SearchSerializer(serializers.Serializer):
    query = serializers.CharField()
    limit = serializers.IntegerField(default=5)
