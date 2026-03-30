/** First sheet → CSV text for the same parser as bank exports. */
export async function excelFileToCsvText(file: File): Promise<string> {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const firstName = wb.SheetNames[0];
  if (!firstName) throw new Error("The workbook has no sheets.");
  const ws = wb.Sheets[firstName];
  if (!ws) throw new Error("Could not read the first sheet.");
  return XLSX.utils.sheet_to_csv(ws);
}
