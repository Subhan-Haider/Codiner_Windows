import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('github_access_token')?.value
    const userData = cookieStore.get('github_user')?.value

    if (!accessToken || !userData) {
      return NextResponse.json(
        { error: 'Not authenticated with GitHub' },
        { status: 401 }
      )
    }

    // Parse stored user data
    const user = JSON.parse(userData)

    return NextResponse.json({
      authenticated: true,
      user: user,
      accessToken: accessToken // Only return in development
    })

  } catch (error) {
    console.error('GitHub user fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
