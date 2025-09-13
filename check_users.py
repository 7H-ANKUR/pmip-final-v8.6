from backend.utils.supabase_client import supabase_client
import json

def check_users():
    supabase = supabase_client.get_supabase()
    if supabase:
        result = supabase.table('users').select('id, email, first_name, last_name, password_hash').execute()
        print('Current users in database:')
        for user in result.data:
            print(f'Email: {user["email"]}, Name: {user["first_name"]} {user["last_name"]}, Password Hash: {user["password_hash"][:20]}...')
    else:
        print('Failed to connect to database')

if __name__ == "__main__":
    check_users()
