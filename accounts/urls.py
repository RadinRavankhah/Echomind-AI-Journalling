# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, ProfileUpdateView, ChangePasswordView

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User
    path("me/", MeView.as_view(), name="me"),
    path("me/profile/", ProfileUpdateView.as_view(), name="profile_update"),
    path("me/change-password/", ChangePasswordView.as_view(), name="change_password"),
]
