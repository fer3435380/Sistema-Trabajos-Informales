from rest_framework import authentication, exceptions

from core.jwt import decode_access_token
from events.models import RevokedToken
from users.models import User


class JWTAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode("utf-8")
        if not header:
            return None

        parts = header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            raise exceptions.AuthenticationFailed("Formato de token inválido")

        payload = decode_access_token(parts[1])
        if RevokedToken.objects.filter(jti=payload["jti"]).exists():
            raise exceptions.AuthenticationFailed("Token revocado")

        try:
            user = User.objects.get(id=payload["sub"], is_active=True)
        except User.DoesNotExist as exc:
            raise exceptions.AuthenticationFailed("Usuario no encontrado") from exc

        request.auth_payload = payload
        return user, payload
