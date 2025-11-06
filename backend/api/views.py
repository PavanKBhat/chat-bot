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
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    sender = request.user.username
    content = request.data.get("content")

    if not content:
        return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Save only the user message
    user_msg = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content
    )

    # ✅ Create static AI response (not saved in DB)
    ai_response = f"🤖 Static response: You said '{content}'. (AI reply coming soon!)"

    # ✅ Return both (one saved, one generated)
    response_data = {
        "user_message": MessageSerializer(user_msg).data,
        "ai_response": {
            "sender": "AI Bot",
            "content": ai_response
        }
    }

    return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    """
    Returns all past conversations for the logged-in user, ordered by creation date.
    """
    conversations = Conversation.objects.filter(user=request.user).order_by('-created_at')
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data)
