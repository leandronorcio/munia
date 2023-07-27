/**
 * GET /api/users/:userId/feed
 * - Allows an authenticated user to retrieve the most recent posts
 * posted by the user and their followers.
 */

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {}
