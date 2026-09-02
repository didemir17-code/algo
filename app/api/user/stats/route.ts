import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyAuthToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Oturum açılmadı.' }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Geçersiz oturum.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      solvedLevelIds = [],
      totalStars = 0,
      streak = 0,
      totalAttempts = 0,
      firstTimeCorrect = 0,
      badges = [],
      currentGrade = 'all',
      currentCategory = 'all',
    } = body;

    const badgesJson = JSON.stringify(badges);

    const updatedProgress = await prisma.userProgress.upsert({
      where: { userId: payload.userId },
      update: {
        solvedLevelIds: Array.isArray(solvedLevelIds) ? solvedLevelIds : [],
        totalStars: typeof totalStars === 'number' ? totalStars : 0,
        streak: typeof streak === 'number' ? streak : 0,
        totalAttempts: typeof totalAttempts === 'number' ? totalAttempts : 0,
        firstTimeCorrect: typeof firstTimeCorrect === 'number' ? firstTimeCorrect : 0,
        badgesJson,
        currentGrade: typeof currentGrade === 'string' ? currentGrade : 'all',
        currentCategory: typeof currentCategory === 'string' ? currentCategory : 'all',
      },
      create: {
        userId: payload.userId,
        solvedLevelIds: Array.isArray(solvedLevelIds) ? solvedLevelIds : [],
        totalStars: typeof totalStars === 'number' ? totalStars : 0,
        streak: typeof streak === 'number' ? streak : 0,
        totalAttempts: typeof totalAttempts === 'number' ? totalAttempts : 0,
        firstTimeCorrect: typeof firstTimeCorrect === 'number' ? firstTimeCorrect : 0,
        badgesJson,
        currentGrade: typeof currentGrade === 'string' ? currentGrade : 'all',
        currentCategory: typeof currentCategory === 'string' ? currentCategory : 'all',
      },
    });

    return NextResponse.json({
      success: true,
      progress: {
        solvedLevelIds: updatedProgress.solvedLevelIds,
        totalStars: updatedProgress.totalStars,
        streak: updatedProgress.streak,
        totalAttempts: updatedProgress.totalAttempts,
        firstTimeCorrect: updatedProgress.firstTimeCorrect,
        badges: JSON.parse(updatedProgress.badgesJson || '[]'),
        currentGrade: updatedProgress.currentGrade,
        currentCategory: updatedProgress.currentCategory,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Stats Update API Error:', err);
    return NextResponse.json(
      { success: false, error: 'İlerleme kaydedilirken hata oluştu: ' + err.message },
      { status: 500 }
    );
  }
}
