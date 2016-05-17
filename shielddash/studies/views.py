from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework import filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .filters import StudyFilter
from .models import Study
from .renderers import StudyJSONRenderer
from .serializers import StudySerializer


class StudyListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Study.objects.all()
    serializer_class = StudySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('start_time', 'end_time')
    filter_class = StudyFilter
    renderer_classes = (StudyJSONRenderer,)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def study_detail(request, study_id):
    study = get_object_or_404(Study, pk=study_id)
    with connection.cursor() as cursor:
        sql = """
            SELECT
                channel,
                variation,
                SUM(completed::int) AS completed,
                SUM(ineligible::int) AS ineligible,
                SUM(installed::int) AS installed,
                SUM(left_study::int) AS left_study,
                SUM(seen1::int) AS seen1,
                SUM(seen2::int) AS seen2,
                SUM(seen3::int) AS seen3,
                SUM(seen7::int) AS seen7
            FROM studies_state
            WHERE study_id=%s
            GROUP BY channel, variation
            ORDER BY channel, variation
        """
        cursor.execute(sql, [study.id])
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

    data = {
        'study': study.name,
        'channels': {},
    }
    for row in rows:
        channel = row.pop('channel')
        variation = row.pop('variation')

        if channel in data['channels']:
            data['channels'][channel][variation] = row
        else:
            data['channels'][channel] = {variation: row}

    return Response(data)
