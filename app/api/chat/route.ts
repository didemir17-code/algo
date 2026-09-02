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
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if API key is configured
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_API_KEY bulunamadı. Lütfen Ayarlar > Secrets bölümünden GEMINI_API_KEY tanımlayınız.',
          text: '🤖 Bip bup! Merhaba minik kodlayıcı! Benimle canlı konuşabilmek için Gemini API anahtarının tanımlı olması gerekiyor. Öğretmeninle veya yöneticinle görüşüp Settings > Secrets panelinden GEMINI_API_KEY anahtarını ekletebilirsin! 🚀',
        },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { message, messages, prompt } = body;

    const userMessage = message || prompt || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : '');

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz mesaj içeriği.',
        },
        { status: 400 }
      );
    }

    // Initialize the modern @google/genai SDK on the server side only
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Format chat history if provided
    let contentsPayload: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      contentsPayload = messages
        .filter((m: { content?: string }) => m && typeof m.content === 'string' && m.content.trim().length > 0)
        .map((m: { role?: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
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

    // Call Gemini 3.7 Flash server-side
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: ROBI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '🤖 Bip bup! Bu harika bir soru, gel birlikte düşünelim!';

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
