import json
import requests
import os
from dotenv import load_dotenv
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def ask_gemini(request):
    load_dotenv()
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            question = (
                data.get("contents", [{}])[0]
                .get("parts", [{}])[0]
                .get("text", "")
            )

            if not question:
                return JsonResponse({"error": "Missing 'question' text in request"}, status=400)
            
            api_key = os.getenv("GOOGLE_API_KEY")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}

            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": question}]
                    }
                ]
            }

            response = requests.post(url, headers=headers, json=payload)
            data = response.json()

            answer = (
                data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
            )

            return JsonResponse({"answer": answer})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
