// API Service Layer - Centralized HTTP client for n8n automation and backend services

/**
 * Standardized API GET client with timeout and error parsing
 */
export async function apiGet(url, options = {}) {
  const { timeout = 15000, headers = {}, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
      signal: controller.signal,
      ...rest,
    });

    clearTimeout(timeoutId);

    // Parse JSON or text response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMsg = data?.message || data?.hint || `HTTP ${response.status}: ${response.statusText}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out while waiting for n8n response.');
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }

    throw error;
  }
}

/**
 * Standardized API POST client for Workflow triggers (e.g. Generate Outreach Email)
 */
export async function apiPost(url, payload = {}, options = {}) {
  const { timeout = 35000, headers = {}, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        ...headers,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      ...rest,
    });

    clearTimeout(timeoutId);

    // Parse response safely (supports JSON, plain text, and empty responses)
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : { success: true };
      } catch {
        data = { message: text, success: true };
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message || data?.hint || (typeof data === 'string' ? data : `HTTP ${response.status}: ${response.statusText}`);
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out while waiting for n8n Workflow 3 execution.');
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }

    throw error;
  }
}
