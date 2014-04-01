from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings

import datetime


class DocumentManager(models.Manager):
    def pubmed_count(self, pubmed_id):
        return self.filter(document_id__exact = int(pubmed_id)).count()

    def section_count(self):
        return self.section_set.all()

    def get_random_document(self):
        '''
        This is documented as being potentially expensive, we may want to do something like
        http://stackoverflow.com/a/6405601 instead
        '''
        return self.order_by('?')[0]


class AnnotationManager(models.Manager):

    def match_exact(self, gm_ann, user_anns):
      for user_ann in user_anns:
          if user_ann.is_exact_match(gm_ann): return True
      return False
