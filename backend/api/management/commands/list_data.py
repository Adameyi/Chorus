from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import ChatRoom, Friends, Message

class Command(BaseCommand):
    help = 'List all users, friendships, group chats, DMs, and messages.'
    
    def add_arguments(self, parser):
        # Store_true because it's only a boolean flag.
        parser.add_argument('--users', action='store_true', help='Only lists all users.')
        parser.add_argument('--friends', action='store_true', help='Only lists all friendships.')
        parser.add_argument('--dms', action='store_true', help='Only lists all dms.')
        parser.add_argument('--groupchats', action='store_true', help='Only lists all groupchats.')
        parser.add_argument('--messages', action='store_true', help='Only lists all messages.')
            
    def handle(self, *args, **options):
        total_entries = 0
        
        # Track any flags used.
        flag_set_any = any([
            options['users'],
            options['friends'],
            options['groupchats'],
            options['dms'],
            options['messages'],
        ])
        
        list_users = options['users'] or not flag_set_any
        list_friends = options['friends'] or not flag_set_any
        list_group_chats = options['groupchats'] or not flag_set_any
        list_dms = options['dms'] or not flag_set_any
        list_messages = options['messages'] or not flag_set_any
        
        if list_users:
            self.stdout.write("\n--- USERS ---")
            users = User.objects.all()
            if users.exists():
                for user in users:
                    self.stdout.write(f"Username: {user.username}, Name: {user.first_name}, ID: {user.id}")
                self.stdout.write(f"\nListed ({users.count()}) Users")
                total_entries += users.count()
            else:
                self.stdout.write(f"No Users Listed.")
        
        if list_friends:    
            self.stdout.write("\n--- FRIENDSHIPS ---")
            friends = Friends.objects.all()
            if friends.exists():
                for friend in friends:
                    self.stdout.write(f"Username: {friend.user.username}, is friends with {friend.friend.username}")
                self.stdout.write(f"\nListed ({friends.count()}) Friends")
                total_entries += friends.count()
            else:
                self.stdout.write(f"No Friendships Listed.")
        
        if list_group_chats:
            groupChats = ChatRoom.objects.filter(is_group_chat=True)        
            self.stdout.write("\n--- CHAT ROOMS ---")
            if groupChats.exists():
                for chatRoom in groupChats:
                    participants = ', '.join([user.username for user in chatRoom.participants.all()])
                    self.stdout.write(f"Group Chat - '{chatRoom.name}', (ID: {chatRoom.id} with participants: {participants})")
                self.stdout.write(f"\nListed ({groupChats.count()}) Group Chats")
                total_entries += groupChats.count()
            else:
                self.stdout.write(f"No Group Chats Listed.") 
                
        if list_dms:
            dms = ChatRoom.objects.filter(is_group_chat=False)        
            self.stdout.write("\n--- DMS ---")
            if dms.exists():
                for dm in dms:
                    participants = ', '.join([user.username for user in dm.participants.all()])
                    self.stdout.write(f"DM - '{dm.name}', (ID: {dm.id} with participants: {participants})")
                self.stdout.write(f"\nListed ({dms.count()}) DMs")
                total_entries += dms.count()
            else:
                self.stdout.write(f"No DMs Listed.") 
                        
        if list_messages:        
            self.stdout.write("\n--- MESSAGES ---")
            messages = Message.objects.all()
            if messages.exists():
                for message in messages.order_by('chat_room', 'timestamp'):
                    self.stdout.write(
                        f"[{message.chat_room.name}] {message.sender.username}: {message.content} (at {message.timestamp})"
                    )
                self.stdout.write(f"\nListed ({messages.count()}) Messages")
                total_entries += messages.count()
            else:
                self.stdout.write(f"No Messages Listed.") 
                
        self.stdout.write(f"\nList complete with {total_entries} Total Entries.")
            
        