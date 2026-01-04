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

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        service = attrs.get("service")
        scheduled_for = attrs.get("scheduled_for")

        
        if service and service.provider_id == user.id:
            raise serializers.ValidationError({
                "service": "You cannot book your own service."
            })

       
        if service and scheduled_for:
            conflict = Booking.objects.filter(
                service=service,
                scheduled_for=scheduled_for
            ).exists()

            if conflict:
                raise serializers.ValidationError({
                    "scheduled_for": "This time slot is already booked for this service."
                })

        return attrs