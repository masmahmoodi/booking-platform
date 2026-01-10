from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics, permissions
from .serializers import RegisterSerializer


class CsrfView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Forces Django to set the csrftoken cookie
        token = get_token(request)
        return Response({"csrfToken": token})


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({"detail": "Invalid username/password"}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)  # ✅ sets sessionid cookie
        return Response({
            "id": user.id,
            "username": user.username,
            "role": getattr(user, "role", None),
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out"})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "role": getattr(user, "role", None),
        })


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
