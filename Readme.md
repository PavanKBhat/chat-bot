A full-stack conversational AI application built with React + Tailwind (frontend) and Django REST Framework (backend).
Users can register, log in, and chat with an AI assistant powered by Gemini API, with chat history stored securely in PostgreSQL.

**Features**

- 🔐 User Authentication (JWT-based Login & Signup)

- 💬 Interactive Chat UI (Markdown + code block rendering)

- 🧩 Gemini API Integration

- 🕒 Conversation History saved per user

- ⚙️ DRF + React + Tailwind architecture

- 🐘 PostgreSQL database



| Layer    | Technology                                |
| -------- | ----------------------------------------- |
| Frontend | React + TypeScript + TailwindCSS          |
| Backend  | Django REST Framework                     |
| Database | PostgreSQL                                |
| AI Model | Google Gemini                             |
| Auth     | JWT (via `djangorestframework-simplejwt`) |



**Project Setup**
1. Clone the repository
2. Backend Setup (Django)
   - python -m venv venv
   - source venv/bin/activate      # For macOS/Linux
   - venv\Scripts\activate         # For Windows 
   - pip install -r requirements.txt
3. Create a .env file inside your backend/ folder:  and then define below values
    GEMINI_API_KEY=your_gemini_api_key_here
    SECRET_KEY=your_django_secret_key
    DATABASE_URL=postgres://username:password@localhost:5432/chatdb
4. Run Migrations with below command
   - python manage.py migrate
5. Run the server with below command
   - python manage.py runserver
   - Backend will run at: http://127.0.0.1:8000/

6. *Frontend Setup*
   - cd frontend
   - npm install
   - npm run dev
   - Frontend will run at: http://localhost:5173/
<img width="959" height="535" alt="image" src="https://github.com/user-attachments/assets/b77e23b5-57e5-4f7e-86d7-835ae696a387" />

<img width="960" height="533" alt="image" src="https://github.com/user-attachments/assets/55d43ec6-4f47-43f9-aa3b-e3c5921a91ae" />

<img width="959" height="535" alt="image" src="https://github.com/user-attachments/assets/e6dc7ae5-c8f9-4ccb-bda3-88e18a34075b" />

<img width="960" height="534" alt="image" src="https://github.com/user-attachments/assets/c374c0bb-62b3-4127-929f-e7618cdeef8f" />

<img width="960" height="536" alt="image" src="https://github.com/user-attachments/assets/9296b975-40ab-4418-8a8b-fe47ea81414c" />

<img width="959" height="534" alt="image" src="https://github.com/user-attachments/assets/198b664a-e503-461b-8464-c85feba665c6" />

<img width="958" height="530" alt="image" src="https://github.com/user-attachments/assets/d10c9516-259a-4bbc-9c23-2e398eb1b1e1" />

<img width="957" height="532" alt="image" src="https://github.com/user-attachments/assets/3f41c087-cac7-4973-9a5a-b2263f20740f" />
