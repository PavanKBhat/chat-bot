from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def conversations_view(request):
    if request.method == 'GET':
        conversations = Conversation.objects.filter(user=request.user).order_by('-created_at')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        title = request.data.get("title", "New Chat")
        conversation = Conversation.objects.create(title=title, user=request.user)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_message(request, pk):
    """
    Adds a new message (user or bot) to the conversation.
    - If sender is 'bot', saves as 'ai-bot'
    - Otherwise uses the logged-in user's username
    - Automatically updates conversation title based on first user message
    """
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    sender_from_frontend = str(request.data.get("sender", "")).strip().lower()
    content = request.data.get("content")

    if not content:
        return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Determine sender
    if sender_from_frontend in ["bot", "ai-bot", "assistant"]:
        sender = "ai-bot"
    else:
        sender = request.user.username

    # ✅ Save the message
    message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content
    )

    # ✅ Automatically update title if it's still "New Conversation"
    if conversation.title.lower() == "new conversation" and sender != "ai-bot":
        short_title = content[:40].strip() + ("..." if len(content) > 40 else "")
        conversation.title = short_title
        conversation.save(update_fields=["title"])

    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request, pk):
    """
    Returns a single conversation and all its messages for the logged-in user.
    """
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ConversationSerializer(conversation)
    return Response(serializer.data)

