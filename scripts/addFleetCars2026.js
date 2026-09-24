/**
 * One-off: add 2026 Thar / Brezza / Dzire to Firestore cars collection.
 * Run: node scripts/addFleetCars2026.js
 */
const docs = require("../shared/docs");

const NEW_CARS = [
  {
    name: "Mahindra Thar LXT Diesel Manual 2026",
    price: "",
    salePrice: "",
    available: "Available",
    displayOrder: null,
    images: [
      "https://res.cloudinary.com/df10iqj1i/image/upload/v1710000000/fleet/thar-lxt-diesel-2026.png",
    ],
    twentyFourHrWeekday: "",
    twentyFourHrWeekend: "",
    securityDeposit: "",
    details: {
      kilometer: "",
      extraKm: "",
      extraHr: "",
      type: "SUV",
      seats: "4",
      luggage: "2",
      fuel: "Diesel",
      mt: "YES",
    },
  },
  {
    name: "Maruti Brezza VXI Petrol Manual 2026",
    price: "",
    salePrice: "",
    available: "Available",
    displayOrder: null,
    images: [
      "https://res.cloudinary.com/df10iqj1i/image/upload/v1710000000/fleet/brezza-vxi-petrol-2026.png",
    ],
    twentyFourHrWeekday: "",
    twentyFourHrWeekend: "",
    securityDeposit: "",
    details: {
      kilometer: "",
      extraKm: "",
      extraHr: "",
      type: "SUV",
      seats: "5",
      luggage: "2",
      fuel: "Petrol",
      mt: "YES",
    },
  },
  {
    name: "Maruti Swift Dzire VXI Petrol Manual 2026",
    price: "",
    salePrice: "",
    available: "Available",
    displayOrder: null,
    images: [
      "https://res.cloudinary.com/df10iqj1i/image/upload/v1710000000/fleet/swift-dzire-vxi-2026.png",
    ],
    twentyFourHrWeekday: "",
    twentyFourHrWeekend: "",
    securityDeposit: "",
    details: {
      kilometer: "",
      extraKm: "",
      extraHr: "",
      type: "Sedan",
      seats: "5",
      luggage: "3",
      fuel: "Petrol",
      mt: "YES",
    },
  },
];

function findSimilar(cars, predicates) {
  return cars.find((c) => predicates.every((fn) => fn(c))) || null;
}

function copyPricing(from, target) {
  if (!from) return target;
  return {
    ...target,
    price: from.price ?? target.price,
    salePrice: from.salePrice ?? "",
    twentyFourHrWeekday: from.twentyFourHrWeekday ?? "",
    twentyFourHrWeekend: from.twentyFourHrWeekend ?? "",
    securityDeposit: from.securityDeposit ?? "",
    details: {
      ...target.details,
      kilometer: from.details?.kilometer ?? target.details.kilometer,
      extraKm: from.details?.extraKm ?? target.details.extraKm,
      extraHr: from.details?.extraHr ?? target.details.extraHr,
    },
    images:
      Array.isArray(from.images) && from.images.length
        ? from.images
        : target.images,
  };
}

async function main() {
  const existing = await docs.listCollection("cars");
  console.log(`Existing cars: ${existing.length}`);
  existing
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
    .forEach((c) => {
      console.log(
        `  [${c.displayOrder}] ${c.name} | ₹${c.price} | 24w ₹${c.twentyFourHrWeekday} / ₹${c.twentyFourHrWeekend} | ${c.details?.fuel} ${c.details?.mt}`
      );
    });

  const maxOrder = existing.reduce(
    (m, c) => Math.max(m, Number(c.displayOrder) || 0),
    0
  );

  const nameHit = (re) => (c) => re.test(String(c.name || ""));
  const fuelIs = (f) => (c) =>
    String(c.details?.fuel || "").toLowerCase().includes(f.toLowerCase());

  const tharLike =
    findSimilar(existing, [nameHit(/thar/i)]) ||
    findSimilar(existing, [nameHit(/scorpio|xuv|bolero/i), fuelIs("diesel")]);
  const brezzaLike =
    findSimilar(existing, [nameHit(/brezza|vitara/i)]) ||
    findSimilar(existing, [nameHit(/nexon|venue|sonet|creta/i), fuelIs("petrol")]);
  const dzireLike =
    findSimilar(existing, [nameHit(/dzire|desire|swift/i)]) ||
    findSimilar(existing, [nameHit(/ciaz|amaze|city/i), fuelIs("petrol")]);

  const templates = [tharLike, brezzaLike, dzireLike];
  const payloads = NEW_CARS.map((car, i) => {
    const withPricing = copyPricing(templates[i], car);
    return {
      ...withPricing,
      displayOrder: maxOrder + i + 1,
      // Keep placeholder images only if no similar car image; prefer similar if present
      images:
        templates[i]?.images?.length > 0
          ? templates[i].images
          : withPricing.images,
    };
  });

  // Avoid duplicates by name
  const created = [];
  for (const payload of payloads) {
    const dup = existing.find(
      (c) =>
        String(c.name).toLowerCase().replace(/\s+/g, " ") ===
        payload.name.toLowerCase().replace(/\s+/g, " ")
    );
    if (dup) {
      console.log(`SKIP (exists): ${payload.name} -> ${dup.id}`);
      continue;
    }
    const doc = await docs.addDoc("cars", payload);
    created.push(doc);
    console.log(`ADDED: ${doc.name} (${doc.id}) order=${doc.displayOrder}`);
  }

  console.log(`Done. Added ${created.length} car(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
