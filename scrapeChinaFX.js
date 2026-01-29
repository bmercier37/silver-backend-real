// scrapeChinaFX.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";


// Fonction pour scraper le prix New York
export async function scrapeSilverNY() {
    try {
        const url = "https://www.chinafxtools.com/silver/newyork/";
        const html = await fetch(url).then(r => r.text());
        const $ = cheerio.load(html);
        // Prix = deuxième span dans current-price-large .price
        const priceText = $(".current-price-large .price span").eq(1).text().trim();
        const silverNY = parseFloat(priceText.replace(/,/g, ""));
        if (isNaN(silverNY)) throw new Error("Silver NY price not found");
        return silverNY;
    } catch (err) {
        console.error("Fetch error: Silver NY price not found");
        return null;
    }
}

// scrapeChinaFX.js (ajout pour Londres)
export async function scrapeSilverLondon() {
    try {
        const url = "https://www.chinafxtools.com/silver/london/";
        const html = await fetch(url).then(r => r.text());
        const $ = cheerio.load(html);
        // Prix = deuxième span dans current-price-large .price
        const priceText = $(".current-price-large .price span").eq(1).text().trim();
        const silverLondon = parseFloat(priceText.replace(/,/g, ""));
        if (isNaN(silverLondon)) throw new Error("Silver London price not found");
        return silverLondon;
    } catch (err) {
        console.error("Fetch error: Silver London price not found");
        return null;
    }
}

// scrapeChinaFX.js (ajout pour SHA)
export async function scrapeSilverShanghai() {
    try {
        const url = "https://www.chinafxtools.com/silver/shanghai/";
        const html = await fetch(url).then(r => r.text());
        const $ = cheerio.load(html);
        // Prix = deuxième span dans current-price-large .price
        const priceText = $(".current-price-large .price span").eq(1).text().trim();
        const silverLondon = parseFloat(priceText.replace(/,/g, ""));
        if (isNaN(silverShanghai)) throw new Error("Silver SHA price not found");
        return silverShanghai;
    } catch (err) {
        console.error("Fetch error: Silver SHA price not found");
        return null;
    }
}


/**
 * Pour l'instant, les autres fonctions restent fake

export async function scrapeSilverShanghai() {
  return 30000 + Math.random() * 500; // RMB/kg
}
 */

/**
 * Pour l'instant, les autres fonctions restent fake
 */
export async function scrapeSilverIndia() {
  return 1000 + Math.random() * 50; // INR/oz
}

/**
 * Pour l'instant, les autres fonctions restent fake
 */
export async function scrapeGoldNY() {
  return 2000 + Math.random() * 20;
}
