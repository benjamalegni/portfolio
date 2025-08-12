import { fetchUserRepos } from "@/lib/github"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usernameParam = searchParams.get("username") || undefined

    const env = (globalThis as any)?.process?.env || {}
    const envUsername = env.GITHUB_USERNAME || env.NEXT_PUBLIC_GITHUB_USERNAME
    const fallbackUsername = "benjamalegni"
    const username = usernameParam || envUsername || fallbackUsername

    const token = env.GITHUB_TOKEN as string | undefined
    const projects = await fetchUserRepos(String(username), token)
    return new Response(JSON.stringify({ username: String(username), projects }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }
} 