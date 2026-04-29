# auth_system/urls.py
from django.urls import path
# Add api_google_login to the import list here:
from accounts.views import api_login, api_register, api_google_login 

urlpatterns = [
    path('api/auth/login/', api_login),
    path('api/auth/register/', api_register),
    path('api/auth/google/', api_google_login),
]