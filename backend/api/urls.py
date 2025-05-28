from django.urls import path
from . import views
from .views import TaskListCreateView, TaskDetailView
from rest_framework.routers import DefaultRouter

urlpatterns = [
    #User Auth
    path('register/',)
    
    #Task Management
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),

    #User Friends + Search
    path('user/search/', views.UserSearchView.as_view())
    path('friends/')

    #Include Router URLS
    path('', include(router.urls))
]
