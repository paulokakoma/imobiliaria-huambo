// src/app/api/imoveis/listar/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        // Incluímos os dados do bairro e município
        bairro: {
          include: {
            municipio: true,
          },
        },
      },
    });
    return NextResponse.json(imoveis);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar imóveis" },
      { status: 500 }
    );
  }
}
