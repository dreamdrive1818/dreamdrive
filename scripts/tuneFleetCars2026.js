/**
 * Tweak pricing/names for the 3 cars just added.
 */
const docs = require("../shared/docs");

const UPDATES = {
  S344JRZGZclLV4fkRk5j: {
    name: "Mahindra Thar LXT Diesel Manual 2026",
    price: "5500",
    twentyFourHrWeekday: "6500",
    twentyFourHrWeekend: "7000",
    securityDeposit: "10000",
    details: {
      kilometer: "250",
      extraKm: "18",
      extraHr: "400",
      type: "SUV",
      seats: "4",
      luggage: "2",
      fuel: "Diesel",
      mt: "YES",
    },
  },
  V0habTYVs9goldvOcj44: {
    name: "Maruti Brezza VXI Petrol Manual 2026",
    price: "1800",
    twentyFourHrWeekday: "2500",
    twentyFourHrWeekend: "3000",
    securityDeposit: "5000",
    details: {
      kilometer: "250",
      extraKm: "10",
      extraHr: "200",
      type: "SUV",
      seats: "5",
      luggage: "2",
      fuel: "Petrol",
      mt: "YES",
    },
  },
  UVUV5L9XgzgNEWx0Yn6Q: {
    name: "Maruti Swift Dzire VXI Petrol Manual 2026",
    price: "1600",
    twentyFourHrWeekday: "2200",
    twentyFourHrWeekend: "2500",
    securityDeposit: "5000",
    details: {
      kilometer: "250",
      extraKm: "10",
      extraHr: "180",
      type: "Sedan",
      seats: "5",
      luggage: "3",
      fuel: "Petrol",
      mt: "YES",
    },
  },
};

async function main() {
  // Copy security deposit / km rates from similar existing cars when present
  const existing = await docs.listCollection("cars");
  const oldThar = existing.find((c) => c.name === "Mahindra Thar");
  const oldBrezza = existing.find((c) => /Vitara Brezza/i.test(c.name));
  const aura = existing.find((c) => /Aura/i.test(c.name));

  if (oldThar?.securityDeposit) {
    UPDATES.S344JRZGZclLV4fkRk5j.securityDeposit = oldThar.securityDeposit;
  }
  if (oldThar?.details) {
    UPDATES.S344JRZGZclLV4fkRk5j.details = {
      ...UPDATES.S344JRZGZclLV4fkRk5j.details,
      kilometer: oldThar.details.kilometer || UPDATES.S344JRZGZclLV4fkRk5j.details.kilometer,
      extraKm: oldThar.details.extraKm || UPDATES.S344JRZGZclLV4fkRk5j.details.extraKm,
      extraHr: oldThar.details.extraHr || UPDATES.S344JRZGZclLV4fkRk5j.details.extraHr,
    };
  }
  if (oldBrezza?.securityDeposit) {
    UPDATES.V0habTYVs9goldvOcj44.securityDeposit = oldBrezza.securityDeposit;
  }
  if (oldBrezza?.details) {
    UPDATES.V0habTYVs9goldvOcj44.details = {
      ...UPDATES.V0habTYVs9goldvOcj44.details,
      kilometer: oldBrezza.details.kilometer || "250",
      extraKm: oldBrezza.details.extraKm || "10",
      extraHr: oldBrezza.details.extraHr || "200",
    };
  }
  if (aura?.securityDeposit) {
    UPDATES.UVUV5L9XgzgNEWx0Yn6Q.securityDeposit = aura.securityDeposit;
  }

  for (const [id, data] of Object.entries(UPDATES)) {
    const updated = await docs.updateDoc("cars", id, data);
    console.log(
      `Updated ${updated.name}: ₹${updated.price} | 24h ₹${updated.twentyFourHrWeekday}/${updated.twentyFourHrWeekend}`
    );
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
