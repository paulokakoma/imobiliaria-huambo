import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// FUNÇÃO GET (para pesquisar bairros existentes)
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
          mode: "insensitive",
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

// FUNÇÃO POST (para criar um novo bairro)
export async function POST(request) {
  try {
    const { nome, municipioId } = await request.json();

    if (!nome || !municipioId) {
      return NextResponse.json(
        { error: "Nome e ID do município são obrigatórios" },
        { status: 400 }
      );
    }

    const novoBairro = await prisma.bairro.create({
      data: {
        nome: nome,
        municipioId: municipioId,
      },
    });
    return NextResponse.json(novoBairro, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar bairro:", error);
    return NextResponse.json(
      { error: "Erro ao criar novo bairro" },
      { status: 500 }
    );
  }
}
