import django_filters

from .models import Study

DATE_INPUT_FORMATS = ('%Y-%m-%d', '%Y%m%d')


class StudyFilter(django_filters.FilterSet):
    start = django_filters.DateFilter(
        name='start_time',
        input_formats=DATE_INPUT_FORMATS,
        lookup_expr='contains',
    )
    end = django_filters.DateFilter(
        name='end_time',
        input_formats=DATE_INPUT_FORMATS,
        lookup_expr='contains',
    )

    class Meta:
        model = Study
        fields = ['start_time', 'end_time']
