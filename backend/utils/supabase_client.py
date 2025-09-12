import os
import requests
from typing import Optional, Dict, Any, List
from config import Config

class SupabaseClient:
    def __init__(self):
        self.url = Config.SUPABASE_URL
        self.key = Config.SUPABASE_KEY
        self.service_key = Config.SUPABASE_SERVICE_KEY
        self.storage_bucket = Config.SUPABASE_STORAGE_BUCKET
        
        # Create a simple REST API client for Supabase
        if self.url and self.key:
            self.base_url = f"{self.url}/rest/v1"
            self.headers = {
                'apikey': self.key,
                'Authorization': f'Bearer {self.key}',
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
            self.client = SimpleSupabaseClient(self.base_url, self.headers)
        else:
            self.base_url = None
            self.headers = None
            self.client = None
    
    def is_configured(self):
        """Check if Supabase is properly configured"""
        return self.client is not None
    
    def get_supabase(self):
        """Return the Supabase client"""
        return self.client
    
    def upload_file(self, file_path: str, file_name: str, content_type: str = None):
        """
        Upload a file to Supabase Storage
        
        Args:
            file_path: Local path to the file
            file_name: Name to store the file as
            content_type: MIME type of the file
        
        Returns:
            dict: Response with file URL or error
        """
        if not self.is_configured():
            return {"error": "Supabase not configured"}
        
        try:
            with open(file_path, 'rb') as f:
                file_data = f.read()
            
            # Upload to Supabase Storage
            response = self.client.storage.from_(self.storage_bucket).upload(
                path=file_name,
                file=file_data,
                file_options={
                    "content-type": content_type or "application/octet-stream"
                }
            )
            
            if response.get('error'):
                return {"error": response['error']}
            
            # Get public URL
            public_url = self.client.storage.from_(self.storage_bucket).get_public_url(file_name)
            
            return {
                "success": True,
                "url": public_url,
                "path": file_name
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def delete_file(self, file_name: str):
        """
        Delete a file from Supabase Storage
        
        Args:
            file_name: Name of the file to delete
        
        Returns:
            dict: Response with success status or error
        """
        if not self.is_configured():
            return {"error": "Supabase not configured"}
        
        try:
            response = self.client.storage.from_(self.storage_bucket).remove([file_name])
            
            if response.get('error'):
                return {"error": response['error']}
            
            return {"success": True}
            
        except Exception as e:
            return {"error": str(e)}
    
    def get_file_url(self, file_name: str):
        """
        Get public URL for a file
        
        Args:
            file_name: Name of the file
        
        Returns:
            str: Public URL or None if not configured
        """
        if not self.is_configured():
            return None
        
        try:
            return self.client.storage.from_(self.storage_bucket).get_public_url(file_name)
        except Exception:
            return None
    
    def list_files(self, folder: str = ""):
        """
        List files in a folder
        
        Args:
            folder: Folder path to list files from
        
        Returns:
            list: List of file objects or empty list if error
        """
        if not self.is_configured():
            return []
        
        try:
            response = self.client.storage.from_(self.storage_bucket).list(folder)
            return response or []
        except Exception:
            return []

class SimpleSupabaseClient:
    def __init__(self, base_url: str, headers: Dict[str, str]):
        self.base_url = base_url
        self.headers = headers
    
    def table(self, table_name: str):
        return SimpleTable(self.base_url, self.headers, table_name)

class SimpleTable:
    def __init__(self, base_url: str, headers: Dict[str, str], table_name: str):
        self.base_url = base_url
        self.headers = headers
        self.table_name = table_name
        self.url = f"{base_url}/{table_name}"
        self._select_fields = "*"
        self._filters = []
        self._limit_value = None
        self._order_by = None
    
    def select(self, fields: str = "*"):
        self._select_fields = fields
        return self
    
    def eq(self, column: str, value: Any):
        self._filters.append(f"{column}=eq.{value}")
        return self
    
    def ilike(self, column: str, value: str):
        self._filters.append(f"{column}=ilike.{value}")
        return self
    
    def limit(self, count: int):
        self._limit_value = count
        return self
    
    def order(self, column: str, desc: bool = False):
        direction = "desc" if desc else "asc"
        self._order_by = f"{column}.{direction}"
        return self
    
    def execute(self):
        # Build query parameters
        params = {}
        
        if self._select_fields != "*":
            params['select'] = self._select_fields
            
        if self._filters:
            for filter_str in self._filters:
                key, value = filter_str.split('=', 1)
                params[key] = value
        
        if self._limit_value:
            params['limit'] = str(self._limit_value)
        
        if self._order_by:
            params['order'] = self._order_by
        
        try:
            response = requests.get(self.url, headers=self.headers, params=params)
            
            if response.status_code == 200:
                return SimpleResponse(response.json(), None)
            else:
                error_msg = f"Supabase request failed: {response.status_code} - {response.text}"
                return SimpleResponse(None, error_msg)
                
        except requests.RequestException as e:
            return SimpleResponse(None, str(e))
    
    def insert(self, data: Dict[str, Any]):
        try:
            response = requests.post(self.url, headers=self.headers, json=data)
            
            if response.status_code in [200, 201]:
                return SimpleResponse(response.json(), None)
            else:
                error_msg = f"Supabase insert failed: {response.status_code} - {response.text}"
                return SimpleResponse(None, error_msg)
                
        except requests.RequestException as e:
            return SimpleResponse(None, str(e))
    
    def update(self, data: Dict[str, Any]):
        # Build query for update
        params = {}
        for filter_str in self._filters:
            key, value = filter_str.split('=', 1)
            params[key] = value
        
        try:
            response = requests.patch(self.url, headers=self.headers, params=params, json=data)
            
            if response.status_code == 200:
                return SimpleResponse(response.json(), None)
            else:
                error_msg = f"Supabase update failed: {response.status_code} - {response.text}"
                return SimpleResponse(None, error_msg)
                
        except requests.RequestException as e:
            return SimpleResponse(None, str(e))

class SimpleResponse:
    def __init__(self, data: Optional[List[Dict[str, Any]]], error: Optional[str]):
        self.data = data
        self.error = error

# Global Supabase client instance
supabase_client = SupabaseClient()
