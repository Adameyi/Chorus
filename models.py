from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils.timezone import now
from PIL import Image as PILImage

# Chat Functionality

class Friends(models.Model):
    user = models.ForeignKey(User, related_name='friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='friend_of', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Unique constraint, No 2 Rows should have the same combination of user and friend
    class Meta:
        # unique_together = ('user', 'friend') - Depreciated
        constraints = [
            models.UniqueConstraint(fields=['user','friend'], name='unique_friendship')
        ]
        
    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username}"

class FriendRequest(models.Model):
    sender = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10,
    choices= [
            ('pending', 'Pending'),  
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected')
        ],
        default='pending'                     
    )
    
class Blocked(models.Model):
    blocker = models.ForeignKey(User, related_name='blocked_users', on_delete=models.CASCADE)
    blocked = models.ForeignKey(User, related_name='blocked_by_user', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # unique_together = ("blocker", "blocked") - Depreciated
        constraints = [
            models.UniqueConstraint(fields=['blocker','blocked'], name='unique_blocked_user')
        ]

class ChatRoom(models.Model):
    name = models.CharField(max_length=100, blank=True)
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    is_group_chat = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        if self.is_group_chat:
            return self.name
        else:
            participants = list(self.participants.all())
            if len(participants) == 2:
                return f"{participants[0].username}'s and {participants[1].username} Chat"
            else:
                return f"Chat ID: {self.id}"
 
 
class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    edited_timestamp = models.DateTimeField(default=now)
    is_read = models.BooleanField(default=False)   
      
    class Meta:
         ordering = ['timestamp']
         
    def __str__(self):
        return f"Message from {self.sender.username} in {self.chat_room}"
 
class MessageImage(models.Model):
    # Handler for image attachments for messages
    message = models.ForeignKey(Message, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='chat_images/%Y/%m/%d/')
    caption = models.CharField(max_length=255, blank=True, null=True) 
    file_size = models.PositiveIntegerField(editable=False) 
    img_width = models.PositiveIntegerField(null = True, blank=True, editable=False)
    img_height = models.PositiveIntegerField(null = True, blank=True, editable=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['uploaded_at']
    
    def save(self, *args, **kwargs):
        if self.image:
            self.file_size = self.image.size
            # Fetch dimensions from uploaded image
            img = PILImage.open(self.image)
    
 
class Emotes(models.Model):
    message = models.ForeignKey(Message, related_name='emotes', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='emotes', on_delete=models.CASCADE)
    reaction = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # unique_together = ['message', 'sender', 'reaction'] - Depreciated
        constraints = [
            models.UniqueConstraint(fields=['message','sender','reaction'], name='unqiue_emote_per_user')
        ]
    
# Task Management Functionality

class Column(models.Model):
    title = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        

    def __str__(self):
        return self.title

class Task(models.Model):
    COLUMN_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    #On user deletion, remove model.
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    column = models.CharField(max_length=30, choices=COLUMN_CHOICES, default='To Do')
    date = models.DateField(auto_now_add=True)
    attachments = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    comments =  models.IntegerField(default=0, validators=[MinValueValidator(0)])
    tags = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        indexes = [
            models.Index(fields=['user','column']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return self.title

class TaskComment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

class TaskAttachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_attachments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='task_attachments/')
    filename = models.CharField(max_length=255)
    filetype = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.filename
    