import Problem from "../models/Problem.js";

export async function listProblems(req, res) {
  const problems = await Problem.find().select("slug title difficulty").sort("title");
  res.json(problems);
}

export async function getProblem(req, res) {
  const problem = await Problem.findById(req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  res.json(problem);
}
