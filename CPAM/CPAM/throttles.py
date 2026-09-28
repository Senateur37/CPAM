from rest_framework.throttling import AnonRateThrottle


class SubmissionRateThrottle(AnonRateThrottle):
    """Applies a stricter limit to public form submissions (contact, candidatures) to curb spam."""

    scope = 'submission'
