/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/shared/types.ts
// Shared types for Columbus extension
// Scraper types
const SCRAPER_SOURCES = [
    'linkedin',
    'indeed',
    'greenhouse',
    'lever',
    'waterlooworks',
    'unknown',
];
const DEFAULT_SETTINGS = {
    autoFillEnabled: true,
    showConfidenceIndicators: true,
    minimumConfidence: 0.5,
    learnFromAnswers: true,
    autoDetectPrompts: true,
    notifyOnJobDetected: true,
    showSalaryOverlay: true,
    enableJobScraping: true,
    enabledScraperSources: [...SCRAPER_SOURCES],
};
const DEFAULT_API_BASE_URL = 'http://localhost:3000';

;// ./src/background/storage.ts
// Extension storage utilities

const STORAGE_KEY = 'columbus_extension';
function mergeSettingsWithDefaults(settings) {
    return {
        ...DEFAULT_SETTINGS,
        ...settings,
    };
}
async function getStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
            const stored = result[STORAGE_KEY];
            resolve({
                apiBaseUrl: DEFAULT_API_BASE_URL,
                ...stored,
                settings: mergeSettingsWithDefaults(stored?.settings),
            });
        });
    });
}
async function setStorage(updates) {
    const current = await getStorage();
    const updated = { ...current, ...updates };
    return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: updated }, resolve);
    });
}
async function clearStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.remove(STORAGE_KEY, resolve);
    });
}
// Auth token helpers
async function setAuthToken(token, expiresAt) {
    await setStorage({
        authToken: token,
        tokenExpiry: expiresAt,
    });
}
async function clearAuthToken() {
    await setStorage({
        authToken: undefined,
        tokenExpiry: undefined,
        cachedProfile: undefined,
        profileCachedAt: undefined,
    });
}
async function getAuthToken() {
    const storage = await getStorage();
    if (!storage.authToken)
        return null;
    // Check expiry
    if (storage.tokenExpiry) {
        const expiry = new Date(storage.tokenExpiry);
        if (expiry < new Date()) {
            await clearAuthToken();
            return null;
        }
    }
    return storage.authToken;
}
// Profile cache helpers
const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
async function getCachedProfile() {
    const storage = await getStorage();
    if (!storage.cachedProfile || !storage.profileCachedAt) {
        return null;
    }
    const cachedAt = new Date(storage.profileCachedAt);
    if (Date.now() - cachedAt.getTime() > PROFILE_CACHE_TTL) {
        return null; // Cache expired
    }
    return storage.cachedProfile;
}
async function setCachedProfile(profile) {
    await setStorage({
        cachedProfile: profile,
        profileCachedAt: new Date().toISOString(),
    });
}
async function clearCachedProfile() {
    await setStorage({
        cachedProfile: undefined,
        profileCachedAt: undefined,
    });
}
// Settings helpers
async function getSettings() {
    const storage = await getStorage();
    return storage.settings;
}
async function updateSettings(updates) {
    const storage = await getStorage();
    const updated = mergeSettingsWithDefaults({ ...storage.settings, ...updates });
    await setStorage({ settings: updated });
    return updated;
}
// API URL helper
async function setApiBaseUrl(url) {
    await setStorage({ apiBaseUrl: url });
}
async function getApiBaseUrl() {
    const storage = await getStorage();
    return storage.apiBaseUrl;
}

;// ./src/background/api-client.ts
// Columbus API client for extension

class ColumbusAPIClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }
    async getAuthToken() {
        const storage = await getStorage();
        if (!storage.authToken)
            return null;
        // Check expiry
        if (storage.tokenExpiry) {
            const expiry = new Date(storage.tokenExpiry);
            if (expiry < new Date()) {
                // Token expired, clear it
                await setStorage({ authToken: undefined, tokenExpiry: undefined });
                return null;
            }
        }
        return storage.authToken;
    }
    async authenticatedFetch(path, options = {}) {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Not authenticated');
        }
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-Extension-Token': token,
                ...options.headers,
            },
        });
        if (!response.ok) {
            if (response.status === 401) {
                // Clear invalid token
                await setStorage({ authToken: undefined, tokenExpiry: undefined });
                throw new Error('Authentication expired');
            }
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `Request failed: ${response.status}`);
        }
        return response.json();
    }
    async isAuthenticated() {
        const token = await this.getAuthToken();
        if (!token)
            return false;
        try {
            await this.authenticatedFetch('/api/extension/auth/verify');
            return true;
        }
        catch {
            return false;
        }
    }
    async getProfile() {
        return this.authenticatedFetch('/api/extension/profile');
    }
    async importJob(job) {
        return this.authenticatedFetch('/api/opportunities/from-extension', {
            method: 'POST',
            body: JSON.stringify({
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                requirements: job.requirements,
                responsibilities: job.responsibilities || [],
                keywords: job.keywords || [],
                type: job.type,
                remote: job.remote,
                salary: job.salary,
                url: job.url,
                source: job.source,
                sourceJobId: job.sourceJobId,
                postedAt: job.postedAt,
                deadline: job.deadline,
            }),
        });
    }
    async importJobsBatch(jobs) {
        return this.authenticatedFetch('/api/opportunities/from-extension', {
            method: 'POST',
            body: JSON.stringify({ jobs }),
        });
    }
    async saveLearnedAnswer(data) {
        return this.authenticatedFetch('/api/extension/learned-answers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async searchSimilarAnswers(question) {
        const response = await this.authenticatedFetch('/api/extension/learned-answers/search', {
            method: 'POST',
            body: JSON.stringify({ question }),
        });
        return response.results;
    }
    async getLearnedAnswers() {
        const response = await this.authenticatedFetch('/api/extension/learned-answers');
        return response.answers;
    }
    async deleteLearnedAnswer(id) {
        await this.authenticatedFetch(`/api/extension/learned-answers/${id}`, {
            method: 'DELETE',
        });
    }
    async updateLearnedAnswer(id, answer) {
        return this.authenticatedFetch(`/api/extension/learned-answers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ answer }),
        });
    }
}
// Singleton instance
let client = null;
async function getAPIClient() {
    if (!client) {
        const storage = await getStorage();
        client = new ColumbusAPIClient(storage.apiBaseUrl);
    }
    return client;
}
function resetAPIClient() {
    client = null;
}

;// ./src/background/index.ts
// Background service worker for Columbus extension


// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender)
        .then(sendResponse)
        .catch((error) => {
        console.error('[Columbus] Message handler error:', error);
        sendResponse({ success: false, error: error.message });
    });
    // Return true to indicate async response
    return true;
});
async function handleMessage(message, sender) {
    switch (message.type) {
        case 'GET_AUTH_STATUS':
            return handleGetAuthStatus();
        case 'OPEN_AUTH':
            return handleOpenAuth();
        case 'LOGOUT':
            return handleLogout();
        case 'GET_PROFILE':
            return handleGetProfile();
        case 'IMPORT_JOB':
            return handleImportJob(message.payload);
        case 'IMPORT_JOBS_BATCH':
            return handleImportJobsBatch(message.payload);
        case 'SAVE_ANSWER':
            return handleSaveAnswer(message.payload);
        case 'SEARCH_ANSWERS':
            return handleSearchAnswers(message.payload);
        case 'GET_LEARNED_ANSWERS':
            return handleGetLearnedAnswers();
        case 'DELETE_ANSWER':
            return handleDeleteAnswer(message.payload);
        default:
            return { success: false, error: `Unknown message type: ${message.type}` };
    }
}
async function handleGetAuthStatus() {
    try {
        const client = await getAPIClient();
        const isAuthenticated = await client.isAuthenticated();
        const apiBaseUrl = await getApiBaseUrl();
        return {
            success: true,
            data: { isAuthenticated, apiBaseUrl },
        };
    }
    catch (error) {
        return {
            success: true,
            data: { isAuthenticated: false, apiBaseUrl: await getApiBaseUrl() },
        };
    }
}
async function handleOpenAuth() {
    try {
        const apiBaseUrl = await getApiBaseUrl();
        const authUrl = `${apiBaseUrl}/extension/connect`;
        // Open auth page in new tab
        await chrome.tabs.create({ url: authUrl });
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleLogout() {
    try {
        await clearAuthToken();
        resetAPIClient();
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleGetProfile() {
    try {
        // Check cache first
        const cached = await getCachedProfile();
        if (cached) {
            return { success: true, data: cached };
        }
        // Fetch from API
        const client = await getAPIClient();
        const profile = await client.getProfile();
        // Cache the profile
        await setCachedProfile(profile);
        return { success: true, data: profile };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleImportJob(job) {
    try {
        const client = await getAPIClient();
        const result = await client.importJob(job);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleImportJobsBatch(jobs) {
    try {
        const client = await getAPIClient();
        const result = await client.importJobsBatch(jobs);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleSaveAnswer(data) {
    try {
        const client = await getAPIClient();
        const result = await client.saveLearnedAnswer({
            question: data.question,
            answer: data.answer,
            sourceUrl: data.url,
            sourceCompany: data.company,
        });
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleSearchAnswers(question) {
    try {
        const client = await getAPIClient();
        const results = await client.searchSimilarAnswers(question);
        return { success: true, data: results };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleGetLearnedAnswers() {
    try {
        const client = await getAPIClient();
        const answers = await client.getLearnedAnswers();
        return { success: true, data: answers };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleDeleteAnswer(id) {
    try {
        const client = await getAPIClient();
        await client.deleteLearnedAnswer(id);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
// Handle auth callback from Columbus web app
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.type === 'AUTH_CALLBACK' && message.token && message.expiresAt) {
        setAuthToken(message.token, message.expiresAt)
            .then(() => {
            resetAPIClient();
            sendResponse({ success: true });
        })
            .catch((error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});
// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id)
        return;
    switch (command) {
        case 'fill-form':
            chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_FILL' });
            break;
        case 'import-job':
            chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_IMPORT' });
            break;
    }
});
// Handle extension install/update
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('[Columbus] Extension installed');
        // Could open onboarding page here
    }
    else if (details.reason === 'update') {
        console.log('[Columbus] Extension updated to', chrome.runtime.getManifest().version);
    }
});
console.log('[Columbus] Background service worker started');

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLFlBQVk7QUFDcEI7QUFDQSxZQUFZLGNBQWM7QUFDMUIsMkJBQTJCLGVBQWU7QUFDMUMsU0FBUztBQUNUO0FBQ0EsMkJBQTJCLHNDQUFzQztBQUNqRSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsNENBQTRDLG1DQUFtQztBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxzQkFBc0I7QUFDcEU7QUFDQTtBQUNBLDhDQUE4Qyx3QkFBd0I7QUFDdEU7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb2x1bWJ1cy1leHRlbnNpb24vLi9zcmMvc2hhcmVkL3R5cGVzLnRzIiwid2VicGFjazovL2NvbHVtYnVzLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vY29sdW1idXMtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvYXBpLWNsaWVudC50cyIsIndlYnBhY2s6Ly9jb2x1bWJ1cy1leHRlbnNpb24vLi9zcmMvYmFja2dyb3VuZC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTaGFyZWQgdHlwZXMgZm9yIENvbHVtYnVzIGV4dGVuc2lvblxuLy8gU2NyYXBlciB0eXBlc1xuZXhwb3J0IGNvbnN0IFNDUkFQRVJfU09VUkNFUyA9IFtcbiAgICAnbGlua2VkaW4nLFxuICAgICdpbmRlZWQnLFxuICAgICdncmVlbmhvdXNlJyxcbiAgICAnbGV2ZXInLFxuICAgICd3YXRlcmxvb3dvcmtzJyxcbiAgICAndW5rbm93bicsXG5dO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1MgPSB7XG4gICAgYXV0b0ZpbGxFbmFibGVkOiB0cnVlLFxuICAgIHNob3dDb25maWRlbmNlSW5kaWNhdG9yczogdHJ1ZSxcbiAgICBtaW5pbXVtQ29uZmlkZW5jZTogMC41LFxuICAgIGxlYXJuRnJvbUFuc3dlcnM6IHRydWUsXG4gICAgYXV0b0RldGVjdFByb21wdHM6IHRydWUsXG4gICAgbm90aWZ5T25Kb2JEZXRlY3RlZDogdHJ1ZSxcbiAgICBzaG93U2FsYXJ5T3ZlcmxheTogdHJ1ZSxcbiAgICBlbmFibGVKb2JTY3JhcGluZzogdHJ1ZSxcbiAgICBlbmFibGVkU2NyYXBlclNvdXJjZXM6IFsuLi5TQ1JBUEVSX1NPVVJDRVNdLFxufTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0FQSV9CQVNFX1VSTCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xuIiwiLy8gRXh0ZW5zaW9uIHN0b3JhZ2UgdXRpbGl0aWVzXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBERUZBVUxUX0FQSV9CQVNFX1VSTCB9IGZyb20gJ0Avc2hhcmVkL3R5cGVzJztcbmNvbnN0IFNUT1JBR0VfS0VZID0gJ2NvbHVtYnVzX2V4dGVuc2lvbic7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VTZXR0aW5nc1dpdGhEZWZhdWx0cyhzZXR0aW5ncykge1xuICAgIHJldHVybiB7XG4gICAgICAgIC4uLkRFRkFVTFRfU0VUVElOR1MsXG4gICAgICAgIC4uLnNldHRpbmdzLFxuICAgIH07XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcmFnZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdG9yZWQgPSByZXN1bHRbU1RPUkFHRV9LRVldO1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgYXBpQmFzZVVybDogREVGQVVMVF9BUElfQkFTRV9VUkwsXG4gICAgICAgICAgICAgICAgLi4uc3RvcmVkLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBtZXJnZVNldHRpbmdzV2l0aERlZmF1bHRzKHN0b3JlZD8uc2V0dGluZ3MpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFN0b3JhZ2UodXBkYXRlcykge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBhd2FpdCBnZXRTdG9yYWdlKCk7XG4gICAgY29uc3QgdXBkYXRlZCA9IHsgLi4uY3VycmVudCwgLi4udXBkYXRlcyB9O1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbU1RPUkFHRV9LRVldOiB1cGRhdGVkIH0sIHJlc29sdmUpO1xuICAgIH0pO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyU3RvcmFnZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFNUT1JBR0VfS0VZLCByZXNvbHZlKTtcbiAgICB9KTtcbn1cbi8vIEF1dGggdG9rZW4gaGVscGVyc1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEF1dGhUb2tlbih0b2tlbiwgZXhwaXJlc0F0KSB7XG4gICAgYXdhaXQgc2V0U3RvcmFnZSh7XG4gICAgICAgIGF1dGhUb2tlbjogdG9rZW4sXG4gICAgICAgIHRva2VuRXhwaXJ5OiBleHBpcmVzQXQsXG4gICAgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJBdXRoVG9rZW4oKSB7XG4gICAgYXdhaXQgc2V0U3RvcmFnZSh7XG4gICAgICAgIGF1dGhUb2tlbjogdW5kZWZpbmVkLFxuICAgICAgICB0b2tlbkV4cGlyeTogdW5kZWZpbmVkLFxuICAgICAgICBjYWNoZWRQcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgIHByb2ZpbGVDYWNoZWRBdDogdW5kZWZpbmVkLFxuICAgIH0pO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEF1dGhUb2tlbigpIHtcbiAgICBjb25zdCBzdG9yYWdlID0gYXdhaXQgZ2V0U3RvcmFnZSgpO1xuICAgIGlmICghc3RvcmFnZS5hdXRoVG9rZW4pXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIC8vIENoZWNrIGV4cGlyeVxuICAgIGlmIChzdG9yYWdlLnRva2VuRXhwaXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cGlyeSA9IG5ldyBEYXRlKHN0b3JhZ2UudG9rZW5FeHBpcnkpO1xuICAgICAgICBpZiAoZXhwaXJ5IDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgICAgYXdhaXQgY2xlYXJBdXRoVG9rZW4oKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdG9yYWdlLmF1dGhUb2tlbjtcbn1cbi8vIFByb2ZpbGUgY2FjaGUgaGVscGVyc1xuY29uc3QgUFJPRklMRV9DQUNIRV9UVEwgPSA1ICogNjAgKiAxMDAwOyAvLyA1IG1pbnV0ZXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDYWNoZWRQcm9maWxlKCkge1xuICAgIGNvbnN0IHN0b3JhZ2UgPSBhd2FpdCBnZXRTdG9yYWdlKCk7XG4gICAgaWYgKCFzdG9yYWdlLmNhY2hlZFByb2ZpbGUgfHwgIXN0b3JhZ2UucHJvZmlsZUNhY2hlZEF0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjYWNoZWRBdCA9IG5ldyBEYXRlKHN0b3JhZ2UucHJvZmlsZUNhY2hlZEF0KTtcbiAgICBpZiAoRGF0ZS5ub3coKSAtIGNhY2hlZEF0LmdldFRpbWUoKSA+IFBST0ZJTEVfQ0FDSEVfVFRMKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBDYWNoZSBleHBpcmVkXG4gICAgfVxuICAgIHJldHVybiBzdG9yYWdlLmNhY2hlZFByb2ZpbGU7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0Q2FjaGVkUHJvZmlsZShwcm9maWxlKSB7XG4gICAgYXdhaXQgc2V0U3RvcmFnZSh7XG4gICAgICAgIGNhY2hlZFByb2ZpbGU6IHByb2ZpbGUsXG4gICAgICAgIHByb2ZpbGVDYWNoZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH0pO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyQ2FjaGVkUHJvZmlsZSgpIHtcbiAgICBhd2FpdCBzZXRTdG9yYWdlKHtcbiAgICAgICAgY2FjaGVkUHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICBwcm9maWxlQ2FjaGVkQXQ6IHVuZGVmaW5lZCxcbiAgICB9KTtcbn1cbi8vIFNldHRpbmdzIGhlbHBlcnNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXR0aW5ncygpIHtcbiAgICBjb25zdCBzdG9yYWdlID0gYXdhaXQgZ2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiBzdG9yYWdlLnNldHRpbmdzO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKHVwZGF0ZXMpIHtcbiAgICBjb25zdCBzdG9yYWdlID0gYXdhaXQgZ2V0U3RvcmFnZSgpO1xuICAgIGNvbnN0IHVwZGF0ZWQgPSBtZXJnZVNldHRpbmdzV2l0aERlZmF1bHRzKHsgLi4uc3RvcmFnZS5zZXR0aW5ncywgLi4udXBkYXRlcyB9KTtcbiAgICBhd2FpdCBzZXRTdG9yYWdlKHsgc2V0dGluZ3M6IHVwZGF0ZWQgfSk7XG4gICAgcmV0dXJuIHVwZGF0ZWQ7XG59XG4vLyBBUEkgVVJMIGhlbHBlclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEFwaUJhc2VVcmwodXJsKSB7XG4gICAgYXdhaXQgc2V0U3RvcmFnZSh7IGFwaUJhc2VVcmw6IHVybCB9KTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBcGlCYXNlVXJsKCkge1xuICAgIGNvbnN0IHN0b3JhZ2UgPSBhd2FpdCBnZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHN0b3JhZ2UuYXBpQmFzZVVybDtcbn1cbiIsIi8vIENvbHVtYnVzIEFQSSBjbGllbnQgZm9yIGV4dGVuc2lvblxuaW1wb3J0IHsgZ2V0U3RvcmFnZSwgc2V0U3RvcmFnZSB9IGZyb20gJy4vc3RvcmFnZSc7XG5leHBvcnQgY2xhc3MgQ29sdW1idXNBUElDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmwpIHtcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybC5yZXBsYWNlKC9cXC8kLywgJycpO1xuICAgIH1cbiAgICBhc3luYyBnZXRBdXRoVG9rZW4oKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBhd2FpdCBnZXRTdG9yYWdlKCk7XG4gICAgICAgIGlmICghc3RvcmFnZS5hdXRoVG9rZW4pXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgLy8gQ2hlY2sgZXhwaXJ5XG4gICAgICAgIGlmIChzdG9yYWdlLnRva2VuRXhwaXJ5KSB7XG4gICAgICAgICAgICBjb25zdCBleHBpcnkgPSBuZXcgRGF0ZShzdG9yYWdlLnRva2VuRXhwaXJ5KTtcbiAgICAgICAgICAgIGlmIChleHBpcnkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgLy8gVG9rZW4gZXhwaXJlZCwgY2xlYXIgaXRcbiAgICAgICAgICAgICAgICBhd2FpdCBzZXRTdG9yYWdlKHsgYXV0aFRva2VuOiB1bmRlZmluZWQsIHRva2VuRXhwaXJ5OiB1bmRlZmluZWQgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3JhZ2UuYXV0aFRva2VuO1xuICAgIH1cbiAgICBhc3luYyBhdXRoZW50aWNhdGVkRmV0Y2gocGF0aCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5nZXRBdXRoVG9rZW4oKTtcbiAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYXV0aGVudGljYXRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7dGhpcy5iYXNlVXJsfSR7cGF0aH1gLCB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ1gtRXh0ZW5zaW9uLVRva2VuJzogdG9rZW4sXG4gICAgICAgICAgICAgICAgLi4ub3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgIC8vIENsZWFyIGludmFsaWQgdG9rZW5cbiAgICAgICAgICAgICAgICBhd2FpdCBzZXRTdG9yYWdlKHsgYXV0aFRva2VuOiB1bmRlZmluZWQsIHRva2VuRXhwaXJ5OiB1bmRlZmluZWQgfSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdXRoZW50aWNhdGlvbiBleHBpcmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoeyBlcnJvcjogJ1JlcXVlc3QgZmFpbGVkJyB9KSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IuZXJyb3IgfHwgYFJlcXVlc3QgZmFpbGVkOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH1cbiAgICBhc3luYyBpc0F1dGhlbnRpY2F0ZWQoKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5nZXRBdXRoVG9rZW4oKTtcbiAgICAgICAgaWYgKCF0b2tlbilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXV0aGVudGljYXRlZEZldGNoKCcvYXBpL2V4dGVuc2lvbi9hdXRoL3ZlcmlmeScpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGdldFByb2ZpbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaCgnL2FwaS9leHRlbnNpb24vcHJvZmlsZScpO1xuICAgIH1cbiAgICBhc3luYyBpbXBvcnRKb2Ioam9iKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaCgnL2FwaS9vcHBvcnR1bml0aWVzL2Zyb20tZXh0ZW5zaW9uJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpvYi50aXRsZSxcbiAgICAgICAgICAgICAgICBjb21wYW55OiBqb2IuY29tcGFueSxcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogam9iLmxvY2F0aW9uLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBqb2IuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiBqb2IucmVxdWlyZW1lbnRzLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpYmlsaXRpZXM6IGpvYi5yZXNwb25zaWJpbGl0aWVzIHx8IFtdLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiBqb2Iua2V5d29yZHMgfHwgW10sXG4gICAgICAgICAgICAgICAgdHlwZTogam9iLnR5cGUsXG4gICAgICAgICAgICAgICAgcmVtb3RlOiBqb2IucmVtb3RlLFxuICAgICAgICAgICAgICAgIHNhbGFyeTogam9iLnNhbGFyeSxcbiAgICAgICAgICAgICAgICB1cmw6IGpvYi51cmwsXG4gICAgICAgICAgICAgICAgc291cmNlOiBqb2Iuc291cmNlLFxuICAgICAgICAgICAgICAgIHNvdXJjZUpvYklkOiBqb2Iuc291cmNlSm9iSWQsXG4gICAgICAgICAgICAgICAgcG9zdGVkQXQ6IGpvYi5wb3N0ZWRBdCxcbiAgICAgICAgICAgICAgICBkZWFkbGluZTogam9iLmRlYWRsaW5lLFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBpbXBvcnRKb2JzQmF0Y2goam9icykge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkRmV0Y2goJy9hcGkvb3Bwb3J0dW5pdGllcy9mcm9tLWV4dGVuc2lvbicsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBqb2JzIH0pLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgc2F2ZUxlYXJuZWRBbnN3ZXIoZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkRmV0Y2goJy9hcGkvZXh0ZW5zaW9uL2xlYXJuZWQtYW5zd2VycycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBzZWFyY2hTaW1pbGFyQW5zd2VycyhxdWVzdGlvbikge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXV0aGVudGljYXRlZEZldGNoKCcvYXBpL2V4dGVuc2lvbi9sZWFybmVkLWFuc3dlcnMvc2VhcmNoJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHF1ZXN0aW9uIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgfVxuICAgIGFzeW5jIGdldExlYXJuZWRBbnN3ZXJzKCkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXV0aGVudGljYXRlZEZldGNoKCcvYXBpL2V4dGVuc2lvbi9sZWFybmVkLWFuc3dlcnMnKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmFuc3dlcnM7XG4gICAgfVxuICAgIGFzeW5jIGRlbGV0ZUxlYXJuZWRBbnN3ZXIoaWQpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hdXRoZW50aWNhdGVkRmV0Y2goYC9hcGkvZXh0ZW5zaW9uL2xlYXJuZWQtYW5zd2Vycy8ke2lkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyB1cGRhdGVMZWFybmVkQW5zd2VyKGlkLCBhbnN3ZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRlZEZldGNoKGAvYXBpL2V4dGVuc2lvbi9sZWFybmVkLWFuc3dlcnMvJHtpZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFuc3dlciB9KSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLy8gU2luZ2xldG9uIGluc3RhbmNlXG5sZXQgY2xpZW50ID0gbnVsbDtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBUElDbGllbnQoKSB7XG4gICAgaWYgKCFjbGllbnQpIHtcbiAgICAgICAgY29uc3Qgc3RvcmFnZSA9IGF3YWl0IGdldFN0b3JhZ2UoKTtcbiAgICAgICAgY2xpZW50ID0gbmV3IENvbHVtYnVzQVBJQ2xpZW50KHN0b3JhZ2UuYXBpQmFzZVVybCk7XG4gICAgfVxuICAgIHJldHVybiBjbGllbnQ7XG59XG5leHBvcnQgZnVuY3Rpb24gcmVzZXRBUElDbGllbnQoKSB7XG4gICAgY2xpZW50ID0gbnVsbDtcbn1cbiIsIi8vIEJhY2tncm91bmQgc2VydmljZSB3b3JrZXIgZm9yIENvbHVtYnVzIGV4dGVuc2lvblxuaW1wb3J0IHsgZ2V0QVBJQ2xpZW50LCByZXNldEFQSUNsaWVudCB9IGZyb20gJy4vYXBpLWNsaWVudCc7XG5pbXBvcnQgeyBzZXRBdXRoVG9rZW4sIGNsZWFyQXV0aFRva2VuLCBnZXRDYWNoZWRQcm9maWxlLCBzZXRDYWNoZWRQcm9maWxlLCBnZXRBcGlCYXNlVXJsLCB9IGZyb20gJy4vc3RvcmFnZSc7XG4vLyBIYW5kbGUgbWVzc2FnZXMgZnJvbSBjb250ZW50IHNjcmlwdHMgYW5kIHBvcHVwXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgaGFuZGxlTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIpXG4gICAgICAgIC50aGVuKHNlbmRSZXNwb25zZSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdbQ29sdW1idXNdIE1lc3NhZ2UgaGFuZGxlciBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9KTtcbiAgICB9KTtcbiAgICAvLyBSZXR1cm4gdHJ1ZSB0byBpbmRpY2F0ZSBhc3luYyByZXNwb25zZVxuICAgIHJldHVybiB0cnVlO1xufSk7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKG1lc3NhZ2UsIHNlbmRlcikge1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ0dFVF9BVVRIX1NUQVRVUyc6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlR2V0QXV0aFN0YXR1cygpO1xuICAgICAgICBjYXNlICdPUEVOX0FVVEgnOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZU9wZW5BdXRoKCk7XG4gICAgICAgIGNhc2UgJ0xPR09VVCc6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlTG9nb3V0KCk7XG4gICAgICAgIGNhc2UgJ0dFVF9QUk9GSUxFJzpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVHZXRQcm9maWxlKCk7XG4gICAgICAgIGNhc2UgJ0lNUE9SVF9KT0InOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUltcG9ydEpvYihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICBjYXNlICdJTVBPUlRfSk9CU19CQVRDSCc6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlSW1wb3J0Sm9ic0JhdGNoKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgIGNhc2UgJ1NBVkVfQU5TV0VSJzpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVTYXZlQW5zd2VyKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgIGNhc2UgJ1NFQVJDSF9BTlNXRVJTJzpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVTZWFyY2hBbnN3ZXJzKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgIGNhc2UgJ0dFVF9MRUFSTkVEX0FOU1dFUlMnOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUdldExlYXJuZWRBbnN3ZXJzKCk7XG4gICAgICAgIGNhc2UgJ0RFTEVURV9BTlNXRVInOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZURlbGV0ZUFuc3dlcihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBtZXNzYWdlIHR5cGU6ICR7bWVzc2FnZS50eXBlfWAgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHZXRBdXRoU3RhdHVzKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldEFQSUNsaWVudCgpO1xuICAgICAgICBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSBhd2FpdCBjbGllbnQuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgIGNvbnN0IGFwaUJhc2VVcmwgPSBhd2FpdCBnZXRBcGlCYXNlVXJsKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogeyBpc0F1dGhlbnRpY2F0ZWQsIGFwaUJhc2VVcmwgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogeyBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLCBhcGlCYXNlVXJsOiBhd2FpdCBnZXRBcGlCYXNlVXJsKCkgfSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVPcGVuQXV0aCgpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBhcGlCYXNlVXJsID0gYXdhaXQgZ2V0QXBpQmFzZVVybCgpO1xuICAgICAgICBjb25zdCBhdXRoVXJsID0gYCR7YXBpQmFzZVVybH0vZXh0ZW5zaW9uL2Nvbm5lY3RgO1xuICAgICAgICAvLyBPcGVuIGF1dGggcGFnZSBpbiBuZXcgdGFiXG4gICAgICAgIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogYXV0aFVybCB9KTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlTG9nb3V0KCkge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNsZWFyQXV0aFRva2VuKCk7XG4gICAgICAgIHJlc2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9O1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdldFByb2ZpbGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gQ2hlY2sgY2FjaGUgZmlyc3RcbiAgICAgICAgY29uc3QgY2FjaGVkID0gYXdhaXQgZ2V0Q2FjaGVkUHJvZmlsZSgpO1xuICAgICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBjYWNoZWQgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGZXRjaCBmcm9tIEFQSVxuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IGNsaWVudC5nZXRQcm9maWxlKCk7XG4gICAgICAgIC8vIENhY2hlIHRoZSBwcm9maWxlXG4gICAgICAgIGF3YWl0IHNldENhY2hlZFByb2ZpbGUocHJvZmlsZSk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHByb2ZpbGUgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9O1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUltcG9ydEpvYihqb2IpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2xpZW50LmltcG9ydEpvYihqb2IpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9O1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUltcG9ydEpvYnNCYXRjaChqb2JzKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsaWVudC5pbXBvcnRKb2JzQmF0Y2goam9icyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdCB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlU2F2ZUFuc3dlcihkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsaWVudC5zYXZlTGVhcm5lZEFuc3dlcih7XG4gICAgICAgICAgICBxdWVzdGlvbjogZGF0YS5xdWVzdGlvbixcbiAgICAgICAgICAgIGFuc3dlcjogZGF0YS5hbnN3ZXIsXG4gICAgICAgICAgICBzb3VyY2VVcmw6IGRhdGEudXJsLFxuICAgICAgICAgICAgc291cmNlQ29tcGFueTogZGF0YS5jb21wYW55LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0IH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTZWFyY2hBbnN3ZXJzKHF1ZXN0aW9uKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjbGllbnQuc2VhcmNoU2ltaWxhckFuc3dlcnMocXVlc3Rpb24pO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHRzIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHZXRMZWFybmVkQW5zd2VycygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGNsaWVudC5nZXRMZWFybmVkQW5zd2VycygpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBhbnN3ZXJzIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVEZWxldGVBbnN3ZXIoaWQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgYXdhaXQgY2xpZW50LmRlbGV0ZUxlYXJuZWRBbnN3ZXIoaWQpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG4vLyBIYW5kbGUgYXV0aCBjYWxsYmFjayBmcm9tIENvbHVtYnVzIHdlYiBhcHBcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdBVVRIX0NBTExCQUNLJyAmJiBtZXNzYWdlLnRva2VuICYmIG1lc3NhZ2UuZXhwaXJlc0F0KSB7XG4gICAgICAgIHNldEF1dGhUb2tlbihtZXNzYWdlLnRva2VuLCBtZXNzYWdlLmV4cGlyZXNBdClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJlc2V0QVBJQ2xpZW50KCk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG4vLyBIYW5kbGUga2V5Ym9hcmQgc2hvcnRjdXRzXG5jaHJvbWUuY29tbWFuZHMub25Db21tYW5kLmFkZExpc3RlbmVyKGFzeW5jIChjb21tYW5kKSA9PiB7XG4gICAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgICBpZiAoIXRhYj8uaWQpXG4gICAgICAgIHJldHVybjtcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcbiAgICAgICAgY2FzZSAnZmlsbC1mb3JtJzpcbiAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgeyB0eXBlOiAnVFJJR0dFUl9GSUxMJyB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpbXBvcnQtam9iJzpcbiAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgeyB0eXBlOiAnVFJJR0dFUl9JTVBPUlQnIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG4vLyBIYW5kbGUgZXh0ZW5zaW9uIGluc3RhbGwvdXBkYXRlXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoZGV0YWlscykgPT4ge1xuICAgIGlmIChkZXRhaWxzLnJlYXNvbiA9PT0gJ2luc3RhbGwnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbQ29sdW1idXNdIEV4dGVuc2lvbiBpbnN0YWxsZWQnKTtcbiAgICAgICAgLy8gQ291bGQgb3BlbiBvbmJvYXJkaW5nIHBhZ2UgaGVyZVxuICAgIH1cbiAgICBlbHNlIGlmIChkZXRhaWxzLnJlYXNvbiA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tDb2x1bWJ1c10gRXh0ZW5zaW9uIHVwZGF0ZWQgdG8nLCBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb24pO1xuICAgIH1cbn0pO1xuY29uc29sZS5sb2coJ1tDb2x1bWJ1c10gQmFja2dyb3VuZCBzZXJ2aWNlIHdvcmtlciBzdGFydGVkJyk7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9