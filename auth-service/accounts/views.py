from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
import json
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

@csrf_exempt
def api_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse(
                    {"status": "error", "message": "Email and password are required"},
                    status=400,
                )

            user = authenticate(username=email, password=password)

            if user is None:
                return JsonResponse(
                    {"status": "error", "message": "Invalid email or password"},
                    status=401,
                )

            tokens = get_tokens_for_user(user)

            return JsonResponse(
                {
                    "status": "success",
                    "user": {
                        "email": user.email,
                        "name": user.first_name,
                        "username": user.username,
                    },
                    "tokens": tokens,
                }
            )

        except Exception as e:
            return JsonResponse(
                {"status": "error", "message": str(e)}, status=500
            )


@csrf_exempt
def api_register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse(
                    {"status": "error", "message": "Email and password required"},
                    status=400,
                )

            if User.objects.filter(username=email).exists():
                return JsonResponse(
                    {"status": "error", "message": "User already exists"},
                    status=400,
                )

            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name or "",
            )

            return JsonResponse(
                {
                    "status": "success",
                    "message": "Account created",
                }
            )

        except Exception as e:
            return JsonResponse(
                {"status": "error", "message": str(e)}, status=500
            )


@csrf_exempt
def api_google_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')

            CLIENT_ID = "491409934255-t4340hqkqos46hld52eftq9v7m0egp89.apps.googleusercontent.com"

            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                CLIENT_ID
            )

            email = idinfo["email"]
            name = idinfo.get("name", "")

            user, created = User.objects.get_or_create(
                username=email,
                defaults={
                    "email": email,
                    "first_name": name
                }
            )

            tokens = get_tokens_for_user(user)

            return JsonResponse({
                "status": "success",
                "user": {
                    "email": user.email,
                    "name": user.first_name or user.username
                },
                "tokens": tokens,
            })

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@csrf_exempt
def api_update_profile(request):
    if request.method != 'PUT':
        return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)
    
    try:
        # Extract user from JWT token
        auth = JWTAuthentication()
        try:
            user = auth.authenticate(request)
            if user is None:
                return JsonResponse({"status": "error", "message": "Invalid or expired token"}, status=401)
            user = user[0]  # JWTAuthentication returns (user, token)
        except InvalidToken:
            return JsonResponse({"status": "error", "message": "Invalid token"}, status=401)
        
        data = json.loads(request.body)
        
        if 'name' in data:
            user.first_name = data['name']
            user.save()
        
        return JsonResponse({
            "status": "success",
            "user": {
                "email": user.email,
                "name": user.first_name or user.username
            }
        })
    
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    
@csrf_exempt
def api_change_password(request):
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)
    
    try:
        # Extract user from JWT token
        auth = JWTAuthentication()
        try:
            user = auth.authenticate(request)
            if user is None:
                return JsonResponse({"status": "error", "message": "Invalid or expired token"}, status=401)
            user = user[0]
        except InvalidToken:
            return JsonResponse({"status": "error", "message": "Invalid token"}, status=401)
        
        data = json.loads(request.body)
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not user.check_password(current_password):
            return JsonResponse({"status": "error", "message": "Current password is incorrect"}, status=400)
        
        if len(new_password) < 6:
            return JsonResponse({"status": "error", "message": "Password must be at least 6 characters"}, status=400)
        
        user.set_password(new_password)
        user.save()
        
        return JsonResponse({"status": "success", "message": "Password updated successfully"})
    
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)