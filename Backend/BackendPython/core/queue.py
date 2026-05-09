import json

import pika
from django.conf import settings


class QueuePublisher:
    def __init__(self, rabbitmq_url, queue_name):
        self.rabbitmq_url = rabbitmq_url
        self.queue_name = queue_name

    def publish(self, event):
        params = pika.URLParameters(self.rabbitmq_url)
        connection = pika.BlockingConnection(params)
        try:
            channel = connection.channel()
            channel.queue_declare(queue=self.queue_name, durable=True)
            channel.basic_publish(
                exchange="",
                routing_key=self.queue_name,
                body=json.dumps(event.payload, ensure_ascii=False).encode("utf-8"),
                properties=pika.BasicProperties(
                    content_type="application/json",
                    delivery_mode=pika.DeliveryMode.Persistent,
                    type=event.event_type,
                ),
            )
        finally:
            connection.close()


def get_queue_publisher():
    return QueuePublisher(settings.RABBITMQ_URL, settings.RABBITMQ_QUEUE)
