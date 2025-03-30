from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import UserSerializer, TaskSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Task, Column

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() #List all users to ensure duplicates do not exist.
    serializer_class = UserSerializer #Tell view what kind of info required to create User
    permission_classes = [AllowAny] #Anyone can call this class.

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)