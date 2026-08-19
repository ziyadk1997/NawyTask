-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "unitName" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "areaSqm" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Apartment_unitName_idx" ON "Apartment"("unitName");

-- CreateIndex
CREATE INDEX "Apartment_unitNumber_idx" ON "Apartment"("unitNumber");

-- CreateIndex
CREATE INDEX "Apartment_project_idx" ON "Apartment"("project");
