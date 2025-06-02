from django.contrib import admin
from .models import Task

# Register your models here.

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'column', 'date', 'due_date', 'order']
    list_filter = ['column', 'date', 'due_date']
    search_fields = ['title', 'description']
    