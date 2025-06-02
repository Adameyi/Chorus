from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import ChatRoom, Message

class Command(BaseCommand):
    help = 'Create a Guchi Bot user for user welcome and debugging'
    
    def handle (self, *args, **options):
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
            # Set random password (Guchi bot will not login normally).
            bot_user.set_password('bot_password_not_for_login')
            bot_user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created bot user: {bot_user.username}')
            )
            
        else:
            self.stdout.write(
                self.style.WARNING(f'Bot user already exists: {bot_user.username}')
            )