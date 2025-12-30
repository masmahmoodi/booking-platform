from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Service, Booking
from .serializers import ServiceSerializer, BookingSerializer
from .permissions import IsProvider, IsCustomer, IsOwnerOrReadOnly


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by("-created_at")
    serializer_class = ServiceSerializer

    def get_permissions(self):
        # Anyone can list/retrieve services
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsProvider(), IsOwnerOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and getattr(user, "role", None) == "PROVIDER" and self.action not in ["list", "retrieve"]:
            return qs.filter(provider=user)
        return qs

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "CUSTOMER":
            return Booking.objects.filter(customer=user).order_by("-created_at")
        if getattr(user, "role", None) == "PROVIDER":
            return Booking.objects.filter(service__provider=user).order_by("-created_at")
        return Booking.objects.none()

    def perform_create(self, serializer):
        # Only customers can create bookings
        if getattr(self.request.user, "role", None) != "CUSTOMER":
            raise permissions.PermissionDenied("Only customers can create bookings.")
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        booking = self.get_object()
        if getattr(request.user, "role", None) != "PROVIDER" or booking.service.provider_id != request.user.id:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        booking.status = Booking.Status.APPROVED
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        booking = self.get_object()
        if getattr(request.user, "role", None) != "PROVIDER" or booking.service.provider_id != request.user.id:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        booking.status = Booking.Status.REJECTED
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        booking = self.get_object()
        if getattr(request.user, "role", None) != "PROVIDER" or booking.service.provider_id != request.user.id:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        booking.status = Booking.Status.COMPLETED
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if getattr(request.user, "role", None) != "CUSTOMER" or booking.customer_id != request.user.id:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        booking.status = Booking.Status.CANCELED
        booking.save()
        return Response(BookingSerializer(booking).data)
