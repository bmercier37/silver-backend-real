// fetchData.js
import { scrapeSilverNY, scrapeSilverLondon, scrapeSilverShanghai, scrapeSilverDE, scrapeGoldNY, scrapeFXRateUSDRMB, scrapeFXRateUSDEUR } from "./scrapeChinaFX.js";
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

const silverDE_EUR = await scrapeSilverDE();
if (silverSHA_RMB == null) console.warn("⚠️ Scraping failed: Silver Shanghai (RMB)");

const goldNY = await scrapeGoldNY();
if (goldNY == null) console.warn("⚠️ Scraping failed: Gold NY");

const FX_USD_RMB = await scrapeFXRateUSDRMB();
if (FX_RMB_USD == null) console.warn("⚠️ Scraping failed: FX USD/CNY");

const FX_USD_EUR = await scrapeFXRateUSDEUR();
if (FX_RMB_USD == null) console.warn("⚠️ Scraping failed: FX USD/EUR");


  // Conversion Silver SHA kg → oz & RMB →USD 
  const silverSHA = silverSHA_RMB * FX_USD_RMB / 31.1035;

  // Conversion Silver DE EUR →USD 
  const silverDE = silverDE_EUR * FX_USD_EUR;

  // Calcul ratios et spreads
  const goldSilverRatio = goldNY / silverNY;
  const spreadSHA_NY = ((silverSHA - silverNY) / silverNY) * 100;
  const spreadDE_NY = ((silverDE - silverNY) / silverNY) * 100;


  // Préparer l'objet de données correspondant aux colonnes SQLite
  const data = {
    timestamp: new Date().toISOString(),
    silverNY,
    silverLondon,
    silverSHA,
    silverDE,
    goldNY,
    FX_USD_RMB,
    FX_USD_EUR,
    goldSilverRatio,
    spreadSHA_NY,
    spreadDE_NY
  };

  await insertData(db, data);
  console.log("Data stored:", data);

  //await db.close();
  return data;
}
