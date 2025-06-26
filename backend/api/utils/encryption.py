import os
import base64
import hashlib
from cryptography.fernet import Fernet, MultiFernet
from cryptography.hazmat.primitives import hashes
from cryptography.fernet import encrypt_at_time, extract_timestamp
import time
from models import ChatRoomKey, SecureMessageImage, MessageImage 
from django.core.files.storage import default_storage
from django.contrib.auth.models import User


#Encrpytion scheme for securing images
class SecureImageStorage:
    # Handle encryption/decryption of message images
    def _get_chat_room_key(self, chat_room_id):
        # Get encryption key specific to chat room.
        try:
            chat_key_obj = ChatRoomKey.objects.get(
                chat_room=chat_room_id,
                is_active=True
            ).first()
            if chat_key_obj:
                return Fernet(chat_key_obj.key)
            else:
                raise ChatRoomKey.DoesNotExist
        except ChatRoomKey.DoesNotExist:
            # Generate a new key for this chat room.
            new_key = Fernet.generate_key()
            ChatRoomKey.objects.create(
                chat_Room_id=chat_room_id,
                key=new_key,
                is_active=True
            )
            return Fernet(new_key)
        
    # Get current key version for hcat room.
    def _get_key_version(self, chat_room_id):
        try:
            chat_key_obj = ChatRoomKey.objects.get(
                chat_room_id=chat_room_id,
                is_active=True,
            )
            return chat_key_obj.version
        except ChatRoomKey.DoesNotExist:
            return 1 # Default Version (1).   
    
    # Encrypt image using chat room's key.
    def encrypt_image(self, image_file, chat_room_id, user_id):
        
        # Get chat room specific cipher.
        cipher = self.get_chat_room_key(chat_room_id)
        
        # Read and encrypt image.
        image_content = image_file.read()
        encrypted_content = cipher.encrypt(image_content)
        
        # Create integrity hash.
        content_hash = hashlib.sha256(image_content).hexdigest()
        
        return {
            'encrypted_content': encrypted_content,
            'content_hash': content_hash,
            'chat_room_id': chat_room_id,
            'key_version': self._get_key_version(chat_room_id)
        }
    
    # Decrypt image using chat room key with perm check.
    def decrypt_image(self, encrypted_file_path, chat_room_id, requesting_user_id):
        
        # Verify user has access to this chat room
        if not self._user_has_chat_access(requesting_user_id, chat_room_id):
            raise PermissionError("User not authorized for this chat room")
        
        # Get Chat Room Cipher
        cipher = self.get_chat_room_key(chat_room_id)
        
        # Decrypt Chat
        with default_storage.open(encrypted_file_path, 'rb') as f:
            encrypted_content = f.read()
        
        return cipher.decrypt(encrypted_content)
    
    # Re-encrypt all images in a chat room with new key via rotate method
    def re_encrypt_chat_images(self, chat_room_id):
        # Run after key rotation.
        old_cipher = None
        new_cipher = self._get_chat_room_key(chat_room_id)
        
        # Fetch all secure images for specific chat room
        secure_images = SecureMessageImage.objects.filter(
            message__chat_room_id=chat_room_id
        )
        
    
    #Rotate encryption key for a specific chat room    
    def rotate_chat_room_key(self, chat_room_id):
        #Mark old key as inactive
        ChatRoomKey.objects.filter(
            chat_room_id=chat_room_id,
            is_active=True,
        ).update(is_active=False)
        
        # Create new key
        new_key = Fernet.generate_key()
        ChatRoomKey.objects.create(
            chat_room_id=chat_room_id,
            key=new_key,
            is_active=True,
            version=self._get_next_version(chat_room_id)
        )
        
        #Re-encrypt existing images with a new key
        self.re_encrypt_chat_images(chat_room_id)