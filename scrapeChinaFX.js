// scrapeChinaFX.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";

/* =========================
   SILVER – NEW YORK
========================= */
export async function scrapeSilverNY() {
  try {
    const url = "https://www.chinafxtools.com/silver/newyork/";
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const priceText = $(".current-price-large .price span")
      .eq(1)
      .text()
      .trim();

    const value = parseFloat(priceText.replace(/,/g, ""));
    if (isNaN(value)) throw new Error("NY silver not found");
    return value;
  } catch (err) {
    console.error("NY silver error");
    return null;
  }
}

/* =========================
   SILVER – LONDON
========================= */
export async function scrapeSilverLondon() {
  try {
    const url = "https://www.chinafxtools.com/silver/london/";
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const priceText = $(".current-price-large .price span")
      .eq(1)
      .text()
      .trim();

    const value = parseFloat(priceText.replace(/,/g, ""));
    if (isNaN(value)) throw new Error("London silver not found");
    return value;
  } catch (err) {
    console.error("London silver error");
    return null;
  }
}

/* =========================
   SILVER – SHANGHAI (RMB/kg)
========================= */
export async function scrapeSilverShanghai() {
  try {
    const url = "https://www.chinafxtools.com/silver/shanghai/";
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const priceText = $(".current-price-large .price span")
      .eq(1)
      .text()
      .trim();

    const value = parseFloat(priceText.replace(/,/g, ""));
    if (isNaN(value)) throw new Error("Shanghai silver not found");
    return value;
  } catch (err) {
    console.error("Shanghai silver error");
    return null;
  }
}

/* =========================
   GOLD – NEW YORK
========================= */
export async function scrapeGoldNY() {
  try {
    const url = "https://www.chinafxtools.com/gold/newyork/";
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const priceText = $(".current-price-large .price span")
      .eq(1)
      .text()
      .trim();

    const value = parseFloat(priceText.replace(/,/g, ""));
    if (isNaN(value)) throw new Error("Gold NY not found");
    return value;
  } catch (err) {
    console.error("Gold NY error");
    return null;
  }
}

/* =========================
   FX – USD/CNY
========================= */
export async function scrapeFXRateRMBUSD() {
  try {
    const url = "https://themoneyconverter.com/CNY/USD";
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    // Sélectionne le span contenant USD/CNY
    const span = $("span")
      .filter((_, el) => $(el).text().includes("USD/CNY"))
      .first();

    const rawValue = span.attr("data-value");

    if (!rawValue) {
      throw new Error("USD/CNY data-value not found");
    }

    const value = parseFloat(rawValue);

    if (isNaN(value) || value <= 0) {
      throw new Error("Invalid USD/CNY value");
    }
     
    return value;
  } catch (err) {
    console.error("FX USD/CNY error");
    return null;
  }
}

