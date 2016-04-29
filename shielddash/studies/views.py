from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters

from .filters import StudyFilter
from .models import Study
from .renderers import StudyJSONRenderer
from .serializers import StudySerializer


class StudyListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Study.objects.all()
    serializer_class = StudySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('start_time', 'end_time')
    filter_class = StudyFilter
    renderer_classes = (StudyJSONRenderer,)
