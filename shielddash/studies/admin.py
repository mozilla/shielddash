from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from .models import Study, State


@admin.register(Study)
class StudyAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_time', 'end_time']
    list_filter = ['start_time', 'end_time']


class StudyListFilter(admin.SimpleListFilter):
    # Human-readable title which will be displayed in the
    # right admin sidebar just above the filter options.
    title = _('study')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'study'

    def lookups(self, request, model_admin):
        """
        Returns a list of tuples. The first element in each
        tuple is the coded value for the option that will
        appear in the URL query. The second element is the
        human-readable name for the option that will appear
        in the right sidebar.
        """
        return ((study.name, study.name)
                for study in Study.objects.all())

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        value = self.value()
        if value:
            return queryset.filter(study__name=value)
        return queryset


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = [
        'id',
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
    list_display_links = ['id', 'study']
    list_filter = [StudyListFilter, 'variation', 'channel']
    date_hierarchy = 'created'
    raw_id_fields = ['study']
    show_full_result_count = False
