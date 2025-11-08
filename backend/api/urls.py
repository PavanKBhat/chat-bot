from django.urls import path
from . import views

urlpatterns = [
    path("conversations/", views.conversations_view, name="conversations_view"),
    path("conversations/<int:pk>/rename/", views.rename_conversation, name="rename_conversation"),  # <-- Move this up
    path("conversations/<int:pk>/messages/", views.add_message, name="add_message"),
    path("conversations/<int:pk>/delete/", views.delete_conversation, name="delete_conversation"), 
    path("conversations/<int:pk>/", views.get_conversations, name="get_conversations"),
]
