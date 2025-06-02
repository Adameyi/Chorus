from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .utils.bot_utils import GuchiBot
from .models import ChatRoom

#User login signal handler
@receiver(user_logged_in)
def send_welcome_message_on_login(sender, request, user):
    #Welcome message for when user logs in for the first time
    
    bot = GuchiBot()
    
    #Check if user already has a chat with bot
    existing_chat = ChatRoom.objects.filter(
        participants=user,
        is_group_Chat=False
    ).filter(participants=bot.get_bot_user()).exists()
    
    if not existing_chat:
        bot.send_welcome_message(user)