#!/bin/bash

echo "🚀 Setting up Wren AI for TBWA Scout Dashboard"
echo "============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your API keys!"
fi

# Start Wren AI services
echo "🐳 Starting Wren AI services..."
docker-compose -f docker-compose.wren.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.wren.yml ps

echo ""
echo "✅ Wren AI setup complete!"
echo ""
echo "📌 Service URLs:"
echo "   - Wren UI: http://localhost:3001"
echo "   - Wren Engine API: http://localhost:4000"
echo "   - API Docs: http://localhost:4000/api/docs"
echo ""
echo "🔧 Next steps:"
echo "1. Update .env.local with your OpenAI API key"
echo "2. Configure your Postgres/Supabase connection in Wren UI"
echo "3. Run 'npm run dev' to start the Scout Dashboard"
echo ""
echo "📚 For more info, see: https://docs.getwren.ai"