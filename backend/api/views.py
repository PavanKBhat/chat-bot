from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.contrib.auth import get_user_model
import google.generativeai as genai
from dotenv import load_dotenv
from django.conf import settings


User = get_user_model()
load_dotenv()

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


User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_message(request, pk):
    """
    Adds a new message to a conversation and generates an AI response using Gemini.
    Includes full conversation context + summarized memory from user's past chats.
    """
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    content = request.data.get("content", "").strip()
    sender_from_frontend = str(request.data.get("sender", "")).strip().lower()

    if not content:
        return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)

    sender = "ai-bot" if sender_from_frontend in ["bot", "ai-bot", "assistant"] else request.user.username

    # Save user message
    user_message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content
    )

    # Update conversation title if it's still default
    if conversation.title.lower() == "new conversation" and sender != "ai-bot":
        short_title = content[:40].strip() + ("..." if len(content) > 40 else "")
        conversation.title = short_title
        conversation.save(update_fields=["title"])

    # 🧠 1️⃣ Get current conversation context
    current_history = conversation.messages.order_by("timestamp")[:10]
    current_context = "\n".join([
        f"{'User' if m.sender != 'ai-bot' else 'AI'}: {m.content}"
        for m in current_history
    ])

    # 🧠 2️⃣ Summarize all other past conversations by the same user
    other_convos = Conversation.objects.filter(user=request.user).exclude(id=conversation.id)
    other_messages = Message.objects.filter(conversation__in=other_convos).order_by("timestamp")[:20]
    other_context = "\n".join([
        f"{'User' if m.sender != 'ai-bot' else 'AI'}: {m.content}"
        for m in other_messages
    ])
    # 🧩 Combine both
    full_prompt = (
        "You are an intelligent AI assistant. "
        "You can remember what the user discussed across multiple conversations.\n\n"
        "Here is what the user and you have talked about in the past:\n"
        f"{other_context}\n\n"
        "Here is the current conversation:\n"
        f"{current_context}\n\n"
        f"User: {content}\nAI:"
    )

    # 🔮 Call Gemini
    bot_reply = "⚠️ Unable to generate a response."
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)

        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
        except Exception:
            model = genai.GenerativeModel("gemini-1.5-flash")

        response = model.generate_content(full_prompt)
        bot_reply = (response.text or "").strip() or "🤖 (Empty Gemini response)"
    except Exception as e:
        logging.error(f"Gemini API error: {e}")
        bot_reply = f"⚠️ Error communicating with Gemini: {e}"

    # Save AI message
    bot_message = Message.objects.create(
        conversation=conversation,
        sender="ai-bot",
        content=bot_reply
    )

    return Response({
        "user_message": MessageSerializer(user_message).data,
        "bot_message": MessageSerializer(bot_message).data
    }, status=status.HTTP_201_CREATED)

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

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def rename_conversation(request, pk):
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=404)

    new_title = request.data.get("title", "").strip()
    if not new_title:
        return Response({"error": "Title cannot be empty"}, status=400)

    conversation.title = new_title
    conversation.save(update_fields=["title"])
    return Response({"message": "Conversation renamed successfully", "title": new_title})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_conversation(request, pk):
    """
    Deletes a specific conversation for the logged-in user.
    """
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    conversation.delete()
    return Response({"message": "Conversation deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
