const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const listings = Array.from({ length: 25 }, (_, index) => {
    const projectNames = [
      'Sunrise Residences',
      'Olive Gardens',
      'Metro Lofts',
      'Riverbank Towers',
      'Urban Studios',
      'Cedar Heights',
      'Harbor Lights',
      'Skyline District'
    ]

    const unitNames = [
      'Ain Sokhna View',
      'Garden Corner',
      'City Center Loft',
      'Riverside Suite',
      'Studio Modern',
      'Penthouse Horizon',
      'Terrace Residence',
      'Bay View Home'
    ]

    const project = projectNames[index % projectNames.length]
    const unitName = unitNames[index % unitNames.length]
    const price = (65000 + index * 18500).toFixed(2)

    return {
      unitName: `${unitName} ${index + 1}`,
      unitNumber: `${String.fromCharCode(65 + (index % 6))}-${String(index + 1).padStart(2, '0')}`,
      project,
      price,
      bedrooms: (index % 4) + 1,
      bathrooms: (index % 3) + 1,
      areaSqm: Number((42 + index * 9.5).toFixed(2)),
      description: `Sample apartment ${index + 1} in ${project}. Ideal for pagination testing and listing views.`,
      imageUrl: ''
    }
  })

  console.log('Clearing existing apartments...')
  await prisma.apartment.deleteMany()

  console.log('Seeding apartments:', listings.length)
  await prisma.apartment.createMany({ data: listings })

  console.log('Seeding completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
