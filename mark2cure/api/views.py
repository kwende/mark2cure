from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseServerError

from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.template.response import TemplateResponse

from mark2cure.api.serializers import QuestSerializer, UserProfileSerializer, GroupSerializer
from mark2cure.common.models import Group, Task, UserQuestRelationship
from mark2cure.common.formatter import bioc_writer
from mark2cure.userprofile.models import UserProfile


@login_required
@api_view(['GET'])
def quest_group_list(request, group_pk):
    group = get_object_or_404(Group, pk=group_pk)
    queryset = Task.objects.filter(kind=Task.QUEST, group=group).all()
    serializer = QuestSerializer(queryset, many=True, context={'user': request.user})
    return Response(serializer.data)


def quest_users_bioc(request, group_pk, format_type):
    group = get_object_or_404(Group, pk=group_pk)

    # When fetching via pubmed, include all user annotaitons
    writer = bioc_writer(request)

    for doc in group.get_documents():
        doc_bioc = doc.as_bioc_with_user_annotations()
        writer.collection.add_document(doc_bioc)

    if format_type == 'json':
        writer_json = bioc_as_json(writer)
        return HttpResponse(writer_json, content_type='application/json')
    else:
        return HttpResponse(writer, content_type='text/xml')


@login_required
@api_view(['GET'])
def group_list(request):
    queryset = Group.objects.filter(enabled=True).order_by('-order').all()
    serializer = GroupSerializer(queryset, many=True)
    return Response(serializer.data)


@login_required
@api_view(['GET'])
def leaderboard_users(request):
    queryset = UserProfile.objects.exclude(user__username__in=['CheckingOnTesters', 'roarwithphoebe']).order_by('-rating_score').all()[:25]
    serializer = UserProfileSerializer(queryset, many=True)
    return Response(serializer.data)
