// fetchData.js
import { scrapeSilverNY, scrapeSilverLondon, scrapeSilverShanghai, scrapeGoldNY, scrapeFX_USD_RMB } from "./scrapeChinaFX.js";
import { initDB, insertData } from "./db.js";

export async function fetchAndStore() {
  const db = await initDB();

  // Scraping réel
  const silverNY = await scrapeSilverNY();
  const silverLondon = await scrapeSilverLondon();
  const silverSHA_RMB = await scrapeSilverShanghai();
  const goldNY = await scrapeGoldNY();
  const FX_USD_RMB = await scrapeFX_USD_RMB();

  // Vérification
  if (
    silverNY == null ||
    silverLondon == null ||
    silverSHA_RMB == null ||
    goldNY == null ||
    FX_USD_RMB == null
  ) {
    console.error("Initial fetch failed: Missing scraped data");
    await db.close();
    throw new Error("Missing scraped data");
  }

  // Conversion Silver SHA kg → oz
  const silverSHA = silverSHA_RMB * FX_USD_RMB / 31.1035;

  // Calcul ratios et spreads
  const goldSilverRatio = goldNY / silverNY;
  const spreadSHA_NY = ((silverSHA - silverNY) / silverNY) * 100;

  // Préparer l'objet de données correspondant aux colonnes SQLite
  const data = {
    timestamp: new Date().toISOString(),
    silverNY,
    silverLondon,
    silverSHA,
    goldNY,
    FX_USD_RMB,
    goldSilverRatio,
    spreadSHA_NY
  };

  await insertData(db, data);
  console.log("Data stored:", data);

  await db.close();
  return data;
}
