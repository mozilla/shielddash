from django.db import models
from django.utils import timezone


class Study(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(default='')
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = 'study'
        verbose_name_plural = 'studies'

    def __unicode__(self):
        return self.name


class State(models.Model):
    channel = models.CharField(max_length=255)
    variation = models.CharField(max_length=255)
    study = models.ForeignKey(Study, related_name='states')

    completed = models.BooleanField(default=False)
    ineligible = models.BooleanField(default=False)
    installed = models.BooleanField(default=False)
    left_study = models.BooleanField(default=False)
    seen1 = models.BooleanField(default=False)
    seen2 = models.BooleanField(default=False)
    seen3 = models.BooleanField(default=False)
    seen7 = models.BooleanField(default=False)
    created = models.DateTimeField(default=timezone.now)

    def __unicode__(self):
        return self.id
