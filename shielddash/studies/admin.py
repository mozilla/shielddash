from django.contrib import admin

from .models import Study, State


@admin.register(Study)
class StudyAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_time', 'end_time']
    list_filter = ['start_time', 'end_time']


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = [
        'study',
        'channel',
        'variation',
        'created',
        'completed',
        'ineligible',
        'installed',
        'left_study',
        'seen1',
        'seen2',
        'seen3',
        'seen7',
    ]
    list_filter = ['study', 'variation', 'channel']
    date_hierarchy = 'created'
    raw_id_fields = ['study']
    show_full_result_count = False
