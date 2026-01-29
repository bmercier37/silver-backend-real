// fetchData.js
import {
  scrapeSilverNY,
  scrapeSilverLondon,
  scrapeSilverShanghai,
  scrapeGoldNY,
  scrapeFXRateRMBUSD
} from "./scrapeChinaFX.js";

import { initDB, insertData } from "./db.js";

const KG_TO_OZ = 31.1035;

export async function fetchAndStore() {
  const db = await initDB();

  // Scraping réel
  const silverNY = await scrapeSilverNY();                 // USD/oz
  const silverLondon = await scrapeSilverLondon();         // USD/oz
  const silverSHA_RMB = await scrapeSilverShanghai();      // RMB/kg
  const goldNY = await scrapeGoldNY();                     // USD/oz
  const USD_CNY = await scrapeFXRateRMBUSD();              // CNY per USD

  if (!silverNY || !silverLondon || !silverSHA_RMB || !goldNY || !USD_CNY) {
    throw new Error("Missing scraped data");
  }

  // Conversion Shanghai → USD/oz
  const silverSHA = silverSHA_RMB / USD_CNY / KG_TO_OZ;

  // Ratios & spreads
  const goldSilverRatio = goldNY / silverNY;
  const spreadSHA_NY = ((silverSHA - silverNY) / silverNY) * 100;

  const data = {
    timestamp: new Date().toISOString(),
    silverNY,
    silverLondon,
    silverSHA,
    goldNY,
    usdCny: USD_CNY,
    goldSilverRatio,
    spreadSHA_NY
  };

  await insertData(db, data);
  await db.close();

  console.log("Data stored:", data);
  return data;
}
