from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task, Column, FriendRequest, Friends, Blocked, ChatRoom, Message, Emotes

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        # Accept password when creating a user, but do not return it when giving info about user.
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserBasicSerializer(serializers.ModelSerializer):
    # Simplified user serializer for embedding in other responses
    class Meta:
        model = User
        fields = ["id", "username"]
    
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "user", "title", "description", "column", "date", "attachments", "comments", "tags", "due_date", "order"]
        read_only_fields = ['user']
        
class FriendSerializer(serializers.ModelSerializer):
    friend = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Friends
        fields = ['id', 'friend', 'created_at']
        read_only_fields = ['created_at']
    
class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer(read_only=True)
    receiver = UserBasicSerializer(read_only=True)
    receiver_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = FriendRequest
        fields = ['id','sender', 'receiver','status', 'created_at']
        read_only_fields = ['sender', 'status','created_at']
    
    def create(self, validated_data):
        receiver_id = validated_data.pop('receiver_id')
        sender = self.context['request'].user
        
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User Does not exist")
        
        # Check if a user friend request already exists.
        if FriendRequest.objects.filter(sender=sender, receiver=receiver):
            raise serializers.ValidationError("Friend request has already been sent")
            
        # Check if they are friends with each other.
        if Friends.objects.filter(blocker=sender, blocked=receiver):
            raise serializers.ValidationError("Both users are already added as friend")
       
        # Check if sender has blocked user.
        if Blocked.objects.filter(blocker=receiver, blocked=sender).exists():
            raise serializers.ValidationError("This user has blocked you and cannot receive your friend request")

        #   Check if the receiver has blocked the sender
        if Blocked.objects.filter(blocker=sender, blocked=receiver).exists():
            raise serializers.ValidationError("Blocked by user, Cannot send friend request")
        
        return FriendRequest.objects.create(sender=sender, receiver=receiver, **validated_data)
       
class BlockedSerializer(serializers.ModelSerializer):
    blocked = UserBasicSerializer(read_only=True)

    class Meta:
        model = Blocked
        fields = ['blocker', 'blocked', 'created_at']
        read_only_fields = ['created_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp', 'is_read']
        
class EmoteSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer(read_only=True)
    message = MessageSerializer(read_only=True)
    message_id = serializers.PrimaryKeyRelatedField(queryset=Message.objects.all(), source='message', write_only=True)
        
    class Meta:
        model = Emotes
        fields = ['message_id','message','sender','reaction','created_at']
        read_only_fields = ['sender','created_at']
        
class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserBasicSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = ChatRoom
        fields = ['id','name','participants','participant_ids','is_group_chat','created_at', 'last_message']
        read_only_fields = ['created_at']
        
    def get_last_message(self, object):
        # Ensure the latest message gets shown first.
        last_message = object.messages.order_by('-timestamp').first()
        if last_message:
            return {
                'content': last_message.content,
                'sender': last_message.sender.username,
                'timestamp': last_message.timestamp
            }
        return None
    
    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids', [])
        current_user = self.context['request'].user
        
        # Create the group chat.
        chat_room = ChatRoom.objects.create(**validated_data)
        
        # Add current user as participant.
        chat_room.participants.add(current_user)
        
        # Add other participants.
        for user_id in participant_ids:
            if user_id != current_user.id: #Avoid duplicate entries of current user.
                try:
                    user = User.objects.get(id=user_id)
                    
                    #For direct messages, check if they're friends.
                    if not validated_data.get('is_group_chat', False):
                        is_friend = Friends.objects.filter(
                            user=current_user,
                            friend__id=user_id
                        ).exists()
                        
                        if not is_friend:
                            # Cleanup and raise error.
                            chat_room.delete()
                            raise serializers.ValidationError(f"User {user.username} is not on your friends list!")
                    
                    chat_room.participants.add(user)
                except User.DoesNotExist:
                    chat_room.delete()
                    raise serializers.ValidationError(f"User with id {user_id} doesn't exist!")
        
        return chat_room