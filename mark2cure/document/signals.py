from django.conf import settings
from django.db.models import signals
from django.conf import settings

from mark2cure.document.models import Document, Activity

import requests, importlib, logging
logger = logging.getLogger(__name__)


# def document_save_handler(sender, instance, **kwargs):
#     '''
#       Automatically seed new documents onto MTurk
#     '''
#     document = instance
#     pass


def activity_save_handler(sender, instance, **kwargs):
    '''
      Automatically seed new documents onto MTurk
    '''
    activity = instance

    if activity.f_score <= 0.5:
        user = activity.user
        user_profile = user.userprofile

        if user_profile.mturk:
            poor_subs_count = Activity.objects.filter(user=user, experiment=settings.EXPERIMENT, f_score_lt=0.5).count()
        else:
            poor_subs_count = Activity.objects.filter(user=user, f_score_lt=0.5).count()

        if poor_subs_count >= 3:
            user_profile.softblock = True
            user_profile.save()


# signals.post_save.connect(document_save_handler, sender=Document)
signals.post_save.connect(activity_save_handler, sender=Activity)