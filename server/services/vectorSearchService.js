const ScamReport = require('../models/ScamReport');

/**
 * Tokenize and normalize text into feature vector terms
 */
const tokenizeText = (text) => {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter((term) => term.length > 2)
  );
};

/**
 * Calculate Jaccard similarity index between two term sets
 */
const calculateJaccardSimilarity = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionSize = 0;
  for (const term of setA) {
    if (setB.has(term)) {
      intersectionSize++;
    }
  }
  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
};

/**
 * Find Similar Scam Reports across MongoDB collection
 */
const findSimilarReports = async (reportId, limit = 5) => {
  try {
    const targetReport = await ScamReport.findById(reportId);
    if (!targetReport) return [];

    const targetPayload = `${targetReport.title} ${targetReport.description} ${targetReport.textContent || ''} ${targetReport.url || ''}`.toLowerCase();
    const targetTokens = tokenizeText(targetPayload);

    // Fetch all other reports except the target report
    const candidates = await ScamReport.find({ _id: { $ne: reportId } })
      .select('title description reportType textContent url status aiAnalysis createdAt')
      .limit(100);

    const scoredCandidates = [];

    for (const candidate of candidates) {
      // Direct exact match checks (Same URL or exact text content)
      let similarityScore = 0;

      if (targetReport.url && candidate.url && targetReport.url.toLowerCase() === candidate.url.toLowerCase()) {
        similarityScore = 0.95; // Almost exact match
      } else if (
        targetReport.textContent &&
        candidate.textContent &&
        targetReport.textContent.toLowerCase() === candidate.textContent.toLowerCase()
      ) {
        similarityScore = 0.98; // Exact message match
      } else {
        const candidatePayload = `${candidate.title} ${candidate.description} ${candidate.textContent || ''} ${candidate.url || ''}`.toLowerCase();
        const candidateTokens = tokenizeText(candidatePayload);
        similarityScore = calculateJaccardSimilarity(targetTokens, candidateTokens);
      }

      // If similarity exceeds minimum threshold of 15%
      if (similarityScore >= 0.15) {
        scoredCandidates.push({
          report: candidate,
          similarityPercentage: Math.round(similarityScore * 100),
          isDuplicateMatch: similarityScore >= 0.70
        });
      }
    }

    // Sort by highest similarity percentage
    scoredCandidates.sort((a, b) => b.similarityPercentage - a.similarityPercentage);

    return scoredCandidates.slice(0, limit);
  } catch (error) {
    console.error('[Vector Search Service] Error searching similar reports:', error.message);
    return [];
  }
};

module.exports = {
  findSimilarReports,
  calculateJaccardSimilarity
};
