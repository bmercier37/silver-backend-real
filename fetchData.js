// fetchData.js
import { scrapeSilverNY, scrapeSilverLondon, scrapeSilverShanghai, scrapeGoldNY, scrapeFXRateRMBUSD } from "./scrapeChinaFX.js";
import { initDB, insertData } from "./db.js";

export async function fetchAndStore() {
  const db = await initDB();

  // Scraping réel
  const silverNY = await scrapeSilverNY();
  const silverLondon = await scrapeSilverLondon();
  const silverSHA_RMB = await scrapeSilverShanghai();
  const goldNY = await scrapeGoldNY();
  const FX_RMB_USD = await scrapeFXRateRMBUSD();// fetchData.js

  
  // Vérification
  if (
    silverNY == null ||
    silverLondon == null ||
    silverSHA_RMB == null ||
    goldNY == null ||
    FX_RMB_USD == null
  ) {
    console.error("Initial fetch failed: Missing scraped data");
    await db.close();
    throw new Error("Missing scraped data");
  }

  // Conversion Silver SHA kg → oz
  const silverSHA = silverSHA_RMB / FX_RMB_USD / 31.1035;

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
    FX_RMB_USD,
    goldSilverRatio,
    spreadSHA_NY
  };

  await insertData(db, data);
  console.log("Data stored:", data);

  await db.close();
  return data;
}
