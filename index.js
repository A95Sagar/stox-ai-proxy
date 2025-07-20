const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

app.get("/bse-announcements", async (req, res) => {
  try {
    const response = await axios.get("https://www.bseindia.com/corporates/ann.html", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $("table#ctl00_ContentPlaceHolder1_gvData tr").each((i, row) => {
      const cols = $(row).find("td");
      if (cols.length > 3) {
        results.push({
          time: $(cols[0]).text().trim(),
          company: $(cols[1]).text().trim(),
          subject: $(cols[2]).text().trim(),
          link: "https://www.bseindia.com" + $(cols[2]).find("a").attr("href")
        });
      }
    });

    res.json(results.slice(0, 10)); // top 10 latest
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/", (req, res) => {
  res.send("✅ BSE Proxy is Live – use /bse-announcements to view data.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
