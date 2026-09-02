import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// System prompt tailored for elementary school students (Grades 1-4, ages 7-10)
const ROBI_SYSTEM_INSTRUCTION = `
Sen "Robot Robi", ilkokul 1-4. sınıf (7-10 yaş) öğrencilerine kodlama, algoritmik düşünme, sıralı mantık, döngüler ve koşulları öğreten sevimli, neşeli, arkadaş canlısı ve zeki bir yapay zeka kodlama arkadaşısın.

Önemli Pedagojik İlkelerin:
1. Dil ve Üslup: Çok sıcak, teşvik edici, merak uyandırıcı, pozitif ve akıcı bir Türkçe kullan. Çocuğa "Harika bir kodlayıcısın!", "Süper bir soru!", "Gel birlikte keşfedelim!" gibi motive edici cümlelerle hitap et.
2. Somut ve Günlük Hayat Benzetmeleri: Asla karmaşık, soyut veya sıkıcı teknik jargona boğma. Her zaman çocukların bildiği günlük hayat örneklerini kullan (Örn: Sandviç hazırlama algoritması, diş fırçalama adımları, yorulmadan 5 kere zıplama döngüsü, yağmur yağarsa şemsiye açma koşulu, lego parçaları).
3. Kısa ve Okunaklı: Yanıtları gereksiz uzun tutma. İlkokul çocuklarının rahatça okuyabileceği 2-3 kısa paragraf veya sevimli maddeler halinde düzenle.
4. Emojiler: Bolca eğlenceli ve renkli emoji kullan (🤖, 🌟, 🚀, 💡, 🧩, 🎈, 🐱, 🎮, 🧁).
5. Eğlence ve Bilmeceler: Eğer öğrenci bilmece, mini oyun ya da soru sorulmasını isterse, sevimli mini kodlama bilmeceleri veya "Bu adımların sırası ne olmalı?" gibi eğlenceli sorular sor.
`.trim();

export async function POST(req: NextRequest) {
  try {
    // API anahtarı kesinlikle sunucu tarafındaki process.env üzerinden okunur (NEXT_PUBLIC_ kullanılmaz)
    const apiKey = process.env.GEMINI_API_KEY;

    // API anahtarı tanımlanmamışsa istemciye bilgilendirici ve güvenli bir mesaj dön
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_API_KEY bulunamadı. Lütfen .env.local dosyasına GEMINI_API_KEY tanımlayınız.',
          text: '🤖 Bip bup! Merhaba minik kodlayıcı! Benimle canlı konuşabilmek için sunucu tarafında GEMINI_API_KEY anahtarının tanımlı olması gerekiyor. Lütfen .env.local dosyana GEMINI_API_KEY anahtarını ekle! 🚀',
        },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { message, messages, prompt } = body;

    const userMessage =
      message ||
      prompt ||
      (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : '');

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz veya boş mesaj içeriği.',
        },
        { status: 400 }
      );
    }

    // Google Gen AI SDK'sı yalnızca sunucu tarafında başlatılır
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Sohbet geçmişini formatla
    let contentsPayload: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      contentsPayload = messages
        .filter((m: { content?: string }) => m && typeof m.content === 'string' && m.content.trim().length > 0)
        .map((m: { role?: string; content: string }) => ({
          role: m.role === 'assistant' || m.role === 'model' ? ('model' as const) : ('user' as const),
          parts: [{ text: m.content }],
        }));
    } else {
      contentsPayload = [
        {
          role: 'user',
          parts: [{ text: userMessage.trim() }],
        },
      ];
    }

    // Sunucu tarafında Gemini çağrısını gerçekleştir (model fallback desteğiyle)
    const preferredModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const candidateModels = [
      preferredModel,
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
    ].filter((v, i, a) => a.indexOf(v) === i);

    let replyText = '';
    let lastError: Error | null = null;

    for (const modelToTry of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelToTry,
          contents: contentsPayload,
          config: {
            systemInstruction: ROBI_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (tryErr: unknown) {
        lastError = tryErr as Error;
        console.warn(`Model ${modelToTry} failed, trying next fallback...`, tryErr);
      }
    }

    if (!replyText) {
      throw lastError || new Error('Yapay zeka yanıt üretemedi.');
    }

    return NextResponse.json({
      success: true,
      text: replyText,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Gemini API Error in /api/chat:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Yapay zeka yanıtı alınırken bir hata oluştu.',
        text: '🤖 Bip bip... Devrelerimde küçük bir karışıklık oldu ama hiç merak etme! Bana tekrar bir soru sormayı dener misin? 🌟',
      },
      { status: 500 }
    );
  }
}
