from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from notifications.serializers import NotificationSerializer


def broadcast_notification(notification, event_name="notification.created"):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    payload = {
        "type": event_name,
        "notification": NotificationSerializer(notification).data,
    }
    async_to_sync(channel_layer.group_send)(
        f"user_{notification.recipient_id}_notifications",
        {"type": "notification.event", "payload": payload},
    )
