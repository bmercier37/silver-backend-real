// scrapeChinaFX.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";


// Fonction pour scraper le prix Silver New York
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

// Fonction pour scraper le prix Silver  Londres
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

// Fonction pour scraper le prix Silver SHA
export async function scrapeSilverShanghai() {
    try {
        const url = "https://www.chinafxtools.com/silver/shanghai/";
        const html = await fetch(url).then(r => r.text());
        const $ = cheerio.load(html);
        // Prix = deuxième span dans current-price-large .price
        const priceText = $(".current-price-large .price span").last().text().trim();
        const silverShanghai = parseFloat(priceText.replace(/,/g, ""));
        if (isNaN(silverShanghai)) throw new Error("Silver SHA price not found");
        return silverShanghai;
    } catch (err) {
        console.error("Fetch error: Silver SHA price not found");
        return null;
    }
}

// Fonction pour scraper le prix Gold NY
export async function scrapeGoldNY() {
    try {
        const url = "https://www.chinafxtools.com/gold/newyork/";
        const html = await fetch(url).then(r => r.text());
        const $ = cheerio.load(html);
        // On prend le deuxième span dans current-price-large .price
        const priceText = $(".current-price-large .price span")
            .last()   // récupère le dernier span → le prix numérique
            .text()
            .trim();
        const goldNY = parseFloat(priceText.replace(/,/g, ""));
        if (isNaN(goldNY)) throw new Error("Gold NY price not found");
        return goldNY;
    } catch (err) {
        console.error("Fetch error: Gold NY price not found");
        return null;
    }
}

export async function scrapeFXRateRMBUSD() {
    try {
        const url = "https://www.chinafxtools.com/exchange/";
        const html = await fetch(url).then(res => res.text());
        const $ = cheerio.load(html);

        // Recherche le bloc où est affiché le taux USD → CNY
        // On cherche un élément qui contient "USD" suivi du nombre en CNY
        let rateText = "";
        $(".major-currency-table, .exchange-rate-table, .fx-table")
            .each((i, el) => {
                const text = $(el).text();
                if (text.includes("USD")) {
                    // trouve le taux autour de USD
                    const match = text.match(/USD\s*([0-9]+(?:\.[0-9]+)?)\s*CNY/);
                    if (match) {
                        rateText = match[1];
                    }
                }
            });

        if (!rateText) throw new Error("RMB/USD rate not found");

        const rate = parseFloat(rateText.replace(/,/g, ""));
        if (isNaN(rate)) throw new Error("RMB/USD rate is not a number");

        return rate;
    } catch (err) {
        console.error("Fetch error: RMB/USD rate not found");
        return null;
    }
