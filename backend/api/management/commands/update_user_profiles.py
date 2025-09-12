import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import UserProfile

class Command(BaseCommand):
    help = 'Create or Insert default profile images for existing users.'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--assign-images',
            action='store_true',
            help='Assigns random default profile images to users without one',
        )
        
        parser.add_argument(
            '--update-existing',
            action='store_true',
            help='Update existing profiles swith missing fiels',
        )

    def handle(self, *args, **kwargs):
        assign_images = kwargs['assign_images']
        update_existing = kwargs['update_existing']
        
        #Assign default profile images
        default_images = [
            'profiles/profile_placeholder_blue.png',
            'profiles/profile_placeholder_purple.png',
            'profiles/profile_placeholder_green.png',
            'profiles/profile_placeholder_red.png',
            'profiles/profile_placeholder_orange.png',
            'profiles/profile_placeholder_yellow.png',
            'profiles/profile_placeholder_pink.png',
        ]
        
        users_updated = 0
        profiles_created = 0
        
        for user in User.objects.all():
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults= {
                    'display_name' : user.username,
                    'profile_image' : random.choice(default_images) if assign_images else 'profiles/profile_placeholder_blue.png',
                    'bio': '',
                    'is_online': False,
                    'created_at': timezone.now(),
                }
            )
                
            if created:
                profiles_created +=1
                self.stdout.write(
                    self.style.SUCCESS(f'Created profile image for user: {user.username}')
                )
                
            elif update_existing:
                updated = False
                
                #Update display_name if it's empty.
                if not profile.display_name:
                    profile.display_name = user.username
                    updated = True
                    
                #Assign profile image if requested and null.
                if assign_images and not profile.profile_image:
                    profile.profile_image = random.choice(default_images)
                    updated = True
                    
                #Set created_at if null (for the new field)
                if not profile.created_at:
                    profile.created_at = timezone.now()
                    updated = True
                    
                if updated:
                    profile.save()
                    users_updated += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Updated profile for user: {user.username}')
                    )
                    
        self.stdout.write(
            self.style.SUCCESS(
                f'\nOverview:\n'
                f'Profiles created: {profiles_created}\n'
                f'Profiles Updated: {users_updated}\n'
                f'Total Users: {User.objects.count()}\n\n'
                )
        )
                
        #Display users with profile images.
        users_with_images = UserProfile.objects.exclude(profile_image='').count()
        self.stdout.write(
                self.style.SUCCESS(f'Users with profile images: {users_with_images}')
            )