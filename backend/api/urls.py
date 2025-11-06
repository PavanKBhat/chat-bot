from django.urls import path
from . import views

urlpatterns = [
    path("conversations/", views.conversations_view, name="conversations_view"),
    path("conversations/<int:pk>/", views.get_conversations, name="get_conversations"),
    path("conversations/<int:pk>/messages/", views.add_message, name="add_message"),
]
