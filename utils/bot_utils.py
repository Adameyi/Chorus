from django.contrib.auth.models import User
from api.models import ChatRoom, Message, Friends
from django.utils import timezone
import random

class GuchiBot:
    def __init__(self):
        self.bot_user = self._get_or_create_bot()
        self.welcome_messages = [
            "Welcome to the platform\n\nI'm Guchi, the friendly bot assistant for Chorus. Feel free to explore and connect with friends"
            "Hello there! \n\nI'm Chorus' Bot Guchi, If you need any assistance, feel free to reach out!",
            "Welcome aboard! \n\nI'm Guchi, your bot companion. Don't hesitate to reach out if you need any assistance!",
            "Hello and welcome to our community! I'm Guchi, and I'm excited to have you here. Enjoy exploring!",
        ]
        
    def _get_or_create_bot(self):
        # Create/Get the Bot User.
        bot_user, created = User.objects.get_or_create(
            username='Guchi',
            defaults={
                'email' : 'guchi@bot.local',
                'first_name' : 'Guchi',
                'last_name' : 'Bot',
                'is_active' : True,
                'is_staff' : False,
                'is_superuser' : False,
            }
        )
        
        if created:
            bot_user.set_password('bot_password_not_for_login')
            bot_user.save()
            
        return bot_user
    
    def send_welcome_message(self, user):
        #Send a welcome message to a new user
        try:
            #Check if a welcome message is already sent
            existing_chat = ChatRoom.objects.filter(participant=user, is_group_chat=False).filter(participants=self.bot_user).first()
            
            #Check if bot has already sent a message
            if existing_chat:
                existing_message= Message.objects.filter(chat_room=existing_chat, sender=self.bot_user).first()
                
            if existing_message:
                return existing_chat # A welcome message has already been sent.
            else:
                #Create a new chat room
                existing_chat = ChatRoom.objects.create(is_group_chat=False)
                existing_chat.participants.add(user, self.bot_user)
                
            #Send Welcome message
            welcome_text = random.choice(self.welcome_messages)
            messages = Message.objects.create(
                chat_room=existing_chat,
                sender=self.bot_user,
                content=welcome_text,
            )
            
            return existing_chat
        
        except Exception as error:
            print(f"Error sending welcome message to {user.username} : {error}")
            return None
        
    def send_custom_message(self, user, message_content):
        #Send a custom message to a user
        try:
            # Get/create chat room
            chat_room = ChatRoom.objects.filter(
                participants=user,
                is_group_chat=False
            ).filter(participants=self.bot_user).first()
            
            if not chat_room:
                chat_room = ChatRoom.objects.create(is_group_chat=False)
                chat_room.participants.add(user, self.bot_user)
                
            # Send custom message
            message = Message.objects.create(
                chat_room=chat_room,
                sender=self.bot_user,
                content=message_content
            )
            
            return message
                
        except Exception as error:
            print(f"Error sending a custom message to {user.username} : {error}")
            return None
            