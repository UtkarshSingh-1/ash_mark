import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// GET /api/addresses/search?q=pincode - Search for address suggestions
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 3) {
      return NextResponse.json({
        suggestions: [],
        message: 'Query must be at least 3 characters'
      })
    }

    // Mock address search - in real app, integrate with postal service API
    const mockSuggestions = [
      {
        pincode: '110001',
        area: 'Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India'
      },
      {
        pincode: '110002',
        area: 'Darya Ganj',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India'
      },
      {
        pincode: '400001',
        area: 'Fort',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      },
      {
        pincode: '560001',
        area: 'Bangalore GPO',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India'
      },
      {
        pincode: '600001',
        area: 'Anna Salai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India'
      }
    ].filter(suggestion => 
      suggestion.pincode.includes(query) ||
      suggestion.area.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.city.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.state.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({
      suggestions: mockSuggestions.slice(0, 5),
      count: mockSuggestions.length
    })
  } catch (error) {
    console.error('Error searching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to search addresses' },
      { status: 500 }
    )
  }
}