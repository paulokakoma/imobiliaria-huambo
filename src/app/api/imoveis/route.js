import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const images = formData.getAll("images");
    const data = JSON.parse(formData.get("data"));

    if (!data || images.length === 0) {
      return NextResponse.json(
        { error: "Dados do formulário ou imagens em falta." },
        { status: 400 }
      );
    }

    const imageUrls = [];
    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "imobiliaria_huambo" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
          .end(buffer);
      });
      imageUrls.push(uploadResult.secure_url);
    }

    const novoImovel = await prisma.imovel.create({
      data: {
        titulo: data.title,
        tipo: data.propertyType,
        tipo_anuncio: data.listingType,
        preco: Number(data.price),
        quartos: Number(data.beds),
        casas_banho: Number(data.baths),
        largura: data.width ? Number(data.width) : null,
        comprimento: data.length ? Number(data.length) : null,
        descricao: data.description,
        comodidades: data.amenities,
        image_urls: imageUrls,
        authorId: session.user.id,
        status: "Pendente",
        bairroId: data.bairroId, // A chave correta para a relação
      },
    });

    return NextResponse.json(novoImovel, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro no servidor ao processar o seu pedido." },
      { status: 500 }
    );
  }
}
