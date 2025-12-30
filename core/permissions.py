from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsProvider(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", None) == "PROVIDER"


class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", None) == "CUSTOMER"


class IsOwnerOrReadOnly(BasePermission):
    """
    Generic helper permission: allow read for everyone,
    but only allow write if obj.provider == request.user (used for Service).
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "provider_id", None) == request.user.id
