import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { comparePassword, createAuthToken, AUTH_COOKIE_CONFIG } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Lütfen kullanıcı adı ve şifrenizi giriniz.' },
        { status: 400 }
      );
    }

    const cleanInput = username.trim().toLowerCase();

    // Find user by username or email with retry
    const user = await withDbRetry(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ username: cleanInput }, { email: cleanInput }],
        },
        include: {
          progress: true,
        },
      })
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await createAuthToken({
      userId: user.id,
      username: user.username,
    });

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

    const response = NextResponse.json({
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
      message: `Tekrar hoş geldin, ${user.name}! 🌟`,
    });

    // Set HTTP-Only auth cookie
    response.cookies.set(AUTH_COOKIE_CONFIG.name, token, AUTH_COOKIE_CONFIG.options);

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Login API Error:', err);
    return NextResponse.json(
      { success: false, error: 'Giriş işlemi sırasında bir hata oluştu: ' + err.message },
      { status: 500 }
    );
  }
}
