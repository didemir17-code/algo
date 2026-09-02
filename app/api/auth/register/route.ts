import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createAuthToken, AUTH_COOKIE_CONFIG } from '@/lib/auth';
import { INITIAL_BADGES } from '@/lib/data/levels';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, password, grade = 'all', avatar = '🤖', email } = body;

    // Validation
    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı en az 3 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir isim giriniz.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 4 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          ...(email && typeof email === 'string' && email.trim() ? [{ email: email.trim().toLowerCase() }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Bu kullanıcı adı veya e-posta zaten kullanılıyor.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and initial progress in transaction
    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        name: name.trim(),
        email: email && typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null,
        password: hashedPassword,
        grade: typeof grade === 'string' ? grade : 'all',
        avatar: typeof avatar === 'string' ? avatar : '🤖',
        progress: {
          create: {
            solvedLevelIds: [],
            totalStars: 0,
            streak: 0,
            totalAttempts: 0,
            firstTimeCorrect: 0,
            badgesJson: JSON.stringify(INITIAL_BADGES),
            currentGrade: typeof grade === 'string' ? grade : 'all',
            currentCategory: 'all',
          },
        },
      },
      include: {
        progress: true,
      },
    });

    // Create JWT
    const token = await createAuthToken({
      userId: newUser.id,
      username: newUser.username,
    });

    const userStats = newUser.progress
      ? {
          solvedLevelIds: newUser.progress.solvedLevelIds,
          totalStars: newUser.progress.totalStars,
          streak: newUser.progress.streak,
          totalAttempts: newUser.progress.totalAttempts,
          firstTimeCorrect: newUser.progress.firstTimeCorrect,
          badges: JSON.parse(newUser.progress.badgesJson || '[]'),
          currentGrade: newUser.progress.currentGrade as 'all' | '1-2' | '3-4',
          currentCategory: newUser.progress.currentCategory as 'all' | 'sirali' | 'dongu' | 'kosul' | 'hata_ayiklama' | 'robotik',
        }
      : null;

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        grade: newUser.grade,
        avatar: newUser.avatar,
        stats: userStats,
      },
      message: 'Kayıt başarıyla tamamlandı! Hoş geldin, minik kodlayıcı! 🚀',
    });

    // Set HTTP-Only auth cookie
    response.cookies.set(AUTH_COOKIE_CONFIG.name, token, AUTH_COOKIE_CONFIG.options);

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Register API Error:', err);
    return NextResponse.json(
      { success: false, error: 'Kayıt işlemi sırasında bir hata oluştu: ' + err.message },
      { status: 500 }
    );
  }
}
