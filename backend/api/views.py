from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import MultiPartParser
from .serializers import UserSerializer, TaskSerializer, UserBasicSerializer, MessageSerializer, MessageImageSerializer, ChatRoomSerializer, EmoteSerializer, FriendRequestSerializer, FriendSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Task, Column, FriendRequest, Friends, Blocked, ChatRoom, Message, MessageImage, Emotes
from .utils.bot_utils import GuchiBot


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

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
    
# User Search + Profile
class UserSearchView(generics.ListAPIView):
    serializer_class = UserBasicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', None)
        if query:
            return User.objects.filter(username__icontains=query).exclude(id=self.request.user.id)
        return User.objects.none() 
    
#Friend requests
class FriendRequestViewSet(viewsets.ModelViewSet):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return FriendRequest.objects.filter(
            Q(sender=user) | Q(receiver=user)
        )
        
    #Accept/Reject Friend Request Handler
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        friend_request = self.get_object()
        
        # Only the receiver is able to respond to friend request.
        if friend_request.receiver != request.user:
            return Response (
                {
                    "detail" : "You cannot respond to this request"
                },
                status=status.HTTP_403_FORBIDDEN
            )
            
        if friend_request.status != 'pending':
            return Response(
                {
                    "detail" : "This request has already been responded to"
                },
                status=status.HTTP_403_FORBIDDEN
            )
    
        action = request.data.get('action')
        
        if action == 'accept':
            friend_request.status = 'accepted'
            friend_request.save()
            
            #Create friendship relationship (2-Way).
            Friends.objects.create(user=friend_request.sender, friend=friend_request.receiver)
            Friends.objects.create(friend=friend_request.sender, user=friend_request.receiver)
            
            return Response({'status':'accepted'})
            
        elif action == 'reject':
            friend_request.status = 'rejected'
            friend_request.save()
            
            return Response({'status':'rejected'})
        
        return Response(
            {"detail": "Invalid Action. Select either 'accept' or 'reject"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
#Friends List
class FriendsListView(generics.ListAPIView):
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Friends.objects.filter(user=self.request.user)

#ChatRoom and Messages
class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ChatRoom.objects.filter(participants=self.request.user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    # Get ALL messages in a chat room
    @action(detail=True, methods=['get'])
    def get_messages(self, request, pk=None):
        chat_room = self.get_object()
        
        #Retrieve all messsages of current chat room.
        messages = Message.objects.filter(chat_room=chat_room)

        # Mark messages as read (Except sender -> sender).
        unread_messages = messages.filter(is_read=False).exclude(sender=request.user)
        unread_messages.update(is_read=True)

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    # Get ALL pinned messages in a chat room
    @action(detail=True, methods=['get'])
    def get_pinned_messages(self, request, pk=None):
        chat_room = self.get_object()
        
        #Retrieve all messsages of current chat room.
        pinned_messages = Message.objects.filter(chat_room=chat_room, is_pinned=True)
        
        serializer = MessageSerializer(pinned_messages, many=True, context={'request': request})
        return Response(serializer.data)
    
    # Send message to the chat room.
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        chat_room = self.get_object()
        content = request.data.get('content', '') # Empty string for image only message.
        images = request.FILES.getlist('images')
        
        if not content.strip() and not images:
            return Response(
                {
                    "detail" : "Message/Image content is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Reply to message ID (Optional)
        reply_to_id = request.data.get('reply_to') or request.POST.get('reply_to')
        reply_to_msg = None
        
        if reply_to_id:
            try:
                reply_to_msg = Message.objects.get(id=reply_to_id)
            except Message.DoesNotExist:
                return Response(
                    {
                        "detail" : f"Reply to Message ID (reply_to_id) not found."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        #Create the message.
        message = Message.objects.create(
            chat_room=chat_room,
            sender=request.user,
            content=content,
            reply_to=reply_to_msg
        )
        
        print(f"Message Created, ID: {message.id}") #Msg Create Debug.
        
        #Handle image attachments.
        for image_file in request.FILES.getlist('images'):
            print(f"Processing Image: {image_file.name}, size: {image_file.size}") #Image Processing Debug.
            
            # Fixed: Get caption using the correct key format that matches the frontend
            caption_key = f"caption_{image_file.name}"
            caption = request.data.get(caption_key, '')
            print(f"Caption for {image_file.name}: '{caption}'") #Caption create Debug.
            
            try: 
                message_image = MessageImage.objects.create(
                    message=message,
                    image=image_file,
                    caption=caption,
                    file_size=image_file.size,
                )
                print(f"MessageImage created successfully with ID: {message_image.id}")
            except Exception as imgSaveError:
                print(f"Error creating MessageImage: {str(imgSaveError)}")
                return Response(
                    {
                        "detail" : f"Error saving image: {str(imgSaveError)}"
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        # Serialize and return message with its images.
        serializer = MessageSerializer(message, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # Edit a message.
    @action(detail=True, methods=['put'], url_path='messages/(?P<message_id>[^/.]+)') 
    def edit_message(self, request, pk=None, message_id=None):
        chat_room = self.get_object()
        
        try:
            message = Message.objects.get(id=message_id, chat_room=chat_room)
        except Message.DoesNotExist:
            return Response(
                {
                    'detail' : 'Message not found'
                }, 
                status=status.HTTP_404_NOT_FOUND)
    
        # Allow only the sender to edit their own messages.
        if message.sender != request.user:
            return Response(
                {
                    'detail' : 'User is unauthorized to edit this message'
                }, 
                status=status.HTTP_403_FORBIDDEN)
        
        # Update message before saving.    
        serializer = MessageSerializer(message, data=request.data, partial=True)
        if serializer.is_valid():    
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
    # Delete a message. 
    @action(detail=True, methods=['delete'], url_path='messages/(?P<message_id>[^/.]+)') 
    def delete_message(self, request, pk=None, message_id=None):
        chat_room=self.get_object()
        
        try:
            message = Message.objects.get(id=message_id, chat_room=chat_room)
        except Message.DoesNotExist:
            return Response(
                {
                    'detail' : 'Message not found'
                }, 
                status=status.HTTP_404_NOT_FOUND)
            
        if message.sender != request.user:
            return Response(
                {
                    'detail' : 'User is unauthorized to delete this message'
                },
                status=status.HTTP_403_FORBIDDEN)
        
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
     
    @action(detail=True, methods=['post'], url_path=r'messages/(?P<message_id>[^/.]+)/pin')
    def pin_message(self, request, pk=None, message_id=None):
        chat_room=self.get_object()
        
        # Check if user exists in specified chat room.
        if not chat_room.participants.filter(id=request.user.id).exists():
            return Response(
                {
                    'detail': 'You are not an active participant in this chat room'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            message = Message.objects.get(id=message_id, chat_room=chat_room)
        except Message.DoesNotExist:
            return Response(
                {
                    'detail' : 'Message not found'
                }, 
                status=status.HTTP_404_NOT_FOUND)
        
        #Toggle pin status
        message.is_pinned = not message.is_pinned
        message.save(update_fields=['is_pinned'])
        
        actionToggle = 'pinned' if message.is_pinned else 'unpinned'    
        return Response(
            {
            'detail' : f'Message {actionToggle} successefully!',
            'is_pinned': message.is_pinned
            },
            status=status.HTTP_200_OK)

        
    # Add/Annotate Emote to a message.
    @action(detail=True, methods=['post'], url_path=r'messages/(?P<message_id>[^/.]+)/emotes') 
    def add_emote(self, request, pk=None, message_id=None):
        
        chat_room = self.get_object()
        
        if not chat_room.participants.filter(id=request.user.id).exists():
            return Response(
                {
                    "detail": "You are not a participant in this chat room"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Retrieve message
        try:
            message = Message.objects.get(id=message_id, chat_room=chat_room)
        except Message.DoesNotExist:
            return Response(
                {
                    "detail" : "Message not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
            
        reaction = request.data.get('reaction')
        if not reaction:
            return Response(
                {
                    "detail" : "Reaction is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if the user has already reacted with their emote
        existing_emote = Emotes.objects.filter(
            message=message,
            sender=request.user,
            reaction=reaction
        ).first()
        
        if existing_emote:
            return Response(
                {
                    "detail": "You have already reacted with this emote"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        #Create the emote
        emote = Emote.objects.create(
            message=message,
            sender=request.user,
            reaction=reaction
        )
        
        serializer = EmoteSerializer(emote) # Convert to JSON format to send back to API
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # Remove Emote from a message
    @action(detail=True, methods=['post'], url_path='messages/(?P<message_id>[^/.]+)/emotes/(?P<emote_id>[^/.]+)') 
    def delete_emote(self, request, pk=None, message_id=None, emote_id=None):
        # Delete emote reaction from a specific message.
        chat_room = self.get_object()
        
        #Verify user is participant in this chat room
        if not chat_room.participants.filter(id=request.user.id).exists():
            return Response(
                {
                    "detail" : "You are not a participant in this chat room"
                },
                status=status.HTTP_403_FORBIDDEN
            )
            
        try:
            emote = Emote.objects.get(
                id=emote_id,
                message__id=message_id,
                message__chat_room=chat_room,
                sender=request.user
            )
        except Emotes.DoesNotExist:
            return Response (
                {
                    "detail" : "This emote does not exist or: User is not authorized to remove it"
                },
                status=status.HTTP_404_NOT_FOUND
            )
            
        emote.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    #Get all emotes for a specific message
    @action(detail=True, methods=['get'], url_path='messages/(?P<message_id>[^./]+)/emotes')
    def get_message_Emotes(self, request, pk=None, message_id=None):
        # Get all emote reactions for a specific message
        chat_room = self.get_object()
        
        # Ensure user is a participant of this chat room
        if not chat_room.participants.filter(id=request.user.id).exists():
            return Response(
                {
                    "detail" : "You are not a participant in this chat room"
                },
                status=status.HTTP_403_FORBIDDEN
            )
            
        try:
            message = Message.objects.get(id=message_id, chat_room=chat_room)
        except Message.DoesNotExist:
            return Response(
                {
                    "detail" : "Message Not Found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
    
    # Create DM with friend 
    @action(detail=False, methods=['post'])
    def direct(self, request):
        friend_id = request.data.get('friend_id')
        
        if not friend_id:
            return Response(
                {
                    "detail" : "Friend ID is required",
                },
            status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response(
                {
                    "detail" : "User not found"
                },
                status = status.HTTP_404_NOT_FOUND
            )
            
        # Verify if they're friends
        if not Friends.objects.filter(user=request.user, friend=friend).exists():
            return Response(
                {
                    "detail" : "This user isn't in your friends list"
                },
                status = status.HTTP_403_FORBIDDEN
            )
            
        #Check if a DM chat already exists
        existing_chats = ChatRoom.objects.filter(
            participants=request.user,
            is_group_chat=False
        ).filter(participants=friend)
        
        if existing_chats.exists():
            serializer = self.get_serializer(existing_chats.first())
            return Response(serializer.data)
        
        # Create a new DM
        chat_room = ChatRoom.objects.create(is_group_chat=False)
        chat_room.participants.add(request.user, friend)
        
        serializer = self.get_serializer(chat_room)
        return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def send_bot_message(request):
    #An admin endpoint to send messages as Guchi Bot
    user_id = request.data.get('user_id')
    message_content = request.data.get('message')
    
    if not user_id or not message_content:
        return Response(
            {
                "error" : "A user_id and message content are required!"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        
    try:
        user = User.objects.get(id=user_id)
        bot = GuchiBot()
        message = bot.send_custom_message(user, message_content)
        
        if message:
            return Response(
                {
                    "success" : True,
                    "message" : "Bot message sent successfully"
                }
            )
        else:
            return Response(
            {
                "error" : "Failed to send message"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR 
            )
            
    except User.DoesNotExist:
        return Response (
            {
                "error" : "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )