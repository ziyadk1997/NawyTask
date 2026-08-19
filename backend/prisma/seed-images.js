const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const images = [
    { unitName: 'Ain Sokhna View', imageUrl: 'https://picsum.photos/seed/ain-sokhna/1200/800' },
    { unitName: 'Garden Corner', imageUrl: 'https://picsum.photos/seed/garden-corner/1200/800' },
    { unitName: 'City Center Loft', imageUrl: 'https://picsum.photos/seed/city-loft/1200/800' },
    { unitName: 'Riverside Suite', imageUrl: 'https://picsum.photos/seed/riverside/1200/800' },
    { unitName: 'Studio Modern', imageUrl: 'https://picsum.photos/seed/studio-modern/1200/800' }
  ]

  for (const item of images) {
    // seed.js appends an index to each base name ("Ain Sokhna View 1", "...9", ...),
    // so an exact match here never hits anything - match by prefix instead.
    const res = await prisma.apartment.updateMany({
      where: { unitName: { startsWith: item.unitName } },
      data: { imageUrl: item.imageUrl }
    })
    console.log(`Updated ${item.unitName}*: ${res.count} rows`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
