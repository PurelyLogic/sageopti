"""
Supabase client configuration for SAGE
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://trbscszkilqicmgnqfzl.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'sb_secret_7vRDQDof51i27OpCK87hlg_ebGS-01g')

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client() -> Client:
    """Get the Supabase client instance"""
    return supabase
