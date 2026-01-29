// scrapeChinaFX.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";

/**
 * Scrape Silver NY price from ChinaFXTools
 * Retourne un nombre en USD par once
 */
export async function scrapeSilverNY() {
  try {
    // URL de la page Silver NY
    const url = "https://www.chinafxtools.com/silver/newyork/";

    // Récupère le HTML de la page
    const res = await fetch(url);
    const html = await res.text();

    // Charge le HTML dans Cheerio
    const $ = cheerio.load(html);

    // Cherche le prix dans la page
    // ⚠️ Sélecteur CSS à ajuster selon le vrai HTML
    // Ici on prend la valeur qui est dans <span class="price text-danger">119.314</span>
    const priceText = $(".silver-price-box .current-price .price").first().text();

    if (!priceText) {
      throw new Error("Silver NY price not found");
    }

    // Convertit en nombre
    const price = parseFloat(priceText.replace(/,/g, ""));
    return price;
  } catch (err) {
    console.error("Fetch error:", err.message);
    throw err;
  }
}

/**
 * Pour l'instant, les autres fonctions restent fake
 */





export async function scrapeSilverLondon() {
  return 118 + Math.random() * 3;
}

export async function scrapeSilverShanghai() {
  return 30000 + Math.random() * 500; // RMB/kg
}

export async function scrapeSilverIndia() {
  return 1000 + Math.random() * 50; // INR/oz
}

export async function scrapeGoldNY() {
  return 2000 + Math.random() * 20;
}
