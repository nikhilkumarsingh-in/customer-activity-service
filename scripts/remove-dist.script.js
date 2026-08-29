import path from "node:path";

import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const relativePathToDistributionDirectory = path.join(dirname, "../dist");

async function handleRemoveDistributionDirectory() {
    await rm(relativePathToDistributionDirectory, { recursive: true, force: true });
    console.log("Distribution directory removed successfully.");
}

handleRemoveDistributionDirectory();
