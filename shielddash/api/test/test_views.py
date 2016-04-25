from django.test import TestCase

from rest_framework.reverse import reverse


class TestCrashHistogramView(TestCase):
    def setUp(self):
        self.url = reverse('retention')

    def test_basic(self):
        """
        Requests for a date range returns retention data.
        """
        res = self.client.get(self.url, data={"start": "20160101",
                                              "end": "20160201"})
        self.assertEqual(res.json(), {"study": "hello-world"})

    def test_invalid_date(self):
        """
        Invalid dates are rejected.
        """
        res = self.client.get(self.url, data={"start": "Juvember 7th",
                                              "end": "20160201"})
        self.assertEqual(res.status_code, 400)

    def test_missing_date(self):
        """
        Requests must have date bounds.
        """
        res = self.client.get(self.url, data={"end": "20160201"})
        self.assertEqual(res.status_code, 400)
        res = self.client.get(self.url, data={"start": "20160101"})
        self.assertEqual(res.status_code, 400)
