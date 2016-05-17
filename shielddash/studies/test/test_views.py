import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.reverse import reverse

from ..models import State, Study


def iso(dt):
    value = dt.isoformat()
    if value.endswith('+00:00'):
        value = value[:-6] + 'Z'
    return unicode(value)


def create_test_user():
    user = get_user_model().objects.create(username='example@mozilla.com')
    user.set_password('password')
    user.save()
    return user


def create_test_study():
    start = timezone.now()
    end = start + timedelta(hours=1)
    return Study.objects.create(
        name=u'test study',
        description=u'some description',
        start_time=start,
        end_time=end,
    )


def create_test_state(study):
    for channel in ('release', 'beta', 'aurora', 'nightly'):
        for variation in ('aggressive', 'medium', 'weak', 'ut'):
            State.objects.create(
                study=study,
                channel=channel,
                variation=variation,
                completed=random.randint(0, 1),
                ineligible=random.randint(0, 1),
                installed=random.randint(0, 1),
                left_study=random.randint(0, 1),
                seen1=random.randint(0, 1),
                seen2=random.randint(0, 1),
                seen3=random.randint(0, 1),
                seen7=random.randint(0, 1),
                created=timezone.now()
            )


class TestStudyView(TestCase):

    def setUp(self):
        self.url = reverse('study-list')
        self.study = create_test_study()
        self.user = create_test_user()
        self.client.login(username=self.user.username, password='password')

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
            'start': self.study.start_time.strftime('%Y%m%d'),
            'end': self.study.end_time.strftime('%Y%m%d'),
        })
        data = response.json()
        self.assertTrue(data['studies'])

    def test_date_range_without_results(self):
        """
        Requests for future date range returns no study data.
        """
        start = self.study.start_time + timedelta(days=1)
        end = self.study.end_time + timedelta(days=1)
        response = self.client.get(self.url, data={
            'start': start.strftime('%Y%m%d'),
            'end': end.strftime('%Y%m%d'),
        })
        data = response.json()
        self.assertFalse(data['studies'])


class TestStudyDetailView(TestCase):

    def setUp(self):
        self.study = create_test_study()
        self.state = create_test_state(self.study)
        self.url = reverse('study-detail', args=[self.study.id])
        self.user = create_test_user()

    def test_basic(self):
        """
        Test basic shape of the study detail API.
        """
        self.client.login(username=self.user.username, password='password')
        response = self.client.get(self.url)
        data = response.json()
        self.assertEqual(data['study'], self.study.name)
        self.assertEqual(sorted(data['channels'].keys()),
                         sorted(['release', 'beta', 'aurora', 'nightly']))
        self.assertEqual(sorted(data['channels']['release'].keys()),
                         sorted(['aggressive', 'medium', 'weak', 'ut']))

    def test_no_auth(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 403)

        self.client.login(username=self.user.username, password='password')

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
