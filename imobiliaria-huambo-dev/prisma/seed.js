// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const huamboData = {
  Huambo: {
    "Município do Huambo": [
      "São João",
      "Aeroporto",
      "Calomanda",
      "Cacilhas",
      "Cazenga",
      "Fátima",
      "Vila Nova",
      "Santo António",
      "Macolocoto",
      "Cangote",
      "Chivela",
      "Kapango",
      "São Pedro",
      "Santo António II",
      "Benfica",
      "Caála Velha",
    ],
    Caála: [
      "Caála-sede",
      "Bairro Novo",
      "Bairro da Estação",
      "Bairro 11 de Novembro",
      "Bairro Azul",
      "Cavongue",
      "Bimbe",
      "Casseque I e II",
      "Utchindji",
      "Cuima",
    ],
    Ekunha: ["Ekunha-sede", "Chicala", "Cassongue", "Londuimbali"],
  },
  // No futuro, pode adicionar outra província aqui. Ex: "Benguela": { ... }
};

async function main() {
  console.log("A iniciar o processo de seeding...");

  // --- A GRANDE MELHORIA ESTÁ AQUI ---
  // Limpa as tabelas na ordem inversa para respeitar as relações
  // (não se pode apagar um município se ainda houver bairros ligados a ele)
  await prisma.bairro.deleteMany({});
  await prisma.municipio.deleteMany({});
  await prisma.provincia.deleteMany({});
  console.log("Tabelas de localização limpas com sucesso.");
  // ------------------------------------

  for (const nomeProvincia in huamboData) {
    const provincia = await prisma.provincia.create({
      data: { nome: nomeProvincia },
    });
    console.log(`Província criada: ${provincia.nome}`);

    for (const nomeMunicipio in huamboData[nomeProvincia]) {
      const municipio = await prisma.municipio.create({
        data: {
          nome: nomeMunicipio,
          provinciaId: provincia.id,
        },
      });
      console.log(`  Município criado: ${municipio.nome}`);

      for (const nomeBairro of huamboData[nomeProvincia][nomeMunicipio]) {
        await prisma.bairro.create({
          data: {
            nome: nomeBairro,
            municipioId: municipio.id,
          },
        });
      }
      console.log(`    ✓ Bairros para ${nomeMunicipio} criados.`);
    }
  }
  console.log("Seeding concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
