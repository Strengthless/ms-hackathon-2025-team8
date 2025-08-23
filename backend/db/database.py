from supabase import Client
import logging
import os
from datetime import datetime, timezone

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
LOG_FORMAT = os.getenv(
    "LOG_FORMAT",
    "%(asctime)s %(levelname)s [%(name)s] %(message)s"
)
DATE_FORMAT = os.getenv("LOG_DATE_FORMAT", "%Y-%m-%dT%H:%M:%S%z")

logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT, datefmt=DATE_FORMAT)
logger = logging.getLogger("pronunciation-api")

# Reduce noise from some libraries if desired
logging.getLogger("uvicorn").setLevel(LOG_LEVEL)
logging.getLogger("uvicorn.error").setLevel(LOG_LEVEL)
logging.getLogger("uvicorn.access").setLevel(LOG_LEVEL)

def get_all_records(client: Client, table_name: str):
    """Fetch all records from a table."""
    try:
        response = client.table(table_name).select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching records from {table_name}: {e}")
        return {"error": str(e)}

def insert_record(client: Client, table_name: str, data: dict):
    """Insert a record into a table."""
    try:
        response = client.table(table_name).insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error inserting record into {table_name}: {e}")
        return {"error": str(e)}

def update_record(client: Client, table_name: str, record_id: int, data: dict):
    """Update a record in a table."""
    try:
        response = client.table(table_name).update(data).eq("id", record_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating record in {table_name}: {e}")
        return {"error": str(e)}

def delete_record(client: Client, table_name: str, record_id: int):
    """Delete a record from a table."""
    try:
        response = client.table(table_name).delete().eq("id", record_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error deleting record from {table_name}: {e}")
        return {"error": str(e)}

# Functions for students Table
def create_student(client, username: str, pw_hash: str):
    """Insert a new student into the students table."""
    created_at = datetime.now(timezone.utc).isoformat()
    data = {"username": username, "pw_hash": pw_hash, "created_at": created_at}
    try:
        response = client.table("students").insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error creating student: {e}")
        return {"error": str(e)}

def get_all_students(client):
    """Fetch all students from the students table."""
    try:
        response = client.table("students").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching students: {e}")
        return {"error": str(e)}

def get_student_by_username(client, username: str):
    """Fetch a student by username."""
    try:
        response = client.table("students").select("*").eq("username", username).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching student by username: {e}")
        return {"error": str(e)}

def update_student_password(client, username: str, new_pw_hash: str):
    """Update a student's password."""
    try:
        response = client.table("students").update({"pw_hash": new_pw_hash}).eq("username", username).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating student password: {e}")
        return {"error": str(e)}

def delete_student(client, username: str):
    """Delete a student by username."""
    try:
        response = client.table("students").delete().eq("username", username).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error deleting student: {e}")
        return {"error": str(e)}

# Functions for assignments Table
def create_assignment(client, id:int, detail: dict, type: int, assigned_to: str):
    """Insert a new assignment into the assignments table."""
    created_at = datetime.now(timezone.utc).isoformat()
    try:
        data = {"id": id, "detail": detail, "type": type, "assigned_to": assigned_to, "created_at": created_at}
        response = client.table("assignments").insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error creating assignment: {e}")
        return {"error": str(e)}

def get_all_assignments(client):
    """Fetch all assignments from the assignments table."""
    try:
        response = client.table("assignments").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching assignments: {e}")
        return {"error": str(e)}

def get_assignments_by_student(client, assigned_to: str):
    """Fetch assignments assigned to a specific student."""
    try:
        response = client.table("assignments").select("*").eq("assigned_to", assigned_to).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching assignments by student: {e}")
        return {"error": str(e)}

def update_assignment(client, id: int, detail: dict = None, type: int = None):
    """Update an assignment."""
    data = {}
    if detail:
        data["detail"] = detail
    if type is not None:
        data["type"] = type
    try:
        response = client.table("assignments").update(data).eq("id", id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating assignment: {e}")
        return {"error": str(e)}

def delete_assignment(client, id: int):
    """Delete an assignment by ID."""
    try:
        response = client.table("assignments").delete().eq("id", id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error deleting assignment: {e}")
        return {"error": str(e)}

# Functions for submissions Table
def create_submission(client, assignment_id: int, details: dict, is_final: bool, grade: int = None, feedback: str = None):
    """Insert a new submission into the submissions table."""
    created_at = datetime.now(timezone.utc).isoformat()
    data = {
        "assignment_id": assignment_id,
        "details": details,
        "is_final": is_final,
        "grade": grade,
        "feedback": feedback,
        "created_at": created_at
    }
    try:
        response = client.table("submissions").insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error creating submission: {e}")
        return {"error": str(e)}

def get_all_submissions(client):
    """Fetch all submissions from the submissions table."""
    try:
        response = client.table("submissions").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching submissions: {e}")
        return {"error": str(e)}

def get_submissions_by_assignment(client, assignment_id: int):
    """Fetch submissions for a specific assignment."""
    try:
        response = client.table("submissions").select("*").eq("assignment_id", assignment_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching submissions by assignment: {e}")
        return {"error": str(e)}

def update_submission(client, submission_id: int, is_final: bool = None, grade: int = None, feedback: str = None):
    """Update a submission."""
    data = {}
    if is_final is not None:
        data["is_final"] = is_final
    if grade is not None:
        data["grade"] = grade
    if feedback:
        data["feedback"] = feedback
    try:
        response = client.table("submissions").update(data).eq("id", submission_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating submission: {e}")
        return {"error": str(e)}

