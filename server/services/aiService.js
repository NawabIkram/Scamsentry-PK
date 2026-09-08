const { GoogleGenAI } = require('@google/genai');

/**
 * Heuristic Threat Analyzer (Fallback Engine when API key is unconfigured or AI service is unavailable)
 */
const runHeuristicAnalysis = (report) => {
  const { reportType, title = '', description = '', textContent = '', url = '' } = report;
  const combinedText = `${title} ${description} ${textContent} ${url}`.toLowerCase();

  let riskScore = 40;
  const indicatorsOfCompromise = [];
  const tactics = [];
  const recommendedActions = [];

  // Keyword Threat Indicators
  const urgencyKeywords = ['urgent', 'blocked', 'suspended', '24 hours', 'immediate', 'expiring'];
  const financeKeywords = ['jazzcash', 'easypaisa', 'hbl', 'mcb', 'ubl', 'bank', 'account', 'otp', 'pin', 'bisp', 'ehsaas', 'reward', 'prize', 'lottery', 'winner', 'rs', 'pkr'];
  const credentialKeywords = ['verify', 'login', 'password', 'cnic', 'claim', 'click here', 'update'];

  // Detect Urgency Tactics
  if (urgencyKeywords.some((kw) => combinedText.includes(kw))) {
    riskScore += 20;
    tactics.push('Urgency & Panic Creation');
    indicatorsOfCompromise.push('Coercive Urgency Language Detected');
  }

  // Detect Financial Impersonation
  if (financeKeywords.some((kw) => combinedText.includes(kw))) {
    riskScore += 25;
    tactics.push('Brand & Financial Institution Impersonation');
    indicatorsOfCompromise.push('Finance/Payment Gateway Reference');
  }

  // Detect Credential Harvesting
  if (credentialKeywords.some((kw) => combinedText.includes(kw))) {
    riskScore += 15;
    tactics.push('Credential Harvesting Intent');
    indicatorsOfCompromise.push('Sensitive Data Input Request');
  }

  // URL Checks
  if (reportType === 'url' || url) {
    indicatorsOfCompromise.push(`Analyzed Target URL: ${url || 'Extracted URL'}`);
    if (url.startsWith('http://')) {
      riskScore += 15;
      indicatorsOfCompromise.push('Insecure Protocol (Unencrypted HTTP)');
      tactics.push('Unencrypted Transport');
    }
    if (url.includes('.xyz') || url.includes('.tk') || url.includes('.top') || url.includes('.free') || url.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      riskScore += 20;
      indicatorsOfCompromise.push('High-Risk Domain Extension / Direct IP Address');
    }
  }

  // Screenshot / QR Specific
  if (reportType === 'screenshot' || reportType === 'qr') {
    tactics.push('Visual Social Engineering Payload');
    indicatorsOfCompromise.push('Image Evidence Submitted for OCR Inspection');
  }

  // Cap score between 10 and 98
  riskScore = Math.min(Math.max(riskScore, 25), 98);

  // Risk Level Assignment
  let riskLevel = 'Low';
  if (riskScore >= 80) riskLevel = 'Critical';
  else if (riskScore >= 65) riskLevel = 'High';
  else if (riskScore >= 45) riskLevel = 'Medium';

  // Recommendations
  recommendedActions.push('Do not share OTPs, PINs, or CNIC numbers with any unknown sender.');
  recommendedActions.push('Never click unverified links received via SMS or WhatsApp.');
  if (riskScore >= 65) {
    recommendedActions.push('Report this incident to the FIA Cybercrime Helpline (1991) or your bank customer support.');
  }

  return {
    riskScore,
    riskLevel,
    summary: `Heuristic Threat Evaluation: Identified ${tactics.length > 0 ? tactics.join(', ') : 'potential threat indicators'} targeting digital users in Pakistan.`,
    indicatorsOfCompromise,
    tactics: tactics.length > 0 ? tactics : ['Unverified Digital Signal'],
    recommendedActions,
    analyzedAt: new Date()
  };
};

/**
 * Main AI Threat Analysis Entrypoint (Gemini API with Fallback)
 */
const analyzeThreat = async (report) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key configured, use fallback engine directly
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key') {
    console.log('[AI Service] No valid GEMINI_API_KEY found. Running heuristic threat engine...');
    return runHeuristicAnalysis(report);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are ScamSentry AI, an expert cybersecurity threat intelligence analyst specializing in digital scam detection in Pakistan (Phishing SMS, fake bank alerts, lottery fraud, BISP/Ehsaas scams, fake online stores, malicious URLs).

Analyze the following scam report and return JSON matching the required format:

Report Type: ${report.reportType}
Title: ${report.title}
Description: ${report.description}
Text Payload: ${report.textContent || 'N/A'}
Target URL: ${report.url || 'N/A'}

Respond ONLY with valid JSON in this exact structure without markdown formatting or code blocks:
{
  "riskScore": number (0 to 100),
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "summary": "Clear, concise 2-sentence summary of the scam technique and risk",
  "indicatorsOfCompromise": ["list of detected IOCs like phone numbers, URL domains, scam keywords"],
  "tactics": ["list of cyber attack tactics like Impersonation, Urgency, Credential Harvesting"],
  "recommendedActions": ["3 actionable safety advice steps for the user"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return {
      riskScore: Math.min(Math.max(parsedData.riskScore || 50, 0), 100),
      riskLevel: parsedData.riskLevel || 'Medium',
      summary: parsedData.summary || 'AI Threat Analysis complete.',
      indicatorsOfCompromise: Array.isArray(parsedData.indicatorsOfCompromise) ? parsedData.indicatorsOfCompromise : [],
      tactics: Array.isArray(parsedData.tactics) ? parsedData.tactics : ['Digital Threat Signal'],
      recommendedActions: Array.isArray(parsedData.recommendedActions) ? parsedData.recommendedActions : ['Exercise caution.'],
      analyzedAt: new Date()
    };
  } catch (error) {
    console.error('[AI Service] Gemini API call failed:', error.message);
    console.log('[AI Service] Falling back to heuristic threat analysis engine...');
    return runHeuristicAnalysis(report);
  }
};

module.exports = {
  analyzeThreat,
  runHeuristicAnalysis
};
