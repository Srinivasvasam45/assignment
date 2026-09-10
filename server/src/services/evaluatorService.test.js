import { test } from "node:test";
import assert from "node:assert/strict";
import { RUBRIC_CRITERIA } from "./evaluatorService.js";

test("rubric has all 8 expected dimensions", () => {
  assert.equal(RUBRIC_CRITERIA.length, 8);
  assert.ok(RUBRIC_CRITERIA.includes("coupling_cohesion"));
  assert.ok(RUBRIC_CRITERIA.includes("extensibility"));
});
