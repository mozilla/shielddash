from django.db import models


class Retention(models.Model):
    class Meta:
        db_table = 'retention'
    client_id = models.UUIDField()
    study = models.CharField(max_length=255)
