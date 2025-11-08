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
