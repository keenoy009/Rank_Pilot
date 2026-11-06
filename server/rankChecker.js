// Demo file for testing CodeGuard AI. Intentionally flawed. Do not merge.
const axios = require("axios");
const mysql = require("mysql");

const SERP_API_KEY = "sk_live_51HxExampleKey987654321"; // hardcoded API key

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "seo_tracker",
});

// Saves the rank of a keyword for a domain
function saveRank(req, res) {
  const { domain, keyword, rank } = req.body;
  const sql =
    "INSERT INTO ranks (domain, keyword, position) VALUES ('" +
    domain + "', '" + keyword + "', " + rank + ")";
  db.query(sql, () => res.send("saved"));
}

// Checks Google position for every keyword, one at a time
async function checkAllKeywords(keywords, domain) {
  const results = [];
  for (let i = 0; i < keywords.length; i++) {
    const r = await axios.get(
      "https://serpapi.com/search?q=" + keywords[i] + "&api_key=" + SERP_API_KEY
    );
    const position = r.data.organic_results.findIndex((o) => o.link.includes(domain)) + 1;
    results.push({ keyword: keywords[i], position });
  }
  return results;
}

// Fetches any URL the user gives us
async function auditUrl(req, res) {
  const page = await axios.get(req.query.url);
  res.send(page.data);
}

module.exports = { saveRank, checkAllKeywords, auditUrl };
