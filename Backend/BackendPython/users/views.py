from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.jwt import create_access_token
from events.models import RevokedToken
from users.models import User
from users.serializers import LoginSerializer, RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(id=response.data["id"])
        return Response(
            {"access_token": create_access_token(user), "token_type": "bearer", "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(email=serializer.validated_data["email"], password=serializer.validated_data["password"])
        if not user:
            return Response({"detail": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"access_token": create_access_token(user), "token_type": "bearer", "user": UserSerializer(user).data})


class LogoutView(APIView):
    def post(self, request):
        jti = getattr(request, "auth_payload", {}).get("jti")
        if jti:
            RevokedToken.objects.get_or_create(jti=jti)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(
            {
                "workers": User.objects.filter(role=User.Role.WORKER, is_active=True).count(),
                "owners": User.objects.filter(role=User.Role.OWNER, is_active=True).count(),
            }
        )
