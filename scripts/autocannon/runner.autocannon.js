import path from "node:path";

import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const ROOT_DIRECTORY = path.resolve(dirname, "../..");
const RELATIVE_PATH_TO_PACKAGE_JSON = path.join(ROOT_DIRECTORY, "package.json");

async function handleGetPackageJson() {
    const packageJson = await readFile(RELATIVE_PATH_TO_PACKAGE_JSON, "utf8");

    return JSON.parse(packageJson);
}

function handlePrintBenchmarkUsage(benchmarks) {
    console.log(`Usage: npm run benchmark -- <benchmark>
        
Available benchmarks:`);

    for (const benchmark of Object.keys(benchmarks)) console.log(`    ${benchmark}`);

    console.log();
}

async function handleRunBenchmark(name, command) {
    console.log(`Running benchmark: ${name}`);
    console.log(`$ ${command}`);

    await execute(command);

    console.log(`Benchmark completed: ${name}`);
}

function execute(command, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: ROOT_DIRECTORY,
            stdio: "inherit",
            shell: true,
            env: { ...process.env },
        });

        child.on("error", reject);

        child.on("close", (code, signal) => {
            if (signal) {
                const error = new Error(`Process terminated by signal: ${signal}`);

                reject(error);
                return;
            }

            if (code !== 0) {
                const error = new Error(`Process exited with code ${code}`);

                reject(error);
                return;
            }

            resolve();
        });
    });
}

async function main() {
    const json = await handleGetPackageJson();
    const benchmarks = json.autocannon;

    if (!benchmarks || typeof benchmarks !== "object") {
        console.error("No autocannon configuration found in package.json.");

        process.exitCode = 1;

        return;
    }

    const name = process.argv[2];

    if (!name) {
        handlePrintBenchmarkUsage(benchmarks);
        return;
    }

    const command = benchmarks[name];

    if (!command) {
        console.error(`Unknown benchmark: ${name}`);
        handlePrintBenchmarkUsage(benchmarks);

        process.exitCode = 1;

        return;
    }

    await handleRunBenchmark(name, command);
}

main().catch((error) => {
    console.error("Benchmark failed.");
    console.error(error.message);

    process.exitCode = 1;
});
