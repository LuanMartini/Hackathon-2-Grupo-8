import { diagnosticTrees } from "@/data/diagnosticTrees";
import { adaptQuestionToContext } from "@/lib/question-adaptation";
import { selectDiagnosticTreeId } from "@/lib/diagnostic-selection";

export { adaptQuestionToContext } from "@/lib/question-adaptation";

export function selectDiagnosticTree(description = "") {
  return diagnosticTrees[selectDiagnosticTreeId(description)] || diagnosticTrees.general;
}

export function createDiagnosticState(description) {
  const tree = selectDiagnosticTree(description);
  return {
    description,
    treeId: tree.id,
    nodeId: tree.startNode,
    possibilities: [...tree.problems],
    path: [],
    startedAt: new Date().toISOString(),
  };
}

export function answerDiagnostic(tree, state, answerId) {
  const node = tree?.nodes?.[state.nodeId];
  if (!node) throw new Error("Pergunta de diagnóstico não encontrada.");
  const answer = node.answers.find((item) => item.id === answerId);
  if (!answer) throw new Error("Resposta inválida para esta pergunta.");
  const possibilities = answer.keep?.length
    ? state.possibilities.filter((item) => answer.keep.includes(item)).concat(answer.keep.filter((item) => !state.possibilities.includes(item)))
    : state.possibilities;
  const path = [...state.path, {
    nodeId: node.id,
    baseQuestion: node.question,
    displayedQuestion: adaptQuestionToContext(node.question, state.description, tree.id),
    question: adaptQuestionToContext(node.question, state.description, tree.id),
    answerId: answer.id,
    answer: answer.label,
    information: answer.info,
    possibilities,
  }];

  if (answer.result) return { done: true, resultId: answer.result, state: { ...state, path, possibilities } };
  return { done: false, state: { ...state, path, possibilities, nodeId: answer.next } };
}

export function replayDiagnostic(description, treeId, path) {
  const tree = diagnosticTrees[treeId];
  if (!tree) throw new Error("Árvore de diagnóstico não encontrada.");
  let state = { description, treeId, nodeId: tree.startNode, possibilities: [...tree.problems], path: [], startedAt: new Date().toISOString() };
  let outcome = { done: false, state };
  for (const step of path) {
    outcome = answerDiagnostic(tree, outcome.state, step.answerId);
    state = outcome.state;
  }
  return outcome;
}

export function buildDiagnosisResult(tree, diagnosticState, resultId) {
  const result = tree.results[resultId];
  if (!result) throw new Error("Resultado do diagnóstico não encontrado.");
  const elapsedSeconds = Math.max(45, Math.round((Date.now() - new Date(diagnosticState.startedAt).getTime()) / 1000));
  return {
    id: resultId,
    treeId: tree.id,
    treeName: tree.name,
    description: diagnosticState.description,
    title: result.title,
    category: result.category,
    priority: result.priority,
    confidence: result.confidence,
    causes: result.causes,
    path: diagnosticState.path,
    information: diagnosticState.path.map((step) => step.information),
    elapsedSeconds,
    completedAt: new Date().toISOString(),
  };
}

export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes}m ${rest}s` : `${rest}s`;
}
