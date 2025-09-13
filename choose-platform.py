#!/usr/bin/env python3
"""
Platform Selection Script for PMIP Deployment
Helps choose between Vercel and Render deployment
"""

import os
import shutil
from pathlib import Path

def show_platform_info():
    """Display information about both platforms"""
    print("🚀 PMIP Deployment Platform Selection")
    print("=" * 50)
    print()
    
    print("📊 Platform Comparison:")
    print("┌─────────────┬─────────────────┬─────────────────┐")
    print("│ Feature     │ Render          │ Vercel          │")
    print("├─────────────┼─────────────────┼─────────────────┤")
    print("│ Backend     │ Web Service     │ Serverless      │")
    print("│ Frontend    │ Static Site     │ Static Site     │")
    print("│ Database    │ PostgreSQL      │ PostgreSQL      │")
    print("│ Pricing     │ Free tier       │ Free tier       │")
    print("│ Setup       │ Simple          │ Simple          │")
    print("│ Scaling     │ Manual          │ Automatic       │")
    print("│ Best For    │ Full-stack      │ Serverless      │")
    print("└─────────────┴─────────────────┴─────────────────┘")
    print()

def check_existing_files():
    """Check which platform files exist"""
    vercel_files = [
        'vercel.json',
        'api/index.py',
        'VERCEL_DEPLOYMENT_GUIDE.md'
    ]
    
    render_files = [
        'render.yaml',
        'render-simple.yaml',
        'Procfile',
        'RENDER_TROUBLESHOOTING.md'
    ]
    
    vercel_exists = all(Path(f).exists() for f in vercel_files)
    render_exists = all(Path(f).exists() for f in render_files)
    
    print("📁 Current Platform Files:")
    print(f"Vercel files: {'✅ Present' if vercel_exists else '❌ Missing'}")
    print(f"Render files: {'✅ Present' if render_exists else '❌ Missing'}")
    print()
    
    return vercel_exists, render_exists

def cleanup_platform_files(platform):
    """Remove files for the opposite platform"""
    if platform == 'render':
        files_to_remove = [
            'vercel.json',
            'api/index.py',
            'VERCEL_DEPLOYMENT_GUIDE.md'
        ]
        print("🧹 Cleaning up Vercel files...")
    else:
        files_to_remove = [
            'render.yaml',
            'render-simple.yaml',
            'Procfile',
            'RENDER_TROUBLESHOOTING.md'
        ]
        print("🧹 Cleaning up Render files...")
    
    for file in files_to_remove:
        if Path(file).exists():
            if Path(file).is_file():
                os.remove(file)
                print(f"  ✅ Removed {file}")
            elif Path(file).is_dir():
                shutil.rmtree(file)
                print(f"  ✅ Removed directory {file}")
        else:
            print(f"  ⚠️  {file} not found")

def show_deployment_instructions(platform):
    """Show deployment instructions for chosen platform"""
    print(f"\n🎯 {platform.upper()} Deployment Instructions:")
    print("=" * 40)
    
    if platform == 'render':
        print("1. Go to https://render.com")
        print("2. Create new Web Service")
        print("3. Connect to GitHub repository")
        print("4. Use render.yaml configuration")
        print("5. Set environment variables:")
        print("   - SUPABASE_URL")
        print("   - SUPABASE_KEY")
        print("   - SUPABASE_SERVICE_KEY")
        print("   - GEMINI_API_KEY")
        print("   - JWT_SECRET_KEY")
        print("6. Deploy!")
        print("\n📖 See RENDER_TROUBLESHOOTING.md for detailed instructions")
    else:
        print("1. Go to https://vercel.com")
        print("2. Create new project")
        print("3. Connect to GitHub repository")
        print("4. Use vercel.json configuration")
        print("5. Set environment variables in Vercel dashboard")
        print("6. Deploy!")
        print("\n📖 See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions")

def main():
    """Main function"""
    show_platform_info()
    vercel_exists, render_exists = check_existing_files()
    
    if vercel_exists and render_exists:
        print("⚠️  Both Vercel and Render files detected!")
        print("This can cause conflicts during deployment.")
        print()
    
    print("Choose your deployment platform:")
    print("1. Render (Recommended for full-stack)")
    print("2. Vercel (Recommended for serverless)")
    print("3. Keep both (Not recommended)")
    print()
    
    while True:
        choice = input("Enter your choice (1-3): ").strip()
        
        if choice == '1':
            print("\n✅ Selected: Render")
            cleanup_platform_files('vercel')
            show_deployment_instructions('render')
            break
        elif choice == '2':
            print("\n✅ Selected: Vercel")
            cleanup_platform_files('render')
            show_deployment_instructions('vercel')
            break
        elif choice == '3':
            print("\n⚠️  Keeping both platforms")
            print("Make sure to deploy to only one platform at a time!")
            print("See DEPLOYMENT_PLATFORM_GUIDE.md for more information")
            break
        else:
            print("❌ Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
