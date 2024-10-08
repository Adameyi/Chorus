from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Note

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] #Root cannot be called unless you have a valid JWT Token.

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user) 
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteUpdate(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class NoteDelete(generics.DestroyAPIView):
    # queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user) 
    

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() #List all users to ensure duplicates do not exist.
    serializer_class = UserSerializer #Tell view what kind of info required to create User
    permission_classes = [AllowAny] #Anyone can call this class.
    