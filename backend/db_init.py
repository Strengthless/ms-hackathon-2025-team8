from supabase import create_client, Client
import os

DEFAULT_STUDENTS = [
    {"username": "hsh_108", "pw_hash": "myfirstpassword"},
    {"username": "tzw_202", "pw_hash": "mysecondpassword"},
]

DEFAULT_ASSIGNMENTS = [
    {"id": 1, "detail": {"title": "Weekly Letter 1", "description": "Learn your A-Zs", "deadline": "1W"}, "type": 1, "assigned_to": "hsh_108"},
    {"id": 2, "detail": {"title": "Weekly Letter 2", "description": "Intro to Basic Pronunciation", "deadline": "2W"}, "type": 2, "assigned_to": "tzw_202"},
]

DEFAULT_SUBMISSIONS = [
    {"assignment_id": 1, "details": {"Parent's comments": "很好！", "Teacher's comments": "继续努力！"}, "is_final": True, "grade": 95, "feedback": "Good job!"},
    {"assignment_id": 2, "details": {"Parent's comments": "不太清楚。。", "Teacher's comments": "需要改进"}, "is_final": True, "grade": 88, "feedback": "Well done!"},
]


def initialize_supabase_client() -> Client:
    """Initialize and return the Supabase client."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")

    return create_client(supabase_url, supabase_key)


def initialize_students(client: Client):
    """Insert default students if not already present."""
    response = client.table("students").select("*").execute()
    if not response.data:
        print("Initializing default students...")
        for student in DEFAULT_STUDENTS:
            client.table("students").insert(student).execute()


def initialize_assignments(client: Client):
    """Insert default assignments if not already present."""
    response = client.table("assignments").select("*").execute()
    if not response.data:
        print("Initializing default assignments...")
        for assignment in DEFAULT_ASSIGNMENTS:
            client.table("assignments").insert(assignment).execute()


def initialize_submissions(client: Client):
    """Insert default submissions if not already present."""
    response = client.table("submissions").select("*").execute()
    if not response.data:
        print("Initializing default submissions...")
        for submission in DEFAULT_SUBMISSIONS:
            client.table("submissions").insert(submission).execute()


def initialize_database():
    """Initialize the database with default data."""
    supabase_client = initialize_supabase_client()
    initialize_students(supabase_client)
    initialize_assignments(supabase_client)
    initialize_submissions(supabase_client)
    print("Database initialized successfully.")