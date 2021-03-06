from django.conf.urls import url
from . import views


urlpatterns = [
    # Analysis App
    url(r'^network/(?P<group_pk>\d+)/$',
        views.group_network, name='group-network'),

    # Longitudinal user F in Group
    url(r'^analysis/group/(?P<group_pk>\d+)/user/(?P<user_pk>\d+)/$',
        views.analysis_group_user, name='analysis-group-user'),
    url(r'^analysis/group/(?P<group_pk>\d+)/user/$',
        views.analysis_group_user, name='analysis-group-user'),

    # Longitudinal Group F Avg
    url(r'^analysis/group/(?P<group_pk>\d+)/$',
        views.analysis_group, name='analysis-group'),

    # Tasks
    url(r'task/stats/',
        views.user_task_stats, name='task-stats-api'),
    url(r'ner/stats/',
        views.ner_stats, name='ner-stats-api'),
    url(r're/stats/',
        views.re_stats, name='re-stats-api'),

    # - [Dashboard] Named Entity Recognition (NER)
    url(r'^ner/list/(?P<group_pk>\d+)/$',
        views.ner_quest, name='ner-quest-api'),
    url(r'^ner/list/$',
        views.ner_list, name='ner-list-api'),

    # - [Dashboard] Relationship Extraction (RE)
    url(r're/list',
        views.re_list, name='re-list-api'),

    # - [Dashboard] User Scoreboard
    url(r'^leaderboard/users/(?P<day_window>\d+)/$',
        views.leaderboard_users, name='leaderboard-users'),

    url(r'^leaderboard/teams/(?P<day_window>\d+)/$',
        views.leaderboard_teams, name='leaderboard-teams')
]
