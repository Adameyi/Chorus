from django.urls import path
from . import views
from .views import TaskListCreateView, TaskDetailView
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
]
