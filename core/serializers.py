from rest_framework import serializers
from .models import Service, Booking


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ("id", "provider", "title", "description", "price", "duration_minutes", "created_at")
        read_only_fields = ("id", "provider", "created_at")


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ("id", "service", "customer", "scheduled_for", "status", "note", "created_at")
        read_only_fields = ("id", "customer", "status", "created_at")
