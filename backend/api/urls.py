from django.urls import path, include
from . import views
from .views import TaskListCreateView, TaskDetailView, ChatRoomViewSet, FriendRequestViewSet, send_bot_message
from rest_framework.routers import DefaultRouter

# Router setup for ViewSets
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
    # path('friends/', views.FriendRequestViewSet.as_view(), name='friend-list'),

    #Bot Messaging (Admin)
    path('bot/send-message/', views.send_bot_message, name='bot-send-message'),

    #Include Router URLS
    path('', include(router.urls))
]
