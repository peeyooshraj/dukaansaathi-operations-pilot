import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

test("embedded application JavaScript parses", () => {
  assert.ok(script, "expected an embedded application script");
  assert.doesNotThrow(() => new vm.Script(script));
});

test("project identity and local storage key are separated from KiranaFlow A", () => {
  assert.match(html, /DukaanSaathi/);
  assert.match(html, /dukaansaathi-operations-v1/);
});

test("critical daily workflows are present", () => {
  for (const token of ["SALE", "RECEIPT", "COUNT", "LOST", "CREDIT", "PAYMENT", "BILL", "VOID"]) {
    assert.match(html, new RegExp(`\\b${token}\\b`), `missing ${token} workflow`);
  }
});

test("reorder logic uses lead time, pack size and demand evidence", () => {
  assert.match(script, /function demand\(pid\)/);
  assert.match(script, /function plan\(p\)/);
  assert.match(script, /lead=\+p\.lead/);
  assert.match(script, /pack=\+p\.pack/);
});

test("backup, restore and merge mechanisms exist", () => {
  assert.match(html, /dukaansaathi-backup-/);
  assert.match(script, /function mergeBackup\(j\)/);
  assert.match(script, /#fl/);
});
