from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task, Column

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        #Accept password when creating a user, but do not return it when giving info about user.
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "user", "title", "description", "column", "date", "attachments", "comments", "tags", "column_ref"]
        read_only_fields = ['user']