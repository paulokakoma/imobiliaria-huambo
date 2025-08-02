// src/app/api/localizacoes/provincias/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const provincias = await prisma.provincia.findMany();
    return NextResponse.json(provincias);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar províncias" },
      { status: 500 }
    );
  }
}
