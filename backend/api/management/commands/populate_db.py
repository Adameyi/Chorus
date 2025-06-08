import random, string
from faker import Faker
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import ChatRoom, Friends, Message

# Example command: python manage.py populate_db --users 100 --friends 200 --group_chats 10 --dms 20 --messages 50


class Command(BaseCommand):
    help = 'Populate the DB with sample users, friends, group chats'
    
    def add_arguments(self, parser):
        parser.add_argument('--users', type=int, help='Number of users to create')
        parser.add_argument('--friends', type=int, help='Number of friends to create')
        parser.add_argument('--group_chats', type=int, help='Number of group chats to create')
        parser.add_argument('--dms', type=int, help='Number of Direct Messages to create')
        parser.add_argument('--messages', type=int, help='Number of messages per chat (group or DM)')
        
    def handle(self, *args, **kwargs):
        faker = Faker()
        # num_users = kwargs.get('users', 10)
        # num_friends = kwargs.get('friends', 20)
        # num_group_chats = kwargs.get('group_chats', 5)
        # num_dms = kwargs.get('dms', 5)
        # num_messages = kwargs.get('messages', 50)
        
        # if num_users is None: num_users = 10
    
        args = {
            'users' : 10,
            'friends:' : 20,
            'group_chats:' : 5,
            'dms:' : 5,
            'messages:' : 50,
        }
        
        # Iterate over each args in dictionary, retrieve value from kwargs.
        for arg, default in args.items():
            
            # Use args value from kwargs or fallback to default value.
            value = kwargs.get(arg,default)
            
            # Update the dictionary with value for each args.
            args[arg] = value
        
        #extract value from dictionary    
        num_users = args['users']
        num_friends = args['friends']
        num_group_chats = args['group_chats']
        num_dms = args['dms']
        num_messages = args['messages']
        
        # Helper function to generate random passwords
        def generate_random_password(length=12):
            characters = string.ascii_letters + string.digits + string.punctuation
            return ''.join(random.choices(characters, k=length))
        
        # Creates users with realistic names (faker)
        users = []
        for _ in range(num_users):
            first_name = faker.first_name()
            last_name = faker.last_name()
            username = f"{first_name.lower()}.{last_name.lower()}"
            password =generate_random_password()
            user = User.objects.create_user(
                username = username,
                first_name = first_name,
                last_name = last_name,
                password = password
            )
            users.append(user)
            self.stdout.write(f'User created: {user.username} ({first_name}) ({last_name}), Password: {password}')
            
        self.stdout.write(f"Number of Users Created ({num_users})")
            
        # Create friendships (One to One)
        for _ in range(num_friends):
            #Select 2 random users to create One to One Friendship (Ensure user selection is not repeated)
            user1, user2 = random.sample(users, 2)
            Friends.objects.get_or_create(user=user1, friend=user2)
            Friends.objects.get_or_create(user=user2, friend=user1)
        self.stdout.write(f' {user1}, {user2} - {num_friends} Friendship Created.')
        
        # Create DMs
        dm_pairs = set()
        for _ in range(num_dms):
            while True:
                # Select 2 random users from users list.
                user1, user2 = random.sample(users, 2)
                
                # Sorted tuple to ensure consistent pair representation (ignore order, avoid dupes).
                pair = tuple(sorted([user1.id, user2.id]))
                
                # Ensure a DM between both users haven't been established.
                if pair not in dm_pairs:
                    
                    #Update pair to this set to avoid dupes.
                    dm_pairs.add(pair)
                    break
            
            # Create a new ChatRoom (DM only between User 1 & 2).    
            chat_room = ChatRoom.objects.create(
                name=f'DM: {user1.first_name} and {user2.first_name}',
                is_group_chat=False 
            )
            
            # Add both users as ChatRoom 'participants'.
            chat_room.participants.add(user1, user2)
            
            # Send num of messages in created DM.
            for _ in range(num_messages):
                while True:
                    # Randomly choose user1 or 2 to send the message.
                    sender = random.choice([user1, user2])
                    
                    # Create new msg in chat room.
                    Message.objects.create(
                        chat_room=chat_room,
                        sender=sender,
                        content=f"Hello from {sender.first_name} in DM!"
                    )
                    
            # Message to console (DM Creation).
            self.stdout.write(f'{num_dms} DMs created with {num_messages} messages each.')
            
            # Create Group Chats.
            for _ in range(num_group_chats):  
                # Randomly select participants for the group chat (3-10 Participant Range)
                num_participants = random.randint(3, min(10, len(users)))
                participants = random.sample(user, num_participants)
                
                # Random group chat name gen.
                group_name = f"{faker.city()} Group"
                
                # Create group chat room.
                group_chat_room = ChatRoom.objects.create(
                    name=group_name,
                    is_group_chat=True
                )
                
                # Allocate participants to group chat.
                group_chat_room.participants.add(*participants)
                
                # Insert messages in group chat.
                for _ in range(num_messages):
                    sender = random.choice(participants)
                    Message.objects.create(
                        chat_room=group_chat_room,
                        sender=sender,
                        content=f"{faker.sentence()}"
                    )
                    
                # Message to Console (GC Creation)
                self.stdout.write(f"Group chat '{group_name}' created with '{num_participants}'")