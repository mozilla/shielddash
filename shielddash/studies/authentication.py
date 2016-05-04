from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework.authentication import (BaseAuthentication,
                                           get_authorization_header)
from rest_framework import exceptions

from oauth2client import client, crypt


class GoogleJSONWebTokenAuthentication(BaseAuthentication):
    def get_jwt_value(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != 'jwt':
            return None

        if len(auth) == 1:
            msg = 'Invalid Authorization header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = ('Invalid Authorization header. Credentials string '
                   'should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)

        return auth[1]

    def authenticate(self, request):
        token = self.get_jwt_value(request)
        if token is None:
            return None
        try:
            idinfo = client.verify_id_token(token, settings.GOOGLE_AUTH_KEY)
            if idinfo['iss'] not in ['accounts.google.com',
                                     'https://accounts.google.com']:
                raise crypt.AppIdentityError("Wrong issuer.")
            if idinfo['hd'] != settings.GOOGLE_AUTH_HOSTED_DOMAIN:
                raise crypt.AppIdentityError("Wrong hosted domain.")
        except crypt.AppIdentityError, e:
            return exceptions.AuthenticationFailed(e)
        (u, isCreated) = get_user_model().objects.get_or_create(
            username=idinfo['email'],
            email=idinfo['email'],
            first_name=idinfo['given_name'],
            last_name=idinfo['family_name'])
        return (u, idinfo)


google_auth = GoogleJSONWebTokenAuthentication()
