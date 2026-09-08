const axios = require('axios');

/**
 * Offline Heuristic URL Threat Scanner (Fallback when Safe Browsing API Key is not set)
 */
const runOfflineUrlCheck = (targetUrl) => {
  if (!targetUrl || typeof targetUrl !== 'string') {
    return { isMalicious: false, threatTypes: [], checkedAt: new Date() };
  }

  const urlLower = targetUrl.toLowerCase();
  const threatTypes = [];

  // High-Risk TLDs
  const suspiciousTLDs = ['.xyz', '.top', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.free', '.work', '.site'];
  if (suspiciousTLDs.some((tld) => urlLower.includes(tld))) {
    threatTypes.push('SUSPICIOUS_HIGH_RISK_TLD');
  }

  // Direct IP Address Host
  if (urlLower.match(/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
    threatTypes.push('DIRECT_IP_HOST');
  }

  // Insecure HTTP Protocol
  if (urlLower.startsWith('http://')) {
    threatTypes.push('UNENCRYPTED_HTTP_TRANSPORT');
  }

  // Typosquatting / Brand Spoofing Keywords
  const brandSpoofs = ['jazzcash', 'easypaisa', 'hbl', 'ubl', 'mcb', 'bisp', 'ehsaas', 'reward', 'lottery', 'verify-login', 'claim-prize'];
  if (brandSpoofs.some((brand) => urlLower.includes(brand))) {
    threatTypes.push('SOCIAL_ENGINEERING_BRAND_IMPERSONATION');
  }

  const isMalicious = threatTypes.length >= 1;

  return {
    isMalicious,
    threatTypes: isMalicious ? threatTypes : ['SAFE_TRANSPARENT_URL'],
    checkedAt: new Date()
  };
};

/**
 * Main Google Safe Browsing Service
 */
const checkUrlSafety = async (targetUrl) => {
  if (!targetUrl || targetUrl.trim() === '') {
    return { isMalicious: false, threatTypes: [], checkedAt: new Date() };
  }

  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_google_safe_browsing_api_key') {
    console.log('[Safe Browsing] No API key configured. Running offline threat domain scanner...');
    return runOfflineUrlCheck(targetUrl);
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const payload = {
      client: {
        clientId: 'scamsentry-pk',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: targetUrl }]
      }
    };

    const response = await axios.post(endpoint, payload, { timeout: 3000 });

    if (response.data && response.data.matches && response.data.matches.length > 0) {
      const detectedTypes = response.data.matches.map((m) => m.threatType);
      return {
        isMalicious: true,
        threatTypes: [...new Set(detectedTypes)],
        checkedAt: new Date()
      };
    }

    return {
      isMalicious: false,
      threatTypes: ['CLEAN_GOOGLE_SAFE_BROWSING'],
      checkedAt: new Date()
    };
  } catch (error) {
    console.error('[Safe Browsing] API check failed:', error.message);
    return runOfflineUrlCheck(targetUrl);
  }
};

module.exports = {
  checkUrlSafety,
  runOfflineUrlCheck
};
