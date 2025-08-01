// src/app/api/localizacoes/municipios/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const provinciaId = searchParams.get("provinciaId");

  if (!provinciaId) {
    return NextResponse.json(
      { error: "ID da província é obrigatório" },
      { status: 400 }
    );
  }
  try {
    const municipios = await prisma.municipio.findMany({
      where: { provinciaId: provinciaId },
    });
    return NextResponse.json(municipios);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar municípios" },
      { status: 500 }
    );
  }
}
