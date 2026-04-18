import azure.functions as func
import logging
import json
import os
import uuid
import hashlib
from azure.data.tables import TableClient
from azure.core.exceptions import ResourceExistsError, HttpResponseError

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# Helper: Get Table Client
def get_table_client(table_name):
    conn_str = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
    client = TableClient.from_connection_string(conn_str, table_name)
    try:
        client.create_table()
    except ResourceExistsError:
        pass
    return client

# --- REGISTER API ---
@app.route(route="register", methods=["POST"])
def register(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
        username = body.get('username', '').lower().strip()
        password = body.get('password', '')
        displayName = body.get('displayName', '').strip()

        if len(username) < 3 or len(password) < 4:
            return func.HttpResponse(json.dumps({"ok": False, "error": "Invalid input"}), status_code=400, mimetype="application/json")

        users_table = get_table_client("Users")
        
        # Check if user exists (PartitionKey is 'users', RowKey is username)
        try:
            users_table.get_entity(partition_key="users", row_key=username)
            return func.HttpResponse(json.dumps({"ok": False, "error": "User already exists"}), status_code=400, mimetype="application/json")
        except HttpResponseError as e:
            if e.status_code != 404:
                raise

        # Hash password securely
        hashed_pw = hashlib.sha256(password.encode('utf-8')).hexdigest()

        user_entity = {
            "PartitionKey": "users",
            "RowKey": username,
            "displayName": displayName,
            "passwordHash": hashed_pw,
            "avatar": "🚀"
        }
        users_table.create_entity(entity=user_entity)

        return func.HttpResponse(json.dumps({"ok": True, "username": username, "displayName": displayName, "avatar": "🚀"}), mimetype="application/json")
    
    except Exception as e:
        logging.error(f"Register Error: {str(e)}")
        return func.HttpResponse(json.dumps({"ok": False, "error": "Server error"}), status_code=500, mimetype="application/json")


# --- LOGIN API ---
@app.route(route="login", methods=["POST"])
def login(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
        username = body.get('username', '').lower().strip()
        password = body.get('password', '')

        users_table = get_table_client("Users")
        
        try:
            user = users_table.get_entity(partition_key="users", row_key=username)
            hashed_pw = hashlib.sha256(password.encode('utf-8')).hexdigest()
            if user.get("passwordHash") != hashed_pw:
                return func.HttpResponse(json.dumps({"ok": False, "error": "Invalid password"}), status_code=400, mimetype="application/json")
            
            return func.HttpResponse(json.dumps({
                "ok": True, 
                "username": username, 
                "displayName": user.get('displayName'), 
                "avatar": user.get('avatar', '🎯')
            }), mimetype="application/json")
            
        except HttpResponseError as e:
            if e.status_code == 404:
                return func.HttpResponse(json.dumps({"ok": False, "error": "User not found"}), status_code=404, mimetype="application/json")
            raise

    except Exception as e:
        logging.error(f"Login Error: {str(e)}")
        return func.HttpResponse(json.dumps({"ok": False, "error": "Server error"}), status_code=500, mimetype="application/json")


# --- SYNC PROGRESS API ---
@app.route(route="progress/sync", methods=["POST"])
def sync_progress(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
        username = body.get('username')
        progress_data = body.get('gameState', {})

        if not username:
             return func.HttpResponse(json.dumps({"ok": False, "error": "Missing username"}), status_code=400, mimetype="application/json")

        progress_table = get_table_client("Progress")
        
        # Calculate XP and tasks for leaderboard syncing easily
        tasks_solved = len([t for t in progress_data.get('solvedTasks', {}).values() if t.get('solved')])
        lectures_read = len(progress_data.get('completedLectures', []))
        score = (tasks_solved * 3) + (lectures_read * 2)

        entity = {
            "PartitionKey": "progress",
            "RowKey": username,
            "gameState": json.dumps(progress_data),
            "score": score,
            "tasksCount": tasks_solved,
            "lecturesCount": lectures_read
        }
        
        progress_table.upsert_entity(entity=entity)
        return func.HttpResponse(json.dumps({"ok": True}), mimetype="application/json")

    except Exception as e:
        logging.error(f"Sync Error: {str(e)}")
        return func.HttpResponse(json.dumps({"ok": False, "error": "Server error"}), status_code=500, mimetype="application/json")


# --- GET PROGRESS API ---
@app.route(route="progress", methods=["GET"])
def get_progress(req: func.HttpRequest) -> func.HttpResponse:
    try:
        username = req.params.get('username')
        if not username:
             return func.HttpResponse(json.dumps({"ok": False, "error": "Missing username"}), status_code=400, mimetype="application/json")

        progress_table = get_table_client("Progress")
        try:
            entity = progress_table.get_entity(partition_key="progress", row_key=username)
            return func.HttpResponse(json.dumps({"ok": True, "gameState": json.loads(entity.get('gameState', '{}'))}), mimetype="application/json")
        except HttpResponseError as e:
             if e.status_code == 404:
                 return func.HttpResponse(json.dumps({"ok": True, "gameState": None}), mimetype="application/json")
             raise

    except Exception as e:
        logging.error(f"Get Progress Error: {str(e)}")
        return func.HttpResponse(json.dumps({"ok": False, "error": "Server error"}), status_code=500, mimetype="application/json")


# --- LEADERBOARD API ---
@app.route(route="leaderboard", methods=["GET"])
def leaderboard(req: func.HttpRequest) -> func.HttpResponse:
    try:
        progress_table = get_table_client("Progress")
        users_table = get_table_client("Users")

        entities = list(progress_table.query_entities("PartitionKey eq 'progress'"))
        
        # Sort by score descending
        entities.sort(key=lambda x: x.get('score', 0), reverse=True)
        top_entities = entities[:50]

        # Fetch display names and avatars from Users table
        leaderboard_data = []
        for ent in top_entities:
            username = ent['RowKey']
            try:
                user = users_table.get_entity(partition_key="users", row_key=username)
                display_name = user.get('displayName', username)
                avatar = user.get('avatar', '🎯')
            except HttpResponseError:
                display_name = username
                avatar = '🎯'

            leaderboard_data.append({
                "username": username,
                "displayName": display_name,
                "avatar": avatar,
                "score": ent.get('score', 0),
                "tasksCount": ent.get('tasksCount', 0),
                "lecturesCount": ent.get('lecturesCount', 0)
            })

        return func.HttpResponse(json.dumps({"ok": True, "leaderboard": leaderboard_data}), mimetype="application/json")

    except Exception as e:
        logging.error(f"Leaderboard Error: {str(e)}")
        return func.HttpResponse(json.dumps({"ok": False, "error": "Server error"}), status_code=500, mimetype="application/json")
