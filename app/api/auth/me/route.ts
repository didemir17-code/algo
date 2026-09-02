import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { getTokenFromRequest, verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: true, user: null });
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ success: true, user: null });
    }

    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          progress: true,
        },
      })
    );

    if (!user) {
      return NextResponse.json({ success: true, user: null });
    }

    const userStats = user.progress
      ? {
          solvedLevelIds: user.progress.solvedLevelIds,
          totalStars: user.progress.totalStars,
          streak: user.progress.streak,
          totalAttempts: user.progress.totalAttempts,
          firstTimeCorrect: user.progress.firstTimeCorrect,
          badges: JSON.parse(user.progress.badgesJson || '[]'),
          currentGrade: user.progress.currentGrade as 'all' | '1-2' | '3-4',
          currentCategory: user.progress.currentCategory as 'all' | 'sirali' | 'dongu' | 'kosul' | 'hata_ayiklama' | 'robotik',
        }
      : null;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        grade: user.grade,
        avatar: user.avatar,
        stats: userStats,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Me API Error:', err);
    return NextResponse.json({ success: true, user: null });
  }
}
