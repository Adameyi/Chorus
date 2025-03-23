from django.urls import path
from . import views
from .views import TaskListCreateView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create')
]
