# auth_system/urls.py
from django.urls import path
# Add api_google_login to the import list here:
from accounts.views import api_login, api_register, api_google_login 

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from accounts.views import api_update_profile, api_change_password


urlpatterns = [

# JWT endpoints (NEW)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),


    path('api/auth/login/', api_login),
    path('api/auth/register/', api_register),
    path('api/auth/google/', api_google_login),

path('api/auth/update-profile/', api_update_profile, name='update_profile'),
path('api/auth/change-password/', api_change_password, name='change_password'),
    
]