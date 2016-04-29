from datetime import timedelta
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.reverse import reverse

from ..models import Study


def iso(dt):
    value = dt.isoformat()
    if value.endswith('+00:00'):
        value = value[:-6] + 'Z'
    return unicode(value)


class TestStudyView(TestCase):

    def setUp(self):
        self.url = reverse('study-list')
        self.start = timezone.now()
        self.end = self.start + timedelta(hours=1)
        self.study = Study.objects.create(
            name=u'test study',
            description=u'some description',
            start_time=self.start,
            end_time=self.end,
        )
        u = get_user_model().objects.create(username='example@mozilla.com')
        u.set_password('example')
        u.save()
        self.client.login(username='example@mozilla.com', password='example')

    def test_basic(self):
        """
        Requests without date range returns study data.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.json(), {
            u'studies': [
                {
                    u'id': self.study.id,
                    u'name': self.study.name,
                    u'description': self.study.description,
                    u'start_time': iso(self.study.start_time),
                    u'end_time': iso(self.study.end_time),
                }
            ]
        })

    def test_date_range_with_results(self):
        """
        Requests for current date range returns study data.
        """
        response = self.client.get(self.url, data={
            'start': self.start.strftime('%Y%m%d'),
            'end': self.end.strftime('%Y%m%d'),
        })
        data = response.json()
        self.assertTrue(data['studies'])

    def test_date_range_without_results(self):
        """
        Requests for future date range returns no study data.
        """
        start = self.start + timedelta(days=1)
        end = self.end + timedelta(days=1)
        response = self.client.get(self.url, data={
            'start': start.strftime('%Y%m%d'),
            'end': end.strftime('%Y%m%d'),
        })
        data = response.json()
        self.assertFalse(data['studies'])
