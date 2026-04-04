const { neon } = require("D:/Projetos Dev/controle-figurinhas-2026/node_modules/@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
envFile.split("\n").forEach((line) => {
  const [key, ...vals] = line.split("=");
  if (key && vals.length) process.env[key.trim()] = vals.join("=").trim();
});

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, "../schema.sql"), "utf8");
  const statements = schema
    .split(";")
    .map((s) =>
      s.split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim()
    )
    .filter((s) => s.length > 0);

  console.log("Conectando ao Neon...");
  console.log(`Executando ${statements.length} statements...\n`);

  for (const stmt of statements) {
    try {
      await sql.query(stmt);
      const name = stmt.match(/TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)/i)?.[1]
        ?? stmt.match(/TABLE\s+(\w+)/i)?.[1]
        ?? stmt.substring(0, 50);
      console.log("  [OK]", name);
    } catch (e) {
      console.error("  [ERRO]", e.message);
    }
  }

  console.log("\nConcluido! Tabelas criadas no Neon.");
}

main().catch(console.error);
