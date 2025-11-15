import { assert } from "@std/assert";

const configCode = await Deno.readTextFile(
  new URL("../src/config.js", import.meta.url)
);
let pgCode = await Deno.readTextFile(
  new URL("../src/passwordGenerator.js", import.meta.url)
);
pgCode = pgCode.replace(/importScripts\([^)]*\);?\s*/i, "");

function loadInSandbox(configSrc, pgSrc) {
  const sandboxSelf = {};
  const wrapper = new Function(
    "self",
    "console",
    "Math",
    `${configSrc}\n${pgSrc}\nreturn self.generatePassword;`
  );
  return wrapper(sandboxSelf, console, Math);
}

const generatePassword = loadInSandbox(configCode, pgCode);

Deno.test("password properties - single run", () => {
  const pwd = generatePassword(21);
  assert(typeof pwd === "string");
  assert(pwd.length === 21);
  assert(/[a-z]/.test(pwd));
  assert(/[A-Z]/.test(pwd));
  assert(/[0-9]/.test(pwd));
  assert(/[.,\-]/.test(pwd));
});

Deno.test("password properties - multiple runs", () => {
  const RUNS = 200;
  const failures = [];
  for (let i = 0; i < RUNS; i++) {
    const pwd = generatePassword(21);
    if (typeof pwd !== "string" || pwd.length !== 21) {
      failures.push(`bad-length:${pwd}`);
      continue;
    }
    if (!/[a-z]/.test(pwd)) failures.push(`no-lower:${pwd}`);
    if (!/[A-Z]/.test(pwd)) failures.push(`no-upper:${pwd}`);
    if (!/[0-9]/.test(pwd)) failures.push(`no-digit:${pwd}`);
    if (!/[.,\-]/.test(pwd)) failures.push(`no-special:${pwd}`);
  }

  if (failures.length) {
    throw new Error(
      `Found ${failures.length} failures (first 20):\n${failures
        .slice(0, 20)
        .join("\n")}`
    );
  }
});
