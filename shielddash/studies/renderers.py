from rest_framework.renderers import JSONRenderer


class NamespaceJSONRenderer(JSONRenderer):
    "A JSON renderer that wraps the result data in a namespace"
    namespace = 'objects'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context['response']

        if response and not response.exception:
            data = {self.namespace: data}
        return super(NamespaceJSONRenderer, self).render(
            data,
            accepted_media_type=accepted_media_type,
            renderer_context=renderer_context,
        )


class StudyJSONRenderer(NamespaceJSONRenderer):
    namespace = 'studies'
