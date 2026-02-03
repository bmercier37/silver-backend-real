// fetchData.js
import { scrapeSilverNY, scrapeSilverLondon, scrapeSilverShanghai, scrapeSilverIN, scrapeSilverDE, scrapeGoldNY, scrapeFXRateUSDRMB, scrapeFXRateUSDEUR, scrapeFXRateUSDINR } from "./scrapeChinaFX.js";
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

const silverIN_INR = await scrapeSilverIN();
if (silverIN_INR == null) console.warn("⚠️ Scraping failed: Silver India (INR)");

const silverDE_EUR = await scrapeSilverDE();
if (silverDE_EUR == null) console.warn("⚠️ Scraping failed: Silver DE (EUR)");

const goldNY = await scrapeGoldNY();
if (goldNY == null) console.warn("⚠️ Scraping failed: Gold NY");

const FX_USD_RMB = await scrapeFXRateUSDRMB();
if (FX_USD_RMB == null) console.warn("⚠️ Scraping failed: FX USD/CNY");

const FX_USD_EUR = await scrapeFXRateUSDEUR();
if (FX_USD_EUR == null) console.warn("⚠️ Scraping failed: FX USD/EUR");

const FX_USD_INR = await scrapeFXRateUSDINR();
if (FX_USD_INR == null) console.warn("⚠️ Scraping failed: FX USD/INR");
  

  // Conversion Silver SHA kg → oz & RMB →USD 
  const silverSHA = silverSHA_RMB * FX_USD_RMB * 31.1035 / 1000;

  // Conversion Silver DE EUR →USD 
  const silverDE = silverDE_EUR * FX_USD_EUR;

  // Conversion Silver INR g→oz & INR →USD 
  const silverIN = silverIN_INR * FX_USD_INR * 31.1035 ;

  // Calcul ratios et spreads
  const goldSilverRatio = goldNY / silverNY;
  const spreadSHA_NY = ((silverSHA - silverNY) / silverNY) * 100;
  const spreadDE_NY = ((silverDE - silverNY) / silverNY) * 100;
  const spreadIN_NY = ((silverIN - silverNY) / silverNY) * 100;

  // Préparer l'objet de données correspondant aux colonnes SQLite
  const data = {
    timestamp: new Date().toISOString(),
    silverNY,
    silverLondon,
    silverSHA,
    silverDE,
    silverIN,
    goldNY,
    FX_USD_RMB,
    FX_USD_EUR,
    FX_USD_EUR,
    goldSilverRatio,
    spreadSHA_NY,
    spreadDE_NY,
    spreadIN_NY
  };

  await insertData(db, data);
  console.log("Data stored:", data);

  //await db.close();
  return data;
}
