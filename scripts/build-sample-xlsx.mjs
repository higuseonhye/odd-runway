/** Regenerate `public/sample-runway-transactions.xlsx` from the CSV. `npm run generate:sample` */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as XLSX from "xlsx";

const root = dirname(fileURLToPath(new URL(import.meta.url)));
const csvPath = join(root, "..", "public", "sample-runway-transactions.csv");
const outPath = join(root, "..", "public", "sample-runway-transactions.xlsx");

const csv = readFileSync(csvPath, "utf8");
const wb = XLSX.read(csv, { type: "string" });
XLSX.writeFile(wb, outPath);
console.log("Wrote", outPath);
