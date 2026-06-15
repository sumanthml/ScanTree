from db.client import engine
from sqlalchemy import text

def migrate():
    with engine.begin() as conn:
        print("Adding profile_id column to scan_jobs table...")
        conn.execute(text("""
            ALTER TABLE scan_jobs 
            ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
        """))
        print("Migration complete!")

if __name__ == "__main__":
    migrate()
