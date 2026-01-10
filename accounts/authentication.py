# accounts/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions
from django.middleware.csrf import CsrfViewMiddleware

SAFE_METHODS = ("GET", "HEAD", "OPTIONS")

class CookieJWTAuthentication(JWTAuthentication):
    """
    Reads access token from HttpOnly cookie named 'access'.
    Enforces CSRF for unsafe requests (POST/PATCH/DELETE) because cookies are used.
    """

    def authenticate(self, request):
        if request.method not in SAFE_METHODS:
            self._enforce_csrf(request)

        raw_token = request.COOKIES.get("access")
        if not raw_token:
            return None

        validated_token = self.get_validated_token(raw_token)
        user = self.get_user(validated_token)
        return (user, validated_token)

    def _enforce_csrf(self, request):
        """
        Require X-CSRFToken header that matches csrftoken cookie.
        """
        check = CsrfViewMiddleware(lambda req: None)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied("CSRF Failed: Missing or incorrect CSRF token.")
