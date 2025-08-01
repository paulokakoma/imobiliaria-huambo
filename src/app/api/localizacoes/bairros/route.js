// src/app/api/localizacoes/bairros/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const municipioId = searchParams.get("municipioId");
  const query = searchParams.get("query") || "";

  if (!municipioId) {
    return NextResponse.json(
      { error: "ID do município é obrigatório" },
      { status: 400 }
    );
  }
  try {
    const bairros = await prisma.bairro.findMany({
      where: {
        municipioId: municipioId,
        nome: {
          contains: query,
          mode: "insensitive", // Procura sem diferenciar maiúsculas/minúsculas
        },
      },
    });
    return NextResponse.json(bairros);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar bairros" },
      { status: 500 }
    );
  }
}
