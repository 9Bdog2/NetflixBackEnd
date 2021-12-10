import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

/*-------------Folder path for JSON File------------ */
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
/*-------------Folder path for JSON File------------ */
/*-------------JSON PATH------------ */
const mediaJSONPath = join(dataFolderPath, "media.json");
/*-------------JSON PATH------------ */
/*-------------READ & WRITE JSON Files------------ */
export function readMediaJSON() {
  return readJSON(mediaJSONPath);
}
export function writeMediaJSON(data) {
  return writeJSON(mediaJSONPath, data);
}

/*-------------READ & WRITE JSON Files------------ */
