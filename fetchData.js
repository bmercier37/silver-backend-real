// fetchData.js
import { scrapeSilverNY, scrapeSilverLondon, scrapeSilverShanghai, scrapeGoldNY, scrapeFXRateRMBUSD } from "./scrapeChinaFX.js";
import { initDB, insertData } from "./db.js";

export async function fetchAndStore() {
  const db = await initDB();

// Scraping réel
const silverNY = await scrapeSilverNY();
if (silverNY == null) console.warn("⚠️ Scraping failed: Silver NY");

const silverLondon = await scrapeSilverLondon();
if (silverLondon == null) console.warn("⚠️ Scraping failed: Silver London");

const silverSHA_RMB = await scrapeSilverShanghai();
if (silverSHA_RMB == null) console.warn("⚠️ Scraping failed: Silver Shanghai (RMB)");

const goldNY = await scrapeGoldNY();
if (goldNY == null) console.warn("⚠️ Scraping failed: Gold NY");

const FX_RMB_USD = await scrapeFXRateRMBUSD();
if (FX_RMB_USD == null) console.warn("⚠️ Scraping failed: FX USD/CNY");



  // Conversion Silver SHA kg → oz
  const silverSHA = silverSHA_RMB * FX_RMB_USD / 31.1035;

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

  //await db.close();
  return data;
}
