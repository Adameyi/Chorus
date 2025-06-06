import random, string
from faker import Faker
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import ChatRoom, Friends, Message

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
        num_users = kwargs.get('users', 10)
        num_friends = kwargs.get('friends', 20)
        num_group_chats = kwargs.get('group_chats', 5)
        num_dms = kwargs.get('dms', 5)
        num_messages = kwargs.get('messages', 50)
        
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
            
        # Create friendships (One to One)
        for _ in range(num_friends):
            #Select 2 random users to create One to One Friendship (Ensure user selection is not repeated)
            user1, user2 = random.sample(users, 2)
            Friends.objects.get_or_create(user=user1, friend=user2)
            Friends.objects.get_or_create(user=user2, friend=user1)
        self.stdout.write(f' {user1}, {user2} - {num_friends} Friendship Created.')