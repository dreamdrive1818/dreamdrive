/**
 * Update 2026 Thar / Brezza / Dzire with provided pricing + full details.
 */
const docs = require("../shared/docs");

const IDS = {
  thar: "S344JRZGZclLV4fkRk5j",
  brezza: "V0habTYVs9goldvOcj44",
  dzire: "UVUV5L9XgzgNEWx0Yn6Q",
};

async function main() {
  const existing = await docs.listCollection("cars");
  const oldThar = existing.find((c) => c.name === "Mahindra Thar");
  const oldBrezza = existing.find((c) => /Vitara Brezza/i.test(c.name));
  const oldSwift = existing.find((c) => /Swift 2025/i.test(c.name));
  const aura = existing.find((c) => /Aura/i.test(c.name));

  const pick = (src, key, fallback) =>
    src?.details?.[key] != null && src.details[key] !== ""
      ? src.details[key]
      : fallback;

  const updates = [
    {
      id: IDS.thar,
      data: {
        name: "Mahindra Thar LXT Diesel Manual 2026",
        // price = current/deal, salePrice = standard (strikethrough when higher)
        price: "5000",
        salePrice: "6000",
        twentyFourHrWeekday: "5000",
        twentyFourHrWeekend: "6000",
        securityDeposit: oldThar?.securityDeposit || "10000",
        available: "Available",
        details: {
          kilometer: pick(oldThar, "kilometer", "250"),
          extraKm: pick(oldThar, "extraKm", "20"),
          extraHr: pick(oldThar, "extraHr", "400"),
          type: "SUV",
          seats: "4",
          luggage: "2",
          fuel: "Diesel",
          mt: "YES",
        },
      },
    },
    {
      id: IDS.brezza,
      data: {
        name: "Maruti Brezza VXI Petrol Manual 2026",
        price: "2500",
        salePrice: "2800",
        twentyFourHrWeekday: "2500",
        twentyFourHrWeekend: "2800",
        securityDeposit: oldBrezza?.securityDeposit || "5000",
        available: "Available",
        details: {
          kilometer: pick(oldBrezza, "kilometer", "250"),
          extraKm: pick(oldBrezza, "extraKm", "12"),
          extraHr: pick(oldBrezza, "extraHr", "200"),
          type: "SUV",
          seats: "5",
          luggage: "2",
          fuel: "Petrol",
          mt: "YES",
        },
      },
    },
    {
      id: IDS.dzire,
      data: {
        name: "Maruti Swift Dzire VXI Petrol Manual 2026",
        price: "2200",
        salePrice: "2500",
        twentyFourHrWeekday: "2200",
        twentyFourHrWeekend: "2500",
        securityDeposit:
          aura?.securityDeposit || oldSwift?.securityDeposit || "5000",
        available: "Available",
        details: {
          kilometer:
            pick(aura, "kilometer", null) ||
            pick(oldSwift, "kilometer", "250"),
          extraKm:
            pick(aura, "extraKm", null) || pick(oldSwift, "extraKm", "10"),
          extraHr:
            pick(aura, "extraHr", null) || pick(oldSwift, "extraHr", "180"),
          type: "Sedan",
          seats: "5",
          luggage: "3",
          fuel: "Petrol",
          mt: "YES",
        },
      },
    },
  ];

  for (const { id, data } of updates) {
    const updated = await docs.updateDoc("cars", id, data);
    console.log(
      `${updated.name}\n  price ₹${updated.price} | sale ₹${updated.salePrice} | 24h ₹${updated.twentyFourHrWeekday}/${updated.twentyFourHrWeekend}\n  deposit ₹${updated.securityDeposit} | ${updated.details.type} ${updated.details.seats} seats | ${updated.details.fuel} Manual | KM ${updated.details.kilometer} | +KM ₹${updated.details.extraKm} | +Hr ₹${updated.details.extraHr}\n`
    );
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
