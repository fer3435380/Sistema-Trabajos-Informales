from urllib.parse import parse_qs

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model
from rest_framework import exceptions

from channels.db import database_sync_to_async
from core.jwt import decode_access_token
from events.models import RevokedToken


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = await self._authenticate()
        if not self.user:
            await self.close(code=4401)
            return

        self.group_name = f"user_{self.user.id}_notifications"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept(subprotocol=self._accepted_subprotocol())
        await self.send_json({"type": "connected", "user_id": self.user.id})

    async def disconnect(self, _close_code):
        group_name = getattr(self, "group_name", None)
        if group_name:
            await self.channel_layer.group_discard(group_name, self.channel_name)

    async def notification_event(self, event):
        await self.send_json(event["payload"])

    async def _authenticate(self):
        token = self._token_from_subprotocols()
        if token:
            return await self._get_user_from_token(token)

        query_string = self.scope.get("query_string", b"").decode("utf-8")
        token = parse_qs(query_string).get("token", [None])[0]
        if not token:
            return None
        return await self._get_user_from_token(token)

    def _token_from_subprotocols(self):
        subprotocols = self.scope.get("subprotocols", [])
        if "bearer" not in subprotocols:
            return None
        bearer_index = subprotocols.index("bearer")
        if bearer_index + 1 >= len(subprotocols):
            return None
        return subprotocols[bearer_index + 1]

    def _accepted_subprotocol(self):
        if "bearer" in self.scope.get("subprotocols", []):
            return "bearer"
        return None

    @database_sync_to_async
    def _get_user_from_token(self, token):
        try:
            payload = decode_access_token(token)
            if RevokedToken.objects.filter(jti=payload["jti"]).exists():
                return None
            subject = str(payload["sub"])
            lookup = {"id": subject} if subject.isdigit() else {"email__iexact": subject}
            return get_user_model().objects.get(**lookup, is_active=True)
        except (exceptions.AuthenticationFailed, get_user_model().DoesNotExist, KeyError):
            return None
