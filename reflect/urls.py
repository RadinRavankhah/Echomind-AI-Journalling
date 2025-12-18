# reflect/urls.py
from django.urls import path
from .views import ReflectView, SemanticSearchView

urlpatterns = [
    path("reflect/", ReflectView.as_view(), name="reflect"),
    path("search/", SemanticSearchView.as_view(), name="semantic_search"),
]
