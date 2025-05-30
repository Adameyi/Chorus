from django.urls import path, include
from . import views
from .views import TaskListCreateView, TaskDetailView, ChatRoomViewSet, FriendRequestViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'friend-requests', views.FriendRequestViewSet, basename='friend-request')
router.register(r'chat-room', views.ChatRoomViewSet, basename='chat-room')

urlpatterns = [
    #User Auth
    path('register/', views.CreateUserView.as_view(), name='register'),
    
    #Task Management
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),

    #User Friends + Search
    path('user/search/', views.UserSearchView.as_view()),
    path('friends/'),

    #Include Router URLS
    path('', include(router.urls))
]
