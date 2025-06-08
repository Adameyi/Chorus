from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import ChatRoom, Friends, Message

class Command(BaseCommand):
    help = "Clear all users, friends, group chats, and message from production database."
    
    def handle(self, *args, **kwargs):
        confirm = input("WARNING: This will delete ALL data (Users, Friends, Chat Rooms, Messages). Are you sure? [Y/N]")
        if confirm.lower() != 'y':
            self.stdout.write("Operation cancelled.")
            return
        
        Message.objects.all().delete()
        self.stdout.write("All Messsages have been deleted")
        ChatRoom.objects.all().delete()
        self.stdout.write("All Chat Rooms have been deleted")
        Friends.objects.all().delete()
        self.stdout.write("All Friends have been deleted")
        User.objects.exclude(is_superuser=True).delete()
        self.stdout.write("All Users have been deleted (Excluding Superuser).")
        
        self.stdout.write("\nAll data has been cleared")