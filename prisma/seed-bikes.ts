import { prisma } from "../lib/prisma";

// One-time seed of the six demo bikes that powered Stage 2's mock
// storefront, now inserted for real so the Prisma-backed storefront has
// matching data to render. IDs are set explicitly (not auto-generated)
// so they match the URLs already tested against, e.g. /bikes/bike_sprout_k16.
//
// Safe to re-run: each bike is upserted by id, so running this twice
// updates the bike's own fields again but won't create duplicate bikes.
// (It also won't re-create images/variants on a second run, since those
// only happen in the initial "create" branch of the upsert -- fine for a
// one-time seed, not meant to be a full sync tool.)
//
// Run with: npx tsx prisma/seed-bikes.ts

const BIKES = [
  {
    id: "bike_savanna_rl2",
    name: "Savanna RL2",
    brand: "Ridgeback",
    category: "ROAD" as const,
    condition: "NEW" as const,
    basePrice: 128000,
    description:
      "A light aluminium road frame built for tarmac between towns - quick off the line, stable on long straights, and forgiving enough for a first serious road bike.",
    specs: {
      frameMaterial: "Aluminium 6061",
      gears: "2x9 Shimano Sora",
      brakeType: "Mechanical disc",
      wheelSize: "700c",
      weightKg: 10.4,
    },
    images: [
      { id: "img1", url: "/bikes/road-1.svg", altText: "Savanna RL2 road bike, side profile", position: 0 },
      { id: "img2", url: "/bikes/road-2.svg", altText: "Savanna RL2, drivetrain detail", position: 1 },
    ],
    variants: [
      { id: "v1", size: "S", color: "Matte Black", sku: "SAV-RL2-S-BLK", priceAdjustment: 0, stockQuantity: 3 },
      { id: "v2", size: "M", color: "Matte Black", sku: "SAV-RL2-M-BLK", priceAdjustment: 0, stockQuantity: 5 },
      { id: "v3", size: "M", color: "Murram Red", sku: "SAV-RL2-M-RED", priceAdjustment: 2000, stockQuantity: 0 },
      { id: "v4", size: "L", color: "Matte Black", sku: "SAV-RL2-L-BLK", priceAdjustment: 0, stockQuantity: 2 },
    ],
  },
  {
    id: "bike_highland_mt3",
    name: "Highland MT3",
    brand: "Ridgeback",
    category: "MOUNTAIN" as const,
    condition: "NEW" as const,
    basePrice: 156000,
    description:
      "Front-suspension hardtail set up for red-murram trails and rocky fire roads - wide-range gearing for climbs, hydraulic discs for the descents back down.",
    specs: {
      frameMaterial: "Aluminium 6061",
      gears: "1x11 Shimano Deore",
      brakeType: "Hydraulic disc",
      wheelSize: '29"',
      suspension: "120mm front travel",
      weightKg: 13.1,
    },
    images: [
      { id: "img3", url: "/bikes/mtb-1.svg", altText: "Highland MT3 mountain bike, three-quarter view", position: 0 },
    ],
    variants: [
      { id: "v5", size: "M", color: "Highland Green", sku: "HGL-MT3-M-GRN", priceAdjustment: 0, stockQuantity: 4 },
      { id: "v6", size: "L", color: "Highland Green", sku: "HGL-MT3-L-GRN", priceAdjustment: 0, stockQuantity: 1 },
    ],
  },
  {
    id: "bike_towncraft_hb1",
    name: "Towncraft HB1",
    brand: "Ridgeback",
    category: "HYBRID" as const,
    condition: "USED" as const,
    basePrice: 54000,
    description:
      "A previous-owner commuter hybrid, serviced and re-cabled in-shop. Upright riding position, rack mounts fitted, good for tarmac and hardpack alike.",
    specs: {
      frameMaterial: "Steel",
      gears: "3x7 Shimano Tourney",
      brakeType: "V-brake",
      wheelSize: "700c",
      weightKg: 12.8,
    },
    images: [
      { id: "img4", url: "/bikes/hybrid-1.svg", altText: "Towncraft HB1 hybrid bike", position: 0 },
    ],
    variants: [
      { id: "v7", size: "M", color: "Graphite", sku: "TWN-HB1-M-GRA", priceAdjustment: 0, stockQuantity: 1 },
    ],
  },
  {
    id: "bike_current_e5",
    name: "Current E5",
    brand: "Ridgeback",
    category: "E_BIKE" as const,
    condition: "NEW" as const,
    basePrice: 285000,
    description:
      "A 250W mid-drive e-bike built for longer commutes and hilly routes - three assist levels, a removable battery you can charge at a desk, and rack mounts front and rear.",
    specs: {
      frameMaterial: "Aluminium 6061",
      gears: "1x8 Shimano Altus",
      brakeType: "Hydraulic disc",
      wheelSize: "700c",
      weightKg: 21.5,
    },
    images: [
      { id: "img5", url: "/bikes/ebike-1.svg", altText: "Current E5 electric bike", position: 0 },
      { id: "img6", url: "/bikes/ebike-2.svg", altText: "Current E5, battery and display detail", position: 1 },
    ],
    variants: [
      { id: "v8", size: "M", color: "Slate", sku: "CUR-E5-M-SLT", priceAdjustment: 0, stockQuantity: 2 },
      { id: "v9", size: "L", color: "Slate", sku: "CUR-E5-L-SLT", priceAdjustment: 0, stockQuantity: 2 },
    ],
  },
  {
    id: "bike_sprout_k16",
    name: "Sprout K16",
    brand: "Ridgeback",
    category: "KIDS" as const,
    condition: "NEW" as const,
    basePrice: 21000,
    description:
      "A 16-inch kids bike with training wheels included and a low standover height, so it can be sized up as a first pedal bike or down as a starter with stabilisers on.",
    specs: {
      frameMaterial: "Steel",
      gears: "Single speed",
      brakeType: "Coaster + hand brake",
      wheelSize: '16"',
      weightKg: 8.2,
    },
    images: [
      { id: "img7", url: "/bikes/kids-1.svg", altText: "Sprout K16 kids bike", position: 0 },
    ],
    variants: [
      { id: "v10", size: '16"', color: "Highland Green", sku: "SPR-K16-GRN", priceAdjustment: 0, stockQuantity: 6 },
      { id: "v11", size: '16"', color: "Murram Red", sku: "SPR-K16-RED", priceAdjustment: 0, stockQuantity: 4 },
    ],
  },
  {
    id: "bike_savanna_rl1",
    name: "Savanna RL1",
    brand: "Ridgeback",
    category: "ROAD" as const,
    condition: "USED" as const,
    basePrice: 79000,
    description:
      "The previous-generation Savanna, traded in and fully serviced - same aluminium frame, a slightly heavier stock groupset, and a lower price for it.",
    specs: {
      frameMaterial: "Aluminium 6061",
      gears: "2x8 Shimano Claris",
      brakeType: "Rim brake",
      wheelSize: "700c",
      weightKg: 10.9,
    },
    images: [
      { id: "img8", url: "/bikes/road-3.svg", altText: "Savanna RL1 road bike, used condition", position: 0 },
    ],
    variants: [
      { id: "v12", size: "M", color: "Matte Black", sku: "SAV-RL1-M-BLK", priceAdjustment: 0, stockQuantity: 1 },
    ],
  },
];

async function main() {
  for (const bike of BIKES) {
    const { images, variants, ...bikeFields } = bike;

    await prisma.bike.upsert({
      where: { id: bike.id },
      create: {
        ...bikeFields,
        images: { create: images },
        variants: { create: variants },
      },
      update: {
        ...bikeFields,
      },
    });

    console.log(`Seeded: ${bike.name}`);
  }

  console.log(`\nDone -- ${BIKES.length} bikes seeded.`);
}

main()
  .catch((err) => {
    console.error("Bike seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));