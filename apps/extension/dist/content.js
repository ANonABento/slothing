/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/shared/field-patterns.ts
// Field detection patterns for auto-fill
const FIELD_PATTERNS = [
    // Name fields
    {
        type: 'firstName',
        autocompleteValues: ['given-name', 'first-name'],
        namePatterns: [/first.?name/i, /fname/i, /given.?name/i, /forename/i],
        idPatterns: [/first.?name/i, /fname/i],
        labelPatterns: [/first\s*name/i, /given\s*name/i, /forename/i],
        placeholderPatterns: [/first\s*name/i],
        negativePatterns: [/last/i, /company/i, /middle/i, /business/i],
    },
    {
        type: 'lastName',
        autocompleteValues: ['family-name', 'last-name'],
        namePatterns: [/last.?name/i, /lname/i, /surname/i, /family.?name/i],
        idPatterns: [/last.?name/i, /lname/i, /surname/i],
        labelPatterns: [/last\s*name/i, /surname/i, /family\s*name/i],
        negativePatterns: [/first/i, /company/i, /business/i],
    },
    {
        type: 'fullName',
        autocompleteValues: ['name'],
        namePatterns: [/^name$/i, /full.?name/i, /your.?name/i, /candidate.?name/i],
        labelPatterns: [/^name$/i, /full\s*name/i, /your\s*name/i, /^name\s*\*/i],
        negativePatterns: [/company/i, /first/i, /last/i, /user/i, /business/i, /job/i],
    },
    // Contact fields
    {
        type: 'email',
        autocompleteValues: ['email'],
        namePatterns: [/e?-?mail/i, /email.?address/i],
        idPatterns: [/e?-?mail/i],
        labelPatterns: [/e-?mail/i, /email\s*address/i],
        placeholderPatterns: [/e-?mail/i, /@/],
    },
    {
        type: 'phone',
        autocompleteValues: ['tel', 'tel-national', 'tel-local'],
        namePatterns: [/phone/i, /mobile/i, /cell/i, /tel(?:ephone)?/i],
        labelPatterns: [/phone/i, /mobile/i, /cell/i, /telephone/i, /contact\s*number/i],
    },
    {
        type: 'address',
        autocompleteValues: ['street-address', 'address-line1'],
        namePatterns: [/address/i, /street/i],
        labelPatterns: [/address/i, /street/i],
        negativePatterns: [/email/i, /web/i, /url/i],
    },
    {
        type: 'city',
        autocompleteValues: ['address-level2'],
        namePatterns: [/city/i, /town/i],
        labelPatterns: [/city/i, /town/i],
    },
    {
        type: 'state',
        autocompleteValues: ['address-level1'],
        namePatterns: [/state/i, /province/i, /region/i],
        labelPatterns: [/state/i, /province/i, /region/i],
    },
    {
        type: 'zipCode',
        autocompleteValues: ['postal-code'],
        namePatterns: [/zip/i, /postal/i, /postcode/i],
        labelPatterns: [/zip/i, /postal/i, /post\s*code/i],
    },
    {
        type: 'country',
        autocompleteValues: ['country', 'country-name'],
        namePatterns: [/country/i],
        labelPatterns: [/country/i],
    },
    // Social/Professional links
    {
        type: 'linkedin',
        namePatterns: [/linkedin/i],
        labelPatterns: [/linkedin/i],
        placeholderPatterns: [/linkedin\.com/i, /linkedin/i],
    },
    {
        type: 'github',
        namePatterns: [/github/i],
        labelPatterns: [/github/i],
        placeholderPatterns: [/github\.com/i, /github/i],
    },
    {
        type: 'website',
        autocompleteValues: ['url'],
        namePatterns: [/website/i, /portfolio/i, /personal.?site/i, /blog/i],
        labelPatterns: [/website/i, /portfolio/i, /personal\s*(site|url)/i],
        negativePatterns: [/linkedin/i, /github/i, /company/i],
    },
    // Employment fields
    {
        type: 'currentCompany',
        autocompleteValues: ['organization'],
        namePatterns: [/current.?company/i, /employer/i, /company.?name/i, /organization/i],
        labelPatterns: [/current\s*(company|employer)/i, /company\s*name/i, /employer/i],
        negativePatterns: [/previous/i, /past/i, /former/i],
    },
    {
        type: 'currentTitle',
        autocompleteValues: ['organization-title'],
        namePatterns: [/current.?title/i, /job.?title/i, /position/i, /role/i],
        labelPatterns: [/current\s*(title|position|role)/i, /job\s*title/i],
        negativePatterns: [/previous/i, /past/i, /desired/i, /applying/i],
    },
    {
        type: 'yearsExperience',
        namePatterns: [/years?.?(of)?.?experience/i, /experience.?years/i, /yoe/i],
        labelPatterns: [/years?\s*(of\s*)?experience/i, /total\s*experience/i, /how\s*many\s*years/i],
    },
    // Education fields
    {
        type: 'school',
        namePatterns: [/school/i, /university/i, /college/i, /institution/i, /alma.?mater/i],
        labelPatterns: [/school/i, /university/i, /college/i, /institution/i],
        negativePatterns: [/high\s*school/i],
    },
    {
        type: 'degree',
        namePatterns: [/degree/i, /qualification/i],
        labelPatterns: [/degree/i, /qualification/i, /level\s*of\s*education/i],
    },
    {
        type: 'fieldOfStudy',
        namePatterns: [/field.?of.?study/i, /major/i, /concentration/i, /specialization/i],
        labelPatterns: [/field\s*of\s*study/i, /major/i, /area\s*of\s*study/i],
    },
    {
        type: 'graduationYear',
        namePatterns: [/graduation.?(year|date)/i, /grad.?year/i],
        labelPatterns: [/graduation\s*(year|date)/i, /year\s*of\s*graduation/i, /when\s*did\s*you\s*graduate/i],
    },
    {
        type: 'gpa',
        namePatterns: [/gpa/i, /grade.?point/i, /cgpa/i],
        labelPatterns: [/gpa/i, /grade\s*point/i, /cumulative\s*gpa/i],
    },
    // Documents
    {
        type: 'resume',
        namePatterns: [/resume/i, /cv/i, /curriculum.?vitae/i],
        labelPatterns: [/resume/i, /cv/i, /curriculum\s*vitae/i, /upload\s*(your\s*)?resume/i],
    },
    {
        type: 'coverLetter',
        namePatterns: [/cover.?letter/i, /motivation.?letter/i],
        labelPatterns: [/cover\s*letter/i, /motivation\s*letter/i],
    },
    // Compensation
    {
        type: 'salary',
        namePatterns: [/salary/i, /compensation/i, /pay/i, /wage/i],
        labelPatterns: [/salary/i, /compensation/i, /expected\s*(salary|pay)/i, /desired\s*salary/i],
    },
    // Availability
    {
        type: 'startDate',
        namePatterns: [/start.?date/i, /available.?date/i, /earliest.?start/i],
        labelPatterns: [/start\s*date/i, /when\s*can\s*you\s*start/i, /earliest\s*start/i, /availability/i],
        negativePatterns: [/end/i, /finish/i],
    },
    // Legal/Compliance
    {
        type: 'workAuthorization',
        namePatterns: [/work.?auth/i, /authorized.?to.?work/i, /legally.?work/i, /work.?permit/i, /visa.?status/i],
        labelPatterns: [/authorized\s*to\s*work/i, /legally\s*(authorized|permitted)/i, /work\s*authorization/i, /right\s*to\s*work/i],
    },
    {
        type: 'sponsorship',
        namePatterns: [/sponsor/i, /visa.?sponsor/i],
        labelPatterns: [/sponsor/i, /visa\s*sponsor/i, /require\s*sponsorship/i, /need\s*sponsorship/i],
    },
    // EEO fields
    {
        type: 'veteranStatus',
        namePatterns: [/veteran/i, /military/i],
        labelPatterns: [/veteran/i, /military\s*status/i, /served\s*in/i],
    },
    {
        type: 'disability',
        namePatterns: [/disability/i, /disabled/i],
        labelPatterns: [/disability/i, /disabled/i, /accommodation/i],
    },
    {
        type: 'gender',
        namePatterns: [/gender/i, /sex/i],
        labelPatterns: [/gender/i, /sex/i],
        negativePatterns: [/identity/i],
    },
    {
        type: 'ethnicity',
        namePatterns: [/ethnicity/i, /race/i, /ethnic/i],
        labelPatterns: [/ethnicity/i, /race/i, /ethnic\s*background/i],
    },
    // Skills
    {
        type: 'skills',
        namePatterns: [/skills?/i, /expertise/i, /competenc/i],
        labelPatterns: [/skills?/i, /technical\s*skills/i, /key\s*skills/i],
    },
    // Summary/Bio
    {
        type: 'summary',
        namePatterns: [/summary/i, /bio/i, /about.?you/i, /profile/i, /introduction/i],
        labelPatterns: [/summary/i, /professional\s*summary/i, /about\s*you/i, /tell\s*us\s*about/i, /bio/i],
        negativePatterns: [/job/i, /position/i],
    },
];
// Job site URL patterns for scraper detection
const JOB_SITE_PATTERNS = {
    linkedin: [
        /linkedin\.com\/jobs\/view\//,
        /linkedin\.com\/jobs\/search/,
        /linkedin\.com\/jobs\/collections/,
    ],
    indeed: [
        /indeed\.com\/viewjob/,
        /indeed\.com\/jobs/,
        /indeed\.com\/cmp\/.+\/jobs/,
    ],
    greenhouse: [
        /boards\.greenhouse\.io\//,
        /greenhouse\.io\/.*\/jobs\//,
    ],
    lever: [
        /jobs\.lever\.co\//,
        /lever\.co\/.*\/jobs\//,
    ],
    waterlooWorks: [
        /waterlooworks\.uwaterloo\.ca/,
    ],
    workday: [
        /myworkdayjobs\.com/,
        /workdayjobs\.com/,
    ],
};
function detectJobSite(url) {
    for (const [site, patterns] of Object.entries(JOB_SITE_PATTERNS)) {
        if (patterns.some(p => p.test(url))) {
            return site;
        }
    }
    return 'unknown';
}
// Common question patterns for learning system
const CUSTOM_QUESTION_INDICATORS = [
    /why.*(want|interested|apply|join)/i,
    /what.*(makes|attracted|excites)/i,
    /tell.*about.*yourself/i,
    /describe.*(situation|time|experience)/i,
    /how.*handle/i,
    /greatest.*(strength|weakness|achievement)/i,
    /where.*see.*yourself/i,
    /why.*should.*hire/i,
    /what.*contribute/i,
    /salary.*expectation/i,
    /additional.*information/i,
    /anything.*else/i,
];

;// ./src/content/auto-fill/field-detector.ts
// Field detection for auto-fill

class FieldDetector {
    detectFields(form) {
        const fields = [];
        const inputs = form.querySelectorAll('input, textarea, select');
        for (const input of inputs) {
            const element = input;
            // Skip hidden, disabled, or submit inputs
            if (this.shouldSkipElement(element))
                continue;
            const detection = this.detectFieldType(element);
            if (detection.fieldType !== 'unknown' || detection.confidence > 0.1) {
                fields.push(detection);
            }
        }
        return fields;
    }
    shouldSkipElement(element) {
        const input = element;
        // Check computed style for visibility
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
            return true;
        }
        // Check disabled state
        if (input.disabled)
            return true;
        // Check input type
        const skipTypes = ['hidden', 'submit', 'button', 'reset', 'image', 'file'];
        if (skipTypes.includes(input.type))
            return true;
        // Check if it's a CSRF/token field
        if (input.name?.includes('csrf') || input.name?.includes('token')) {
            return true;
        }
        return false;
    }
    detectFieldType(element) {
        const signals = this.gatherSignals(element);
        const scores = this.scoreAllPatterns(signals);
        // Get best match
        scores.sort((a, b) => b.confidence - a.confidence);
        const best = scores[0];
        // Determine if this is a custom question
        let fieldType = best?.fieldType || 'unknown';
        let confidence = best?.confidence || 0;
        if (confidence < 0.3) {
            // Check if it looks like a custom question
            if (this.looksLikeCustomQuestion(signals)) {
                fieldType = 'customQuestion';
                confidence = 0.5;
            }
        }
        return {
            element,
            fieldType,
            confidence,
            label: signals.label || undefined,
            placeholder: signals.placeholder || undefined,
        };
    }
    gatherSignals(element) {
        return {
            name: element.name?.toLowerCase() || '',
            id: element.id?.toLowerCase() || '',
            type: element.type || 'text',
            placeholder: element.placeholder?.toLowerCase() || '',
            autocomplete: element.autocomplete || '',
            label: this.findLabel(element)?.toLowerCase() || '',
            ariaLabel: element.getAttribute('aria-label')?.toLowerCase() || '',
            nearbyText: this.getNearbyText(element)?.toLowerCase() || '',
            parentClasses: this.getParentClasses(element),
        };
    }
    scoreAllPatterns(signals) {
        return FIELD_PATTERNS.map((pattern) => ({
            fieldType: pattern.type,
            confidence: this.calculateConfidence(signals, pattern),
        }));
    }
    calculateConfidence(signals, pattern) {
        let score = 0;
        let maxScore = 0;
        // Weight different signals
        const weights = {
            autocomplete: 0.4,
            name: 0.2,
            id: 0.15,
            label: 0.15,
            placeholder: 0.1,
            ariaLabel: 0.1,
        };
        // Check autocomplete attribute (most reliable)
        if (signals.autocomplete && pattern.autocompleteValues?.includes(signals.autocomplete)) {
            score += weights.autocomplete;
        }
        maxScore += weights.autocomplete;
        // Check name attribute
        if (pattern.namePatterns?.some((p) => p.test(signals.name))) {
            score += weights.name;
        }
        maxScore += weights.name;
        // Check ID
        if (pattern.idPatterns?.some((p) => p.test(signals.id))) {
            score += weights.id;
        }
        maxScore += weights.id;
        // Check label
        if (pattern.labelPatterns?.some((p) => p.test(signals.label))) {
            score += weights.label;
        }
        maxScore += weights.label;
        // Check placeholder
        if (pattern.placeholderPatterns?.some((p) => p.test(signals.placeholder))) {
            score += weights.placeholder;
        }
        maxScore += weights.placeholder;
        // Check aria-label
        if (pattern.labelPatterns?.some((p) => p.test(signals.ariaLabel))) {
            score += weights.ariaLabel;
        }
        maxScore += weights.ariaLabel;
        // Negative signals (reduce confidence if found)
        if (pattern.negativePatterns?.some((p) => p.test(signals.name) || p.test(signals.label) || p.test(signals.id))) {
            score -= 0.3;
        }
        return Math.max(0, maxScore > 0 ? score / maxScore : 0);
    }
    findLabel(element) {
        // Method 1: Explicit label via for attribute
        if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            if (label?.textContent)
                return label.textContent.trim();
        }
        // Method 2: Wrapping label
        const parentLabel = element.closest('label');
        if (parentLabel?.textContent) {
            // Remove the input's value from label text
            const text = parentLabel.textContent.trim();
            const inputValue = element.value || '';
            return text.replace(inputValue, '').trim();
        }
        // Method 3: aria-labelledby
        const labelledBy = element.getAttribute('aria-labelledby');
        if (labelledBy) {
            const labelEl = document.getElementById(labelledBy);
            if (labelEl?.textContent)
                return labelEl.textContent.trim();
        }
        // Method 4: Previous sibling label
        let sibling = element.previousElementSibling;
        while (sibling) {
            if (sibling.tagName === 'LABEL') {
                return sibling.textContent?.trim() || null;
            }
            sibling = sibling.previousElementSibling;
        }
        // Method 5: Parent's previous sibling label
        const parent = element.parentElement;
        if (parent) {
            let parentSibling = parent.previousElementSibling;
            if (parentSibling?.tagName === 'LABEL') {
                return parentSibling.textContent?.trim() || null;
            }
        }
        return null;
    }
    getNearbyText(element) {
        const parent = element.closest('.form-group, .field, .input-wrapper, [class*="field"], [class*="input"]');
        if (parent) {
            const text = parent.textContent?.trim();
            if (text && text.length < 200)
                return text;
        }
        return null;
    }
    getParentClasses(element) {
        const classes = [];
        let current = element.parentElement;
        let depth = 0;
        while (current && depth < 3) {
            if (current.className) {
                classes.push(...current.className.split(' ').filter(Boolean));
            }
            current = current.parentElement;
            depth++;
        }
        return classes;
    }
    looksLikeCustomQuestion(signals) {
        const text = `${signals.label} ${signals.placeholder} ${signals.nearbyText}`;
        return CUSTOM_QUESTION_INDICATORS.some((pattern) => pattern.test(text));
    }
}

;// ./src/content/auto-fill/field-mapper.ts
// Field-to-profile value mapping
class FieldMapper {
    constructor(profile) {
        this.profile = profile;
    }
    mapFieldToValue(field) {
        const fieldType = field.fieldType;
        const mapping = this.getMappings();
        const mapper = mapping[fieldType];
        if (mapper) {
            return mapper();
        }
        return null;
    }
    getMappings() {
        const p = this.profile;
        const c = p.computed;
        return {
            // Name fields
            firstName: () => c?.firstName || null,
            lastName: () => c?.lastName || null,
            fullName: () => p.contact?.name || null,
            // Contact fields
            email: () => p.contact?.email || null,
            phone: () => p.contact?.phone || null,
            address: () => p.contact?.location || null,
            city: () => this.extractCity(p.contact?.location),
            state: () => this.extractState(p.contact?.location),
            zipCode: () => null, // Not typically stored
            country: () => this.extractCountry(p.contact?.location),
            // Social/Professional
            linkedin: () => p.contact?.linkedin || null,
            github: () => p.contact?.github || null,
            website: () => p.contact?.website || null,
            portfolio: () => p.contact?.website || null,
            // Employment
            currentCompany: () => c?.currentCompany || null,
            currentTitle: () => c?.currentTitle || null,
            yearsExperience: () => c?.yearsExperience?.toString() || null,
            // Education
            school: () => c?.mostRecentSchool || null,
            education: () => this.formatEducation(),
            degree: () => c?.mostRecentDegree || null,
            fieldOfStudy: () => c?.mostRecentField || null,
            graduationYear: () => c?.graduationYear || null,
            gpa: () => p.education?.[0]?.gpa || null,
            // Documents (return null, handled separately)
            resume: () => null,
            coverLetter: () => null,
            // Compensation
            salary: () => null, // User-specific, don't auto-fill
            salaryExpectation: () => null,
            // Availability
            startDate: () => null, // User-specific
            availability: () => null,
            // Work authorization (sensitive, don't auto-fill)
            workAuthorization: () => null,
            sponsorship: () => null,
            // EEO fields (sensitive, don't auto-fill)
            veteranStatus: () => null,
            disability: () => null,
            gender: () => null,
            ethnicity: () => null,
            // Skills/Summary
            skills: () => c?.skillsList || null,
            summary: () => p.summary || null,
            experience: () => this.formatExperience(),
            // Custom/Unknown (handled by learning system)
            customQuestion: () => null,
            unknown: () => null,
        };
    }
    extractCity(location) {
        if (!location)
            return null;
        // Common pattern: "City, State" or "City, State, Country"
        const parts = location.split(',').map((p) => p.trim());
        return parts[0] || null;
    }
    extractState(location) {
        if (!location)
            return null;
        const parts = location.split(',').map((p) => p.trim());
        if (parts.length >= 2) {
            // Handle "CA" or "California" or "CA 94105"
            const state = parts[1].split(' ')[0];
            return state || null;
        }
        return null;
    }
    extractCountry(location) {
        if (!location)
            return null;
        const parts = location.split(',').map((p) => p.trim());
        if (parts.length >= 3) {
            return parts[parts.length - 1];
        }
        // Default to USA if only city/state
        if (parts.length === 2) {
            return 'United States';
        }
        return null;
    }
    formatEducation() {
        const edu = this.profile.education?.[0];
        if (!edu)
            return null;
        return `${edu.degree} in ${edu.field} from ${edu.institution}`;
    }
    formatExperience() {
        const exps = this.profile.experiences;
        if (!exps || exps.length === 0)
            return null;
        return exps
            .slice(0, 3)
            .map((exp) => {
            const period = exp.current
                ? `${exp.startDate} - Present`
                : `${exp.startDate} - ${exp.endDate}`;
            return `${exp.title} at ${exp.company} (${period})`;
        })
            .join('\n');
    }
    // Get all mapped values for a form
    getAllMappedValues(fields) {
        const values = new Map();
        for (const field of fields) {
            const value = this.mapFieldToValue(field);
            if (value) {
                values.set(field.element, value);
            }
        }
        return values;
    }
}

;// ./src/content/auto-fill/engine.ts
// Auto-fill engine orchestrator
class AutoFillEngine {
    constructor(detector, mapper) {
        this.detector = detector;
        this.mapper = mapper;
    }
    async fillForm(fields) {
        const result = {
            filled: 0,
            skipped: 0,
            errors: 0,
            details: [],
        };
        for (const field of fields) {
            try {
                const value = this.mapper.mapFieldToValue(field);
                if (!value) {
                    result.skipped++;
                    result.details.push({
                        fieldType: field.fieldType,
                        filled: false,
                    });
                    continue;
                }
                const filled = await this.fillField(field.element, value);
                if (filled) {
                    result.filled++;
                    result.details.push({
                        fieldType: field.fieldType,
                        filled: true,
                    });
                }
                else {
                    result.skipped++;
                    result.details.push({
                        fieldType: field.fieldType,
                        filled: false,
                    });
                }
            }
            catch (err) {
                result.errors++;
                result.details.push({
                    fieldType: field.fieldType,
                    filled: false,
                    error: err.message,
                });
            }
        }
        return result;
    }
    async fillField(element, value) {
        const tagName = element.tagName.toLowerCase();
        const inputType = element.type?.toLowerCase() || 'text';
        // Handle different input types
        if (tagName === 'select') {
            return this.fillSelect(element, value);
        }
        if (tagName === 'textarea') {
            return this.fillTextInput(element, value);
        }
        if (tagName === 'input') {
            switch (inputType) {
                case 'text':
                case 'email':
                case 'tel':
                case 'url':
                case 'number':
                    return this.fillTextInput(element, value);
                case 'checkbox':
                    return this.fillCheckbox(element, value);
                case 'radio':
                    return this.fillRadio(element, value);
                case 'date':
                    return this.fillDateInput(element, value);
                default:
                    return this.fillTextInput(element, value);
            }
        }
        return false;
    }
    fillTextInput(element, value) {
        // Focus the element
        element.focus();
        // Clear existing value
        element.value = '';
        // Set new value
        element.value = value;
        // Dispatch events to trigger validation and frameworks
        this.dispatchInputEvents(element);
        return element.value === value;
    }
    fillSelect(element, value) {
        const options = Array.from(element.options);
        const normalizedValue = value.toLowerCase();
        // Try exact match first
        let matchingOption = options.find((opt) => opt.value.toLowerCase() === normalizedValue || opt.text.toLowerCase() === normalizedValue);
        // Try partial match
        if (!matchingOption) {
            matchingOption = options.find((opt) => opt.value.toLowerCase().includes(normalizedValue) ||
                opt.text.toLowerCase().includes(normalizedValue) ||
                normalizedValue.includes(opt.value.toLowerCase()) ||
                normalizedValue.includes(opt.text.toLowerCase()));
        }
        if (matchingOption) {
            element.value = matchingOption.value;
            this.dispatchInputEvents(element);
            return true;
        }
        return false;
    }
    fillCheckbox(element, value) {
        const shouldCheck = ['true', 'yes', '1', 'on'].includes(value.toLowerCase());
        element.checked = shouldCheck;
        this.dispatchInputEvents(element);
        return true;
    }
    fillRadio(element, value) {
        const normalizedValue = value.toLowerCase();
        // Find the radio group
        const name = element.name;
        if (!name)
            return false;
        const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
        for (const radio of radios) {
            const radioInput = radio;
            const radioValue = radioInput.value.toLowerCase();
            const radioLabel = this.getRadioLabel(radioInput)?.toLowerCase() || '';
            if (radioValue === normalizedValue ||
                radioLabel.includes(normalizedValue) ||
                normalizedValue.includes(radioValue)) {
                radioInput.checked = true;
                this.dispatchInputEvents(radioInput);
                return true;
            }
        }
        return false;
    }
    fillDateInput(element, value) {
        // Try to parse and format the date
        const date = new Date(value);
        if (isNaN(date.getTime()))
            return false;
        // Format as YYYY-MM-DD for date input
        const formatted = date.toISOString().split('T')[0];
        element.value = formatted;
        this.dispatchInputEvents(element);
        return true;
    }
    getRadioLabel(radio) {
        // Check for associated label
        if (radio.id) {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (label)
                return label.textContent?.trim() || null;
        }
        // Check for wrapping label
        const parent = radio.closest('label');
        if (parent) {
            return parent.textContent?.trim() || null;
        }
        // Check for next sibling text
        const next = radio.nextSibling;
        if (next?.nodeType === Node.TEXT_NODE) {
            return next.textContent?.trim() || null;
        }
        return null;
    }
    dispatchInputEvents(element) {
        // Dispatch events in order that most frameworks expect
        element.dispatchEvent(new Event('focus', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        // For React controlled components
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (nativeInputValueSetter && element instanceof HTMLInputElement) {
            const value = element.value;
            nativeInputValueSetter.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

;// ./src/content/scrapers/base-scraper.ts
// Base scraper interface and utilities
class BaseScraper {
    // Shared utilities
    extractTextContent(selector) {
        const el = document.querySelector(selector);
        return el?.textContent?.trim() || null;
    }
    extractHtmlContent(selector) {
        const el = document.querySelector(selector);
        return el?.innerHTML?.trim() || null;
    }
    extractAttribute(selector, attr) {
        const el = document.querySelector(selector);
        return el?.getAttribute(attr) || null;
    }
    extractAllText(selector) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements)
            .map((el) => el.textContent?.trim())
            .filter((text) => !!text);
    }
    waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el)
                return resolve(el);
            const observer = new MutationObserver((_, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found after ${timeout}ms`));
            }, timeout);
        });
    }
    extractRequirements(text) {
        const requirements = [];
        // Split by common bullet patterns
        const lines = text.split(/\n|•|◦|◆|▪|●|-\s|\*\s/);
        for (const line of lines) {
            const cleaned = line.trim();
            if (cleaned.length > 20 && cleaned.length < 500) {
                // Check if it looks like a requirement
                if (cleaned.match(/^(you|we|the|must|should|will|experience|proficiency|knowledge|ability|strong|excellent)/i) ||
                    cleaned.match(/required|preferred|bonus|plus/i) ||
                    cleaned.match(/^\d+\+?\s*years?/i)) {
                    requirements.push(cleaned);
                }
            }
        }
        return requirements.slice(0, 15);
    }
    extractKeywords(text) {
        const keywords = new Set();
        // Common tech skills patterns
        const techPatterns = [
            /\b(react|angular|vue|svelte|next\.?js|nuxt)\b/gi,
            /\b(node\.?js|express|fastify|nest\.?js)\b/gi,
            /\b(python|django|flask|fastapi)\b/gi,
            /\b(java|spring|kotlin)\b/gi,
            /\b(go|golang|rust|c\+\+|c#|\.net)\b/gi,
            /\b(typescript|javascript|es6)\b/gi,
            /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch)\b/gi,
            /\b(aws|gcp|azure|docker|kubernetes|k8s)\b/gi,
            /\b(git|ci\/cd|jenkins|github\s*actions)\b/gi,
            /\b(graphql|rest|api|microservices)\b/gi,
        ];
        for (const pattern of techPatterns) {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach((m) => keywords.add(m.toLowerCase().trim()));
            }
        }
        return Array.from(keywords);
    }
    detectJobType(text) {
        const lower = text.toLowerCase();
        if (lower.includes('intern') || lower.includes('internship') || lower.includes('co-op')) {
            return 'internship';
        }
        if (lower.includes('contract') || lower.includes('contractor')) {
            return 'contract';
        }
        if (lower.includes('part-time') || lower.includes('part time')) {
            return 'part-time';
        }
        if (lower.includes('full-time') || lower.includes('full time')) {
            return 'full-time';
        }
        return undefined;
    }
    detectRemote(text) {
        const lower = text.toLowerCase();
        return (lower.includes('remote') ||
            lower.includes('work from home') ||
            lower.includes('wfh') ||
            lower.includes('fully distributed') ||
            lower.includes('anywhere'));
    }
    extractSalary(text) {
        // Match salary patterns like $100,000 - $150,000 or $100k - $150k
        const pattern = /\$[\d,]+(?:k)?(?:\s*[-–]\s*\$[\d,]+(?:k)?)?(?:\s*(?:per|\/)\s*(?:year|yr|annum|annual|hour|hr))?/gi;
        const match = pattern.exec(text);
        return match ? match[0] : undefined;
    }
    cleanDescription(html) {
        // Remove HTML tags but preserve line breaks
        return html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }
}

;// ./src/content/scrapers/linkedin-scraper.ts
// LinkedIn job scraper

class LinkedInScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = 'linkedin';
        this.urlPatterns = [
            /linkedin\.com\/jobs\/view\/(\d+)/,
            /linkedin\.com\/jobs\/search/,
            /linkedin\.com\/jobs\/collections/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job details to load
        try {
            await this.waitForElement('.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title', 3000);
        }
        catch {
            // Try alternative selectors
        }
        // Try multiple selector strategies (LinkedIn changes DOM frequently)
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log('[Columbus] LinkedIn scraper: Missing required fields', { title, company, description: !!description });
            return null;
        }
        // Try to extract from structured data
        const structuredData = this.extractStructuredData();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description) || structuredData?.salary,
            type: this.detectJobType(description),
            remote: this.detectRemote(location || '') || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job cards in search results
        const jobCards = document.querySelectorAll('.job-card-container, .jobs-search-results__list-item, .scaffold-layout__list-item');
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector('.job-card-list__title, .job-card-container__link, a[data-control-name="job_card_title"]');
                const companyEl = card.querySelector('.job-card-container__company-name, .job-card-container__primary-description');
                const locationEl = card.querySelector('.job-card-container__metadata-item');
                const title = titleEl?.textContent?.trim();
                const company = companyEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const url = titleEl?.href;
                if (title && company && url) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: '', // Would need to navigate to get full description
                        requirements: [],
                        url,
                        source: this.source,
                    });
                }
            }
            catch (err) {
                console.error('[Columbus] Error scraping job card:', err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            '.job-details-jobs-unified-top-card__job-title',
            '.jobs-unified-top-card__job-title',
            '.t-24.job-details-jobs-unified-top-card__job-title',
            'h1.t-24',
            '.jobs-top-card__job-title',
            'h1[class*="job-title"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCompany() {
        const selectors = [
            '.job-details-jobs-unified-top-card__company-name',
            '.jobs-unified-top-card__company-name',
            '.jobs-top-card__company-url',
            'a[data-tracking-control-name="public_jobs_topcard-org-name"]',
            '.job-details-jobs-unified-top-card__primary-description-container a',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            '.job-details-jobs-unified-top-card__bullet',
            '.jobs-unified-top-card__bullet',
            '.jobs-top-card__bullet',
            '.job-details-jobs-unified-top-card__primary-description-container .t-black--light',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && !text.includes('applicant') && !text.includes('ago')) {
                return text;
            }
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            '.jobs-description__content',
            '.jobs-description-content__text',
            '.jobs-box__html-content',
            '#job-details',
            '.jobs-description',
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    extractJobId() {
        const match = window.location.href.match(/\/view\/(\d+)/);
        return match?.[1];
    }
    extractStructuredData() {
        try {
            const ldJson = document.querySelector('script[type="application/ld+json"]');
            if (!ldJson?.textContent)
                return null;
            const data = JSON.parse(ldJson.textContent);
            return {
                location: data.jobLocation?.address?.addressLocality,
                salary: data.baseSalary?.value
                    ? `$${data.baseSalary.value.minValue || ''}-${data.baseSalary.value.maxValue || ''}`
                    : undefined,
                postedAt: data.datePosted,
            };
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/waterloo-works-scraper.ts
// Waterloo Works job scraper (University of Waterloo co-op portal)

class WaterlooWorksScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = 'waterlooworks';
        this.urlPatterns = [/waterlooworks\.uwaterloo\.ca/];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Check if user is logged in
        if (this.isLoginPage()) {
            console.log('[Columbus] Waterloo Works: Please log in first');
            return null;
        }
        // Wait for job details to load
        try {
            await this.waitForElement('.posting-details, .job-posting-details, #postingDiv', 3000);
        }
        catch {
            console.log('[Columbus] Waterloo Works: Could not find job details');
            return null;
        }
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log('[Columbus] Waterloo Works scraper: Missing required fields');
            return null;
        }
        const location = this.extractLocation();
        const deadline = this.extractDeadline();
        const details = this.extractDetailsTable();
        return {
            title,
            company,
            location: location || details.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: details.salary,
            type: 'internship', // Waterloo Works is for co-op/internships
            remote: this.detectRemote(location || '') || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: details.jobId,
            deadline,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Check if logged in
        if (this.isLoginPage()) {
            console.log('[Columbus] Waterloo Works: Please log in to scrape job list');
            return jobs;
        }
        // Job listings are typically in a table
        const rows = document.querySelectorAll('.job-listing-table tbody tr, #postingsTable tbody tr, .orbisModuleBody table tbody tr');
        for (const row of rows) {
            try {
                const cells = row.querySelectorAll('td');
                if (cells.length < 3)
                    continue;
                // Typical structure: Job Title | Company | Location | Deadline | ...
                const titleCell = cells[0];
                const titleLink = titleCell.querySelector('a');
                const title = titleLink?.textContent?.trim() || titleCell.textContent?.trim();
                const url = titleLink?.href;
                const company = cells[1]?.textContent?.trim();
                const location = cells[2]?.textContent?.trim();
                const deadline = cells[3]?.textContent?.trim();
                if (title && company && url) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: '', // Need to navigate for full description
                        requirements: [],
                        url,
                        source: this.source,
                        type: 'internship',
                        deadline,
                    });
                }
            }
            catch (err) {
                console.error('[Columbus] Error scraping Waterloo Works row:', err);
            }
        }
        // Also try card-based layouts (newer UI)
        const cards = document.querySelectorAll('.job-card, .posting-card, [class*="posting-item"]');
        for (const card of cards) {
            try {
                const titleEl = card.querySelector('.job-title, .posting-title, h3, h4');
                const companyEl = card.querySelector('.employer-name, .company-name, [class*="employer"]');
                const locationEl = card.querySelector('.job-location, .location, [class*="location"]');
                const linkEl = card.querySelector('a[href*="posting"]');
                const title = titleEl?.textContent?.trim();
                const company = companyEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const url = linkEl?.href;
                if (title && company && url) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: '',
                        requirements: [],
                        url,
                        source: this.source,
                        type: 'internship',
                    });
                }
            }
            catch (err) {
                console.error('[Columbus] Error scraping Waterloo Works card:', err);
            }
        }
        return jobs;
    }
    isLoginPage() {
        const url = window.location.href.toLowerCase();
        return (url.includes('login') ||
            url.includes('signin') ||
            url.includes('cas/') ||
            document.querySelector('input[type="password"]') !== null);
    }
    extractJobTitle() {
        const selectors = [
            '.posting-title',
            '.job-title',
            '#postingDiv h1',
            '.job-posting-details h1',
            '[class*="posting"] h1',
            'h1',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.length > 3 && text.length < 200) {
                return text;
            }
        }
        return null;
    }
    extractCompany() {
        const selectors = [
            '.employer-name',
            '.company-name',
            '.organization-name',
            '[class*="employer"]',
            'td:contains("Organization") + td',
            'th:contains("Organization") + td',
        ];
        for (const selector of selectors) {
            try {
                const text = this.extractTextContent(selector);
                if (text && text.length > 1)
                    return text;
            }
            catch {
                // Selector might be invalid
            }
        }
        // Try table-based extraction
        const rows = document.querySelectorAll('tr, .detail-row');
        for (const row of rows) {
            const text = row.textContent?.toLowerCase() || '';
            if (text.includes('organization') || text.includes('employer') || text.includes('company')) {
                const cells = row.querySelectorAll('td, .value, dd');
                if (cells.length > 0) {
                    const value = cells[cells.length - 1].textContent?.trim();
                    if (value && value.length > 1)
                        return value;
                }
            }
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            '.job-location',
            '.location',
            '[class*="location"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        // Try table-based extraction
        const rows = document.querySelectorAll('tr, .detail-row');
        for (const row of rows) {
            const text = row.textContent?.toLowerCase() || '';
            if (text.includes('location') || text.includes('city') || text.includes('region')) {
                const cells = row.querySelectorAll('td, .value, dd');
                if (cells.length > 0) {
                    const value = cells[cells.length - 1].textContent?.trim();
                    if (value)
                        return value;
                }
            }
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            '.job-description',
            '.posting-description',
            '#postingDiv .description',
            '.job-posting-details .description',
            '[class*="description"]',
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html && html.length > 50) {
                return this.cleanDescription(html);
            }
        }
        // Try to find the main content area
        const mainContent = document.querySelector('.posting-details, #postingDiv, .job-posting-details');
        if (mainContent) {
            const html = mainContent.innerHTML;
            return this.cleanDescription(html);
        }
        return null;
    }
    extractDeadline() {
        const selectors = [
            '.application-deadline',
            '.deadline',
            '[class*="deadline"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        // Try table-based extraction
        const rows = document.querySelectorAll('tr, .detail-row');
        for (const row of rows) {
            const text = row.textContent?.toLowerCase() || '';
            if (text.includes('deadline') || text.includes('apply by') || text.includes('due')) {
                const cells = row.querySelectorAll('td, .value, dd');
                if (cells.length > 0) {
                    const value = cells[cells.length - 1].textContent?.trim();
                    if (value)
                        return value;
                }
            }
        }
        return undefined;
    }
    extractDetailsTable() {
        const details = {};
        const rows = document.querySelectorAll('tr, .detail-row, dt');
        for (const row of rows) {
            const text = row.textContent?.toLowerCase() || '';
            let label = null;
            let value = null;
            // Handle dt/dd pairs
            if (row.tagName === 'DT') {
                label = row.textContent?.trim() || null;
                const dd = row.nextElementSibling;
                if (dd?.tagName === 'DD') {
                    value = dd.textContent?.trim() || null;
                }
            }
            else {
                // Handle table rows
                const cells = row.querySelectorAll('td, th');
                if (cells.length >= 2) {
                    label = cells[0].textContent?.trim()?.toLowerCase() || null;
                    value = cells[1].textContent?.trim() || null;
                }
            }
            if (label && value) {
                if (label.includes('job id') || label.includes('posting id')) {
                    details.jobId = value;
                }
                if (label.includes('location') || label.includes('city')) {
                    details.location = value;
                }
                if (label.includes('salary') || label.includes('compensation') || label.includes('pay')) {
                    details.salary = value;
                }
            }
        }
        return details;
    }
}

;// ./src/content/scrapers/indeed-scraper.ts
// Indeed job scraper

class IndeedScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = 'indeed';
        this.urlPatterns = [
            /indeed\.com\/viewjob/,
            /indeed\.com\/jobs\//,
            /indeed\.com\/job\//,
            /indeed\.com\/rc\/clk/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job details to load
        try {
            await this.waitForElement('.jobsearch-JobInfoHeader-title, [data-testid="jobsearch-JobInfoHeader-title"]', 3000);
        }
        catch {
            // Continue with available data
        }
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log('[Columbus] Indeed scraper: Missing required fields', { title, company, description: !!description });
            return null;
        }
        const structuredData = this.extractStructuredData();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalaryFromPage() || this.extractSalary(description) || structuredData?.salary,
            type: this.detectJobType(description),
            remote: this.detectRemote(location || '') || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job cards in search results
        const jobCards = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li, [data-testid="job-card"]');
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector('.jobTitle, [data-testid="jobTitle"], h2.jobTitle a, .jcs-JobTitle');
                const companyEl = card.querySelector('.companyName, [data-testid="company-name"], .company_location .companyName');
                const locationEl = card.querySelector('.companyLocation, [data-testid="text-location"], .company_location .companyLocation');
                const salaryEl = card.querySelector('.salary-snippet-container, [data-testid="attribute_snippet_testid"], .estimated-salary');
                const title = titleEl?.textContent?.trim();
                const company = companyEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const salary = salaryEl?.textContent?.trim();
                // Get URL from title link or data attribute
                let url = titleEl?.href;
                if (!url) {
                    const jobKey = card.getAttribute('data-jk');
                    if (jobKey) {
                        url = `https://www.indeed.com/viewjob?jk=${jobKey}`;
                    }
                }
                if (title && company && url) {
                    jobs.push({
                        title,
                        company,
                        location,
                        salary,
                        description: '',
                        requirements: [],
                        url,
                        source: this.source,
                        sourceJobId: this.extractJobIdFromUrl(url),
                    });
                }
            }
            catch (err) {
                console.error('[Columbus] Error scraping Indeed job card:', err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            '.jobsearch-JobInfoHeader-title',
            '[data-testid="jobsearch-JobInfoHeader-title"]',
            'h1.jobsearch-JobInfoHeader-title',
            '.icl-u-xs-mb--xs h1',
            'h1[class*="JobInfoHeader"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCompany() {
        const selectors = [
            '[data-testid="inlineHeader-companyName"] a',
            '[data-testid="inlineHeader-companyName"]',
            '.jobsearch-InlineCompanyRating-companyHeader a',
            '.jobsearch-InlineCompanyRating a',
            '.icl-u-lg-mr--sm a',
            '[data-company-name="true"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            '[data-testid="inlineHeader-companyLocation"]',
            '[data-testid="job-location"]',
            '.jobsearch-JobInfoHeader-subtitle > div:nth-child(2)',
            '.jobsearch-InlineCompanyRating + div',
            '.icl-u-xs-mt--xs .icl-u-textColor--secondary',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && !text.includes('reviews') && !text.includes('rating')) {
                return text;
            }
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            '#jobDescriptionText',
            '[data-testid="jobDescriptionText"]',
            '.jobsearch-jobDescriptionText',
            '.jobsearch-JobComponent-description',
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    extractSalaryFromPage() {
        const selectors = [
            '[data-testid="jobsearch-JobMetadataHeader-salaryInfo"]',
            '.jobsearch-JobMetadataHeader-salaryInfo',
            '#salaryInfoAndJobType .attribute_snippet',
            '.jobsearch-JobInfoHeader-salary',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.includes('$')) {
                return text;
            }
        }
        return undefined;
    }
    extractJobId() {
        // From URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const jk = urlParams.get('jk');
        if (jk)
            return jk;
        // From URL path
        const match = window.location.href.match(/\/job\/([a-f0-9]+)/i);
        return match?.[1];
    }
    extractJobIdFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const jk = urlObj.searchParams.get('jk');
            if (jk)
                return jk;
            const match = url.match(/\/job\/([a-f0-9]+)/i);
            return match?.[1];
        }
        catch {
            return undefined;
        }
    }
    extractStructuredData() {
        try {
            const ldJson = document.querySelector('script[type="application/ld+json"]');
            if (!ldJson?.textContent)
                return null;
            const data = JSON.parse(ldJson.textContent);
            // Indeed may have an array of structured data
            const jobData = Array.isArray(data) ? data.find((d) => d['@type'] === 'JobPosting') : data;
            if (!jobData || jobData['@type'] !== 'JobPosting')
                return null;
            return {
                location: jobData.jobLocation?.address?.addressLocality ||
                    jobData.jobLocation?.address?.name,
                salary: jobData.baseSalary?.value
                    ? `$${jobData.baseSalary.value.minValue || ''}-${jobData.baseSalary.value.maxValue || ''} ${jobData.baseSalary.value.unitText || ''}`
                    : undefined,
                postedAt: jobData.datePosted,
            };
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/greenhouse-scraper.ts
// Greenhouse job board scraper

class GreenhouseScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = 'greenhouse';
        this.urlPatterns = [
            /boards\.greenhouse\.io\/[\w-]+\/jobs\/\d+/,
            /[\w-]+\.greenhouse\.io\/jobs\/\d+/,
            /greenhouse\.io\/embed\/job_app/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job content to load
        try {
            await this.waitForElement('.app-title, #header .company-name, .job-title', 3000);
        }
        catch {
            // Continue with available data
        }
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log('[Columbus] Greenhouse scraper: Missing required fields', { title, company, description: !!description });
            return null;
        }
        const structuredData = this.extractStructuredData();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description) || structuredData?.salary,
            type: this.detectJobType(description) || structuredData?.type,
            remote: this.detectRemote(location || '') || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job cards on department/listing pages
        const jobCards = document.querySelectorAll('.opening, .job-post, [data-mapped="true"], section.level-0 > div');
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector('a, .opening-title, .job-title');
                const locationEl = card.querySelector('.location, .job-location, span:last-child');
                const title = titleEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const url = titleEl?.href;
                // Company is usually in header
                const company = this.extractCompany();
                if (title && url && company) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: '',
                        requirements: [],
                        url,
                        source: this.source,
                        sourceJobId: this.extractJobIdFromUrl(url),
                    });
                }
            }
            catch (err) {
                console.error('[Columbus] Error scraping Greenhouse job card:', err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            '.app-title',
            '.job-title',
            'h1.heading',
            '.job-info h1',
            '#header h1',
            'h1[class*="job"]',
            '.hero h1',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        // Try structured data
        const ldJson = this.extractStructuredData();
        if (ldJson?.title)
            return ldJson.title;
        return null;
    }
    extractCompany() {
        const selectors = [
            '.company-name',
            '#header .company-name',
            '.logo-wrapper img[alt]',
            '.company-header .name',
            'meta[property="og:site_name"]',
        ];
        for (const selector of selectors) {
            if (selector.includes('meta')) {
                const meta = document.querySelector(selector);
                const content = meta?.getAttribute('content');
                if (content)
                    return content;
            }
            else if (selector.includes('img[alt]')) {
                const img = document.querySelector(selector);
                const alt = img?.getAttribute('alt');
                if (alt)
                    return alt;
            }
            else {
                const text = this.extractTextContent(selector);
                if (text)
                    return text;
            }
        }
        // Extract from URL (boards.greenhouse.io/COMPANY/jobs/...)
        const match = window.location.href.match(/greenhouse\.io\/([^/]+)/);
        if (match && match[1] !== 'jobs') {
            return match[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            '.location',
            '.job-location',
            '.company-location',
            '.job-info .location',
            '#header .location',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            '#content',
            '.job-description',
            '.content-wrapper .content',
            '#job_description',
            '.job-content',
            '.job-info .content',
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html && html.length > 100) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    extractJobId() {
        // From URL: boards.greenhouse.io/company/jobs/12345
        const match = window.location.href.match(/\/jobs\/(\d+)/);
        return match?.[1];
    }
    extractJobIdFromUrl(url) {
        const match = url.match(/\/jobs\/(\d+)/);
        return match?.[1];
    }
    extractStructuredData() {
        try {
            const ldJsonElements = document.querySelectorAll('script[type="application/ld+json"]');
            for (const el of ldJsonElements) {
                if (!el.textContent)
                    continue;
                const data = JSON.parse(el.textContent);
                const jobData = Array.isArray(data) ? data.find((d) => d['@type'] === 'JobPosting') : data;
                if (!jobData || jobData['@type'] !== 'JobPosting')
                    continue;
                const employmentType = jobData.employmentType?.toLowerCase();
                let type;
                if (employmentType?.includes('full'))
                    type = 'full-time';
                else if (employmentType?.includes('part'))
                    type = 'part-time';
                else if (employmentType?.includes('contract'))
                    type = 'contract';
                else if (employmentType?.includes('intern'))
                    type = 'internship';
                return {
                    title: jobData.title,
                    location: typeof jobData.jobLocation === 'string'
                        ? jobData.jobLocation
                        : jobData.jobLocation?.address?.addressLocality ||
                            jobData.jobLocation?.address?.name ||
                            jobData.jobLocation?.name,
                    salary: jobData.baseSalary?.value
                        ? `$${jobData.baseSalary.value.minValue || ''}-${jobData.baseSalary.value.maxValue || ''}`
                        : undefined,
                    postedAt: jobData.datePosted,
                    type,
                };
            }
            return null;
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/lever-scraper.ts
// Lever job board scraper

class LeverScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = 'lever';
        this.urlPatterns = [
            /jobs\.lever\.co\/[\w-]+\/[\w-]+/,
            /[\w-]+\.lever\.co\/[\w-]+/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job content to load
        try {
            await this.waitForElement('.posting-headline h2, .posting-headline h1, .section-wrapper', 3000);
        }
        catch {
            // Continue with available data
        }
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log('[Columbus] Lever scraper: Missing required fields', { title, company, description: !!description });
            return null;
        }
        const structuredData = this.extractStructuredData();
        const commitment = this.extractCommitment();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description) || structuredData?.salary,
            type: this.detectJobTypeFromCommitment(commitment) || this.detectJobType(description),
            remote: this.detectRemote(location || '') || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job postings on company page
        const jobCards = document.querySelectorAll('.posting, [data-qa="posting-name"]');
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector('.posting-title h5, .posting-name, a[data-qa="posting-name"]');
                const locationEl = card.querySelector('.location, .posting-categories .sort-by-location, .workplaceTypes');
                const commitmentEl = card.querySelector('.commitment, .posting-categories .sort-by-commitment');
                const title = titleEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const commitment = commitmentEl?.textContent?.trim();
                const url = card.querySelector('a.posting-title, a[data-qa="posting-name"]')?.href ||
                    card.href;
                const company = this.extractCompany();
                if (title && url && company) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: '',
                        requirements: [],
                        url,
                        source: this.source,
                        sourceJobId: this.extractJobIdFromUrl(url),
                        type: this.detectJobTypeFromCommitment(commitment ?? null),
                    });
                }
            }
            catch (err) {
                console.error('[Columbus] Error scraping Lever job card:', err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            '.posting-headline h2',
            '.posting-headline h1',
            '[data-qa="posting-name"]',
            '.posting-header h2',
            '.section.page-centered.posting-header h1',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCompany() {
        // Try logo alt text
        const logo = document.querySelector('.main-header-logo img, .posting-header .logo img, header img');
        if (logo) {
            const alt = logo.getAttribute('alt');
            if (alt && alt !== 'Company Logo')
                return alt;
        }
        // Try page title
        const pageTitle = document.title;
        if (pageTitle) {
            // Format: "Job Title - Company Name"
            const parts = pageTitle.split(' - ');
            if (parts.length >= 2) {
                return parts[parts.length - 1].replace(' Jobs', '').trim();
            }
        }
        // Extract from URL
        const match = window.location.href.match(/lever\.co\/([^/]+)/);
        if (match) {
            return match[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            '.posting-categories .location',
            '.posting-headline .location',
            '.sort-by-location',
            '.workplaceTypes',
            '[data-qa="posting-location"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCommitment() {
        const selectors = [
            '.posting-categories .commitment',
            '.sort-by-commitment',
            '[data-qa="posting-commitment"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            '.posting-page .content',
            '.section-wrapper.page-full-width',
            '.section.page-centered',
            '[data-qa="job-description"]',
            '.posting-description',
        ];
        for (const selector of selectors) {
            // For Lever, we want to get all content sections
            const sections = document.querySelectorAll(selector);
            if (sections.length > 0) {
                const html = Array.from(sections)
                    .map((s) => s.innerHTML)
                    .join('\n\n');
                if (html.length > 100) {
                    return this.cleanDescription(html);
                }
            }
        }
        // Try getting the main content area
        const mainContent = document.querySelector('.content-wrapper .content, main .content');
        if (mainContent) {
            return this.cleanDescription(mainContent.innerHTML);
        }
        return null;
    }
    extractJobId() {
        // From URL: jobs.lever.co/company/job-id-uuid
        const match = window.location.href.match(/lever\.co\/[^/]+\/([a-f0-9-]+)/i);
        return match?.[1];
    }
    extractJobIdFromUrl(url) {
        const match = url.match(/lever\.co\/[^/]+\/([a-f0-9-]+)/i);
        return match?.[1];
    }
    detectJobTypeFromCommitment(commitment) {
        if (!commitment)
            return undefined;
        const lower = commitment.toLowerCase();
        if (lower.includes('full-time') || lower.includes('full time'))
            return 'full-time';
        if (lower.includes('part-time') || lower.includes('part time'))
            return 'part-time';
        if (lower.includes('contract') || lower.includes('contractor'))
            return 'contract';
        if (lower.includes('intern'))
            return 'internship';
        return undefined;
    }
    extractStructuredData() {
        try {
            const ldJsonElements = document.querySelectorAll('script[type="application/ld+json"]');
            for (const el of ldJsonElements) {
                if (!el.textContent)
                    continue;
                const data = JSON.parse(el.textContent);
                const jobData = Array.isArray(data) ? data.find((d) => d['@type'] === 'JobPosting') : data;
                if (!jobData || jobData['@type'] !== 'JobPosting')
                    continue;
                return {
                    location: typeof jobData.jobLocation === 'string'
                        ? jobData.jobLocation
                        : jobData.jobLocation?.address?.addressLocality ||
                            jobData.jobLocation?.name,
                    salary: jobData.baseSalary?.value
                        ? `$${jobData.baseSalary.value.minValue || ''}-${jobData.baseSalary.value.maxValue || ''}`
                        : undefined,
                    postedAt: jobData.datePosted,
                };
            }
            return null;
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/generic-scraper.ts
// Generic job scraper for unknown sites

class GenericScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = 'unknown';
        this.urlPatterns = [];
    }
    canHandle(_url) {
        // Generic scraper always returns true as fallback
        return true;
    }
    async scrapeJobListing() {
        // Try to extract job information using common patterns
        // Check for structured data first
        const structuredData = this.extractStructuredData();
        if (structuredData) {
            return structuredData;
        }
        // Try common selectors
        const title = this.findTitle();
        const company = this.findCompany();
        const description = this.findDescription();
        if (!title || !description) {
            console.log('[Columbus] Generic scraper: Could not find required fields');
            return null;
        }
        const location = this.findLocation();
        return {
            title,
            company: company || 'Unknown Company',
            location: location || undefined,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description),
            type: this.detectJobType(description),
            remote: this.detectRemote(location || '') || this.detectRemote(description),
            url: window.location.href,
            source: this.detectSource(),
        };
    }
    async scrapeJobList() {
        // Generic scraping of job lists is unreliable
        // Return empty array for unknown sites
        return [];
    }
    extractStructuredData() {
        try {
            // Look for JSON-LD job posting schema
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            for (const script of scripts) {
                const data = JSON.parse(script.textContent || '');
                // Handle single job posting
                if (data['@type'] === 'JobPosting') {
                    return this.parseJobPostingSchema(data);
                }
                // Handle array of items
                if (Array.isArray(data)) {
                    const jobPosting = data.find((item) => item['@type'] === 'JobPosting');
                    if (jobPosting) {
                        return this.parseJobPostingSchema(jobPosting);
                    }
                }
                // Handle @graph
                if (data['@graph']) {
                    const jobPosting = data['@graph'].find((item) => item['@type'] === 'JobPosting');
                    if (jobPosting) {
                        return this.parseJobPostingSchema(jobPosting);
                    }
                }
            }
        }
        catch (err) {
            console.log('[Columbus] Could not parse structured data:', err);
        }
        return null;
    }
    parseJobPostingSchema(data) {
        const title = data.title || '';
        const company = data.hiringOrganization?.name || '';
        const description = data.description || '';
        // Extract location
        let location;
        const jobLocation = data.jobLocation;
        if (jobLocation) {
            const address = jobLocation.address;
            if (address) {
                location = [address.addressLocality, address.addressRegion, address.addressCountry]
                    .filter(Boolean)
                    .join(', ');
            }
        }
        // Extract salary
        let salary;
        const baseSalary = data.baseSalary;
        if (baseSalary) {
            const value = baseSalary.value;
            if (value) {
                const currency = baseSalary.currency || 'USD';
                const min = value.minValue;
                const max = value.maxValue;
                if (min && max) {
                    salary = `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
                }
                else if (value) {
                    salary = `${currency} ${value.toLocaleString()}`;
                }
            }
        }
        return {
            title,
            company,
            location,
            description: this.cleanDescription(description),
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary,
            type: this.parseEmploymentType(data.employmentType),
            remote: this.detectRemote(description),
            url: window.location.href,
            source: this.detectSource(),
            postedAt: data.datePosted,
        };
    }
    parseEmploymentType(type) {
        if (!type)
            return undefined;
        const lower = type.toLowerCase();
        if (lower.includes('full'))
            return 'full-time';
        if (lower.includes('part'))
            return 'part-time';
        if (lower.includes('contract') || lower.includes('temporary'))
            return 'contract';
        if (lower.includes('intern'))
            return 'internship';
        return undefined;
    }
    findTitle() {
        // Common title selectors
        const selectors = [
            'h1[class*="title"]',
            'h1[class*="job"]',
            '.job-title',
            '.posting-title',
            '[class*="job-title"]',
            '[class*="posting-title"]',
            'h1',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.length > 3 && text.length < 200) {
                // Filter out common non-title content
                if (!text.toLowerCase().includes('sign in') && !text.toLowerCase().includes('log in')) {
                    return text;
                }
            }
        }
        // Try document title
        const docTitle = document.title;
        if (docTitle && docTitle.length > 5) {
            // Remove common suffixes
            const cleaned = docTitle
                .replace(/\s*[-|]\s*.+$/, '')
                .replace(/\s*at\s+.+$/i, '')
                .trim();
            if (cleaned.length > 3) {
                return cleaned;
            }
        }
        return null;
    }
    findCompany() {
        const selectors = [
            '[class*="company-name"]',
            '[class*="employer"]',
            '[class*="organization"]',
            '.company',
            '.employer',
            'a[href*="company"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.length > 1 && text.length < 100) {
                return text;
            }
        }
        // Try meta tags
        const ogSiteName = document.querySelector('meta[property="og:site_name"]');
        if (ogSiteName) {
            const content = ogSiteName.getAttribute('content');
            if (content)
                return content;
        }
        return null;
    }
    findDescription() {
        const selectors = [
            '.job-description',
            '.posting-description',
            '[class*="job-description"]',
            '[class*="posting-description"]',
            '[class*="description"]',
            'article',
            '.content',
            'main',
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html && html.length > 100) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    findLocation() {
        const selectors = [
            '[class*="location"]',
            '[class*="address"]',
            '.location',
            '.job-location',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.length > 2 && text.length < 100) {
                return text;
            }
        }
        return null;
    }
    detectSource() {
        const hostname = window.location.hostname.toLowerCase();
        // Remove common prefixes
        const cleaned = hostname
            .replace(/^www\./, '')
            .replace(/^jobs\./, '')
            .replace(/^careers\./, '');
        // Extract main domain
        const parts = cleaned.split('.');
        if (parts.length >= 2) {
            return parts[parts.length - 2];
        }
        return cleaned;
    }
}

;// ./src/content/scrapers/scraper-registry.ts
// Scraper registry - maps URLs to appropriate scrapers






// Initialize all scrapers
const scrapers = [
    new LinkedInScraper(),
    new WaterlooWorksScraper(),
    new IndeedScraper(),
    new GreenhouseScraper(),
    new LeverScraper(),
];
const genericScraper = new GenericScraper();
/**
 * Get the appropriate scraper for a URL
 */
function getScraperForUrl(url) {
    const scraper = scrapers.find((s) => s.canHandle(url));
    return scraper || genericScraper;
}
/**
 * Check if we have a specialized scraper for this URL
 */
function hasSpecializedScraper(url) {
    return scrapers.some((s) => s.canHandle(url));
}
/**
 * Get all available scraper sources
 */
function getAvailableSources() {
    return scrapers.map((s) => s.source);
}

;// ./src/shared/messages.ts
// Message passing utilities for extension communication
// Type-safe message creators
const Messages = {
    // Auth messages
    getAuthStatus: () => ({ type: 'GET_AUTH_STATUS' }),
    openAuth: () => ({ type: 'OPEN_AUTH' }),
    logout: () => ({ type: 'LOGOUT' }),
    // Profile messages
    getProfile: () => ({ type: 'GET_PROFILE' }),
    // Form filling messages
    fillForm: (fields) => ({
        type: 'FILL_FORM',
        payload: fields,
    }),
    // Scraping messages
    scrapeJob: () => ({ type: 'SCRAPE_JOB' }),
    scrapeJobList: () => ({ type: 'SCRAPE_JOB_LIST' }),
    importJob: (job) => ({
        type: 'IMPORT_JOB',
        payload: job,
    }),
    importJobsBatch: (jobs) => ({
        type: 'IMPORT_JOBS_BATCH',
        payload: jobs,
    }),
    // Learning messages
    saveAnswer: (data) => ({
        type: 'SAVE_ANSWER',
        payload: data,
    }),
    searchAnswers: (question) => ({
        type: 'SEARCH_ANSWERS',
        payload: question,
    }),
    jobDetected: (meta) => ({
        type: 'JOB_DETECTED',
        payload: meta,
    }),
};
// Send message to background script
async function sendMessage(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            }
            else {
                resolve(response || { success: false, error: 'No response received' });
            }
        });
    });
}
// Send message to content script in specific tab
async function sendToTab(tabId, message) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            }
            else {
                resolve(response || { success: false, error: 'No response received' });
            }
        });
    });
}
// Send message to all content scripts
async function broadcastMessage(message) {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        if (tab.id) {
            try {
                await chrome.tabs.sendMessage(tab.id, message);
            }
            catch {
                // Tab might not have content script loaded
            }
        }
    }
}

;// ./src/content/index.ts
// Content script entry point for Columbus extension
// Import styles for content script






// Initialize components
const fieldDetector = new FieldDetector();
let autoFillEngine = null;
let cachedProfile = null;
let detectedFields = [];
let scrapedJob = null;
let jobDetectedForUrl = null;
// Scan page on load
scanPage();
// Re-scan on dynamic content changes
const observer = new MutationObserver(debounce(scanPage, 500));
observer.observe(document.body, { childList: true, subtree: true });
async function scanPage() {
    // Detect forms
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
        const fields = fieldDetector.detectFields(form);
        if (fields.length > 0) {
            detectedFields = fields;
            console.log('[Columbus] Detected fields:', fields.length);
        }
    }
    // Check for job listing
    const scraper = getScraperForUrl(window.location.href);
    if (scraper.canHandle(window.location.href)) {
        try {
            scrapedJob = await scraper.scrapeJobListing();
            if (scrapedJob) {
                console.log('[Columbus] Scraped job:', scrapedJob.title);
                if (jobDetectedForUrl !== window.location.href) {
                    jobDetectedForUrl = window.location.href;
                    sendMessage(Messages.jobDetected({
                        title: scrapedJob.title,
                        company: scrapedJob.company,
                        url: scrapedJob.url,
                    })).catch((err) => console.error('[Columbus] Failed to notify job detected:', err));
                }
            }
        }
        catch (err) {
            console.error('[Columbus] Scrape error:', err);
        }
    }
}
// Handle messages from popup and background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message)
        .then(sendResponse)
        .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Async response
});
async function handleMessage(message) {
    switch (message.type) {
        case 'GET_PAGE_STATUS':
            return {
                hasForm: detectedFields.length > 0,
                hasJobListing: scrapedJob !== null,
                detectedFields: detectedFields.length,
                scrapedJob,
            };
        case 'TRIGGER_FILL':
            return handleFillForm();
        case 'TRIGGER_IMPORT':
            if (scrapedJob) {
                return sendMessage(Messages.importJob(scrapedJob));
            }
            return { success: false, error: 'No job detected' };
        case 'SCRAPE_JOB':
            const scraper = getScraperForUrl(window.location.href);
            if (scraper.canHandle(window.location.href)) {
                scrapedJob = await scraper.scrapeJobListing();
                return { success: true, data: scrapedJob };
            }
            return { success: false, error: 'No scraper available for this site' };
        case 'SCRAPE_JOB_LIST':
            const listScraper = getScraperForUrl(window.location.href);
            if (listScraper.canHandle(window.location.href)) {
                const jobs = await listScraper.scrapeJobList();
                return { success: true, data: jobs };
            }
            return { success: false, error: 'No scraper available for this site' };
        default:
            return { success: false, error: `Unknown message type: ${message.type}` };
    }
}
async function handleFillForm() {
    if (detectedFields.length === 0) {
        return { success: false, error: 'No fields detected' };
    }
    // Get profile if not cached
    if (!cachedProfile) {
        const response = await sendMessage(Messages.getProfile());
        if (!response.success || !response.data) {
            return { success: false, error: 'Failed to load profile' };
        }
        cachedProfile = response.data;
    }
    // Create mapper and engine
    const mapper = new FieldMapper(cachedProfile);
    autoFillEngine = new AutoFillEngine(fieldDetector, mapper);
    // Fill the form
    const result = await autoFillEngine.fillForm(detectedFields);
    return { success: true, data: result };
}
// Utility: debounce function
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
console.log('[Columbus] Content script loaded');

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JRQTtBQUNxRjtBQUM5RTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0QsV0FBVztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUI7QUFDbkYsZUFBZSwwQkFBMEI7QUFDekM7QUFDQTs7O0FDbk1BO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWSxLQUFLLFdBQVcsT0FBTyxnQkFBZ0I7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGVBQWU7QUFDcEMscUJBQXFCLGVBQWUsSUFBSSxZQUFZO0FBQ3BELHNCQUFzQixXQUFXLEtBQUssYUFBYSxHQUFHLE9BQU87QUFDN0QsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RJQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RSxLQUFLO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStELFNBQVM7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxlQUFlO0FBQ2xFLG1EQUFtRCxlQUFlO0FBQ2xFLG9EQUFvRCxlQUFlO0FBQ25FLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsZUFBZTtBQUN0RTtBQUNBO0FBQ0E7OztBQ3RMQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLDhDQUE4QyxnQ0FBZ0M7QUFDOUU7QUFDQTtBQUNBLDRDQUE0QyxVQUFVLGtCQUFrQixRQUFRO0FBQ2hGLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIseUJBQXlCLEdBQUc7QUFDNUI7QUFDQTtBQUNBOzs7QUM3SEE7QUFDNkM7QUFDdEMsOEJBQThCLFdBQVc7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtGQUFrRiw0Q0FBNEM7QUFDOUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIscUNBQXFDLEdBQUcscUNBQXFDO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcktBO0FBQzZDO0FBQ3RDLG1DQUFtQyxXQUFXO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDblNBO0FBQzZDO0FBQ3RDLDRCQUE0QixXQUFXO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsNENBQTRDO0FBQzVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUsT0FBTztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHdDQUF3QyxHQUFHLHlDQUF5QyxFQUFFLHdDQUF3QztBQUN4SjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ROQTtBQUM2QztBQUN0QyxnQ0FBZ0MsV0FBVztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9GQUFvRiw0Q0FBNEM7QUFDaEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix3Q0FBd0MsR0FBRyx3Q0FBd0M7QUFDakg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4TkE7QUFDNkM7QUFDdEMsMkJBQTJCLFdBQVc7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQStFLDRDQUE0QztBQUMzSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0NBQXdDLEdBQUcsd0NBQXdDO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25PQTtBQUM2QztBQUN0Qyw2QkFBNkIsV0FBVztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUUsc0JBQXNCLElBQUkscUJBQXFCO0FBQzNGO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFLHVCQUF1QjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDclBBO0FBQ3FEO0FBQ1c7QUFDZjtBQUNRO0FBQ1Y7QUFDSTtBQUNuRDtBQUNBO0FBQ0EsUUFBUSxlQUFlO0FBQ3ZCLFFBQVEsb0JBQW9CO0FBQzVCLFFBQVEsYUFBYTtBQUNyQixRQUFRLGlCQUFpQjtBQUN6QixRQUFRLFlBQVk7QUFDcEI7QUFDQSwyQkFBMkIsY0FBYztBQUN6QztBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7O0FDbENBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsNEJBQTRCLHlCQUF5QjtBQUNyRCx1QkFBdUIsbUJBQW1CO0FBQzFDLHFCQUFxQixnQkFBZ0I7QUFDckM7QUFDQSx5QkFBeUIscUJBQXFCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0Esd0JBQXdCLG9CQUFvQjtBQUM1Qyw0QkFBNEIseUJBQXlCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIseURBQXlEO0FBQ25GO0FBQ0E7QUFDQSxzQ0FBc0MsK0NBQStDO0FBQ3JGO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIseURBQXlEO0FBQ25GO0FBQ0E7QUFDQSxzQ0FBc0MsK0NBQStDO0FBQ3JGO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ087QUFDUCwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUVBO0FBQ0E7QUFDeUI7QUFDa0M7QUFDSjtBQUNIO0FBQ1c7QUFDTDtBQUMxRDtBQUNBLDBCQUEwQixhQUFhO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxnQ0FBZ0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsV0FBVyxDQUFDLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxvQ0FBb0M7QUFDM0UsaUJBQWlCO0FBQ2pCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixXQUFXLENBQUMsUUFBUTtBQUMzQztBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLDRCQUE0QixnQkFBZ0I7QUFDNUM7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGdDQUFnQyxnQkFBZ0I7QUFDaEQ7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLHFCQUFxQixnREFBZ0QsYUFBYTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsV0FBVyxDQUFDLFFBQVE7QUFDbkQ7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsV0FBVztBQUNsQyx5QkFBeUIsY0FBYztBQUN2QztBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9zaGFyZWQvZmllbGQtcGF0dGVybnMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L2F1dG8tZmlsbC9maWVsZC1kZXRlY3Rvci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvYXV0by1maWxsL2ZpZWxkLW1hcHBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvYXV0by1maWxsL2VuZ2luZS50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvYmFzZS1zY3JhcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy9saW5rZWRpbi1zY3JhcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy93YXRlcmxvby13b3Jrcy1zY3JhcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy9pbmRlZWQtc2NyYXBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvZ3JlZW5ob3VzZS1zY3JhcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy9sZXZlci1zY3JhcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy9nZW5lcmljLXNjcmFwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL3NjcmFwZXItcmVnaXN0cnkudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9zaGFyZWQvbWVzc2FnZXMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEZpZWxkIGRldGVjdGlvbiBwYXR0ZXJucyBmb3IgYXV0by1maWxsXG5leHBvcnQgY29uc3QgRklFTERfUEFUVEVSTlMgPSBbXG4gICAgLy8gTmFtZSBmaWVsZHNcbiAgICB7XG4gICAgICAgIHR5cGU6ICdmaXJzdE5hbWUnLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFsnZ2l2ZW4tbmFtZScsICdmaXJzdC1uYW1lJ10sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9maXJzdC4/bmFtZS9pLCAvZm5hbWUvaSwgL2dpdmVuLj9uYW1lL2ksIC9mb3JlbmFtZS9pXSxcbiAgICAgICAgaWRQYXR0ZXJuczogWy9maXJzdC4/bmFtZS9pLCAvZm5hbWUvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvZmlyc3RcXHMqbmFtZS9pLCAvZ2l2ZW5cXHMqbmFtZS9pLCAvZm9yZW5hbWUvaV0sXG4gICAgICAgIHBsYWNlaG9sZGVyUGF0dGVybnM6IFsvZmlyc3RcXHMqbmFtZS9pXSxcbiAgICAgICAgbmVnYXRpdmVQYXR0ZXJuczogWy9sYXN0L2ksIC9jb21wYW55L2ksIC9taWRkbGUvaSwgL2J1c2luZXNzL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnbGFzdE5hbWUnLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFsnZmFtaWx5LW5hbWUnLCAnbGFzdC1uYW1lJ10sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9sYXN0Lj9uYW1lL2ksIC9sbmFtZS9pLCAvc3VybmFtZS9pLCAvZmFtaWx5Lj9uYW1lL2ldLFxuICAgICAgICBpZFBhdHRlcm5zOiBbL2xhc3QuP25hbWUvaSwgL2xuYW1lL2ksIC9zdXJuYW1lL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2xhc3RcXHMqbmFtZS9pLCAvc3VybmFtZS9pLCAvZmFtaWx5XFxzKm5hbWUvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvZmlyc3QvaSwgL2NvbXBhbnkvaSwgL2J1c2luZXNzL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnZnVsbE5hbWUnLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFsnbmFtZSddLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvXm5hbWUkL2ksIC9mdWxsLj9uYW1lL2ksIC95b3VyLj9uYW1lL2ksIC9jYW5kaWRhdGUuP25hbWUvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvXm5hbWUkL2ksIC9mdWxsXFxzKm5hbWUvaSwgL3lvdXJcXHMqbmFtZS9pLCAvXm5hbWVcXHMqXFwqL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2NvbXBhbnkvaSwgL2ZpcnN0L2ksIC9sYXN0L2ksIC91c2VyL2ksIC9idXNpbmVzcy9pLCAvam9iL2ldLFxuICAgIH0sXG4gICAgLy8gQ29udGFjdCBmaWVsZHNcbiAgICB7XG4gICAgICAgIHR5cGU6ICdlbWFpbCcsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogWydlbWFpbCddLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZT8tP21haWwvaSwgL2VtYWlsLj9hZGRyZXNzL2ldLFxuICAgICAgICBpZFBhdHRlcm5zOiBbL2U/LT9tYWlsL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2UtP21haWwvaSwgL2VtYWlsXFxzKmFkZHJlc3MvaV0sXG4gICAgICAgIHBsYWNlaG9sZGVyUGF0dGVybnM6IFsvZS0/bWFpbC9pLCAvQC9dLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAncGhvbmUnLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFsndGVsJywgJ3RlbC1uYXRpb25hbCcsICd0ZWwtbG9jYWwnXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3Bob25lL2ksIC9tb2JpbGUvaSwgL2NlbGwvaSwgL3RlbCg/OmVwaG9uZSk/L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3Bob25lL2ksIC9tb2JpbGUvaSwgL2NlbGwvaSwgL3RlbGVwaG9uZS9pLCAvY29udGFjdFxccypudW1iZXIvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdhZGRyZXNzJyxcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbJ3N0cmVldC1hZGRyZXNzJywgJ2FkZHJlc3MtbGluZTEnXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2FkZHJlc3MvaSwgL3N0cmVldC9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9hZGRyZXNzL2ksIC9zdHJlZXQvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvZW1haWwvaSwgL3dlYi9pLCAvdXJsL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnY2l0eScsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogWydhZGRyZXNzLWxldmVsMiddLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvY2l0eS9pLCAvdG93bi9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9jaXR5L2ksIC90b3duL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnc3RhdGUnLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFsnYWRkcmVzcy1sZXZlbDEnXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3N0YXRlL2ksIC9wcm92aW5jZS9pLCAvcmVnaW9uL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3N0YXRlL2ksIC9wcm92aW5jZS9pLCAvcmVnaW9uL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnemlwQ29kZScsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogWydwb3N0YWwtY29kZSddLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvemlwL2ksIC9wb3N0YWwvaSwgL3Bvc3Rjb2RlL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3ppcC9pLCAvcG9zdGFsL2ksIC9wb3N0XFxzKmNvZGUvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdjb3VudHJ5JyxcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbJ2NvdW50cnknLCAnY291bnRyeS1uYW1lJ10sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9jb3VudHJ5L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2NvdW50cnkvaV0sXG4gICAgfSxcbiAgICAvLyBTb2NpYWwvUHJvZmVzc2lvbmFsIGxpbmtzXG4gICAge1xuICAgICAgICB0eXBlOiAnbGlua2VkaW4nLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvbGlua2VkaW4vaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvbGlua2VkaW4vaV0sXG4gICAgICAgIHBsYWNlaG9sZGVyUGF0dGVybnM6IFsvbGlua2VkaW5cXC5jb20vaSwgL2xpbmtlZGluL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnZ2l0aHViJyxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2dpdGh1Yi9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9naXRodWIvaV0sXG4gICAgICAgIHBsYWNlaG9sZGVyUGF0dGVybnM6IFsvZ2l0aHViXFwuY29tL2ksIC9naXRodWIvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICd3ZWJzaXRlJyxcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbJ3VybCddLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvd2Vic2l0ZS9pLCAvcG9ydGZvbGlvL2ksIC9wZXJzb25hbC4/c2l0ZS9pLCAvYmxvZy9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy93ZWJzaXRlL2ksIC9wb3J0Zm9saW8vaSwgL3BlcnNvbmFsXFxzKihzaXRlfHVybCkvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvbGlua2VkaW4vaSwgL2dpdGh1Yi9pLCAvY29tcGFueS9pXSxcbiAgICB9LFxuICAgIC8vIEVtcGxveW1lbnQgZmllbGRzXG4gICAge1xuICAgICAgICB0eXBlOiAnY3VycmVudENvbXBhbnknLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFsnb3JnYW5pemF0aW9uJ10sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9jdXJyZW50Lj9jb21wYW55L2ksIC9lbXBsb3llci9pLCAvY29tcGFueS4/bmFtZS9pLCAvb3JnYW5pemF0aW9uL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2N1cnJlbnRcXHMqKGNvbXBhbnl8ZW1wbG95ZXIpL2ksIC9jb21wYW55XFxzKm5hbWUvaSwgL2VtcGxveWVyL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL3ByZXZpb3VzL2ksIC9wYXN0L2ksIC9mb3JtZXIvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdjdXJyZW50VGl0bGUnLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFsnb3JnYW5pemF0aW9uLXRpdGxlJ10sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9jdXJyZW50Lj90aXRsZS9pLCAvam9iLj90aXRsZS9pLCAvcG9zaXRpb24vaSwgL3JvbGUvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvY3VycmVudFxccyoodGl0bGV8cG9zaXRpb258cm9sZSkvaSwgL2pvYlxccyp0aXRsZS9pXSxcbiAgICAgICAgbmVnYXRpdmVQYXR0ZXJuczogWy9wcmV2aW91cy9pLCAvcGFzdC9pLCAvZGVzaXJlZC9pLCAvYXBwbHlpbmcvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICd5ZWFyc0V4cGVyaWVuY2UnLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsveWVhcnM/Lj8ob2YpPy4/ZXhwZXJpZW5jZS9pLCAvZXhwZXJpZW5jZS4/eWVhcnMvaSwgL3lvZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy95ZWFycz9cXHMqKG9mXFxzKik/ZXhwZXJpZW5jZS9pLCAvdG90YWxcXHMqZXhwZXJpZW5jZS9pLCAvaG93XFxzKm1hbnlcXHMqeWVhcnMvaV0sXG4gICAgfSxcbiAgICAvLyBFZHVjYXRpb24gZmllbGRzXG4gICAge1xuICAgICAgICB0eXBlOiAnc2Nob29sJyxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3NjaG9vbC9pLCAvdW5pdmVyc2l0eS9pLCAvY29sbGVnZS9pLCAvaW5zdGl0dXRpb24vaSwgL2FsbWEuP21hdGVyL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3NjaG9vbC9pLCAvdW5pdmVyc2l0eS9pLCAvY29sbGVnZS9pLCAvaW5zdGl0dXRpb24vaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvaGlnaFxccypzY2hvb2wvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdkZWdyZWUnLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZGVncmVlL2ksIC9xdWFsaWZpY2F0aW9uL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2RlZ3JlZS9pLCAvcXVhbGlmaWNhdGlvbi9pLCAvbGV2ZWxcXHMqb2ZcXHMqZWR1Y2F0aW9uL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnZmllbGRPZlN0dWR5JyxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2ZpZWxkLj9vZi4/c3R1ZHkvaSwgL21ham9yL2ksIC9jb25jZW50cmF0aW9uL2ksIC9zcGVjaWFsaXphdGlvbi9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9maWVsZFxccypvZlxccypzdHVkeS9pLCAvbWFqb3IvaSwgL2FyZWFcXHMqb2ZcXHMqc3R1ZHkvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdncmFkdWF0aW9uWWVhcicsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9ncmFkdWF0aW9uLj8oeWVhcnxkYXRlKS9pLCAvZ3JhZC4/eWVhci9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9ncmFkdWF0aW9uXFxzKih5ZWFyfGRhdGUpL2ksIC95ZWFyXFxzKm9mXFxzKmdyYWR1YXRpb24vaSwgL3doZW5cXHMqZGlkXFxzKnlvdVxccypncmFkdWF0ZS9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogJ2dwYScsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9ncGEvaSwgL2dyYWRlLj9wb2ludC9pLCAvY2dwYS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9ncGEvaSwgL2dyYWRlXFxzKnBvaW50L2ksIC9jdW11bGF0aXZlXFxzKmdwYS9pXSxcbiAgICB9LFxuICAgIC8vIERvY3VtZW50c1xuICAgIHtcbiAgICAgICAgdHlwZTogJ3Jlc3VtZScsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9yZXN1bWUvaSwgL2N2L2ksIC9jdXJyaWN1bHVtLj92aXRhZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9yZXN1bWUvaSwgL2N2L2ksIC9jdXJyaWN1bHVtXFxzKnZpdGFlL2ksIC91cGxvYWRcXHMqKHlvdXJcXHMqKT9yZXN1bWUvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdjb3ZlckxldHRlcicsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9jb3Zlci4/bGV0dGVyL2ksIC9tb3RpdmF0aW9uLj9sZXR0ZXIvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvY292ZXJcXHMqbGV0dGVyL2ksIC9tb3RpdmF0aW9uXFxzKmxldHRlci9pXSxcbiAgICB9LFxuICAgIC8vIENvbXBlbnNhdGlvblxuICAgIHtcbiAgICAgICAgdHlwZTogJ3NhbGFyeScsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9zYWxhcnkvaSwgL2NvbXBlbnNhdGlvbi9pLCAvcGF5L2ksIC93YWdlL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3NhbGFyeS9pLCAvY29tcGVuc2F0aW9uL2ksIC9leHBlY3RlZFxccyooc2FsYXJ5fHBheSkvaSwgL2Rlc2lyZWRcXHMqc2FsYXJ5L2ldLFxuICAgIH0sXG4gICAgLy8gQXZhaWxhYmlsaXR5XG4gICAge1xuICAgICAgICB0eXBlOiAnc3RhcnREYXRlJyxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3N0YXJ0Lj9kYXRlL2ksIC9hdmFpbGFibGUuP2RhdGUvaSwgL2VhcmxpZXN0Lj9zdGFydC9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9zdGFydFxccypkYXRlL2ksIC93aGVuXFxzKmNhblxccyp5b3VcXHMqc3RhcnQvaSwgL2VhcmxpZXN0XFxzKnN0YXJ0L2ksIC9hdmFpbGFiaWxpdHkvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvZW5kL2ksIC9maW5pc2gvaV0sXG4gICAgfSxcbiAgICAvLyBMZWdhbC9Db21wbGlhbmNlXG4gICAge1xuICAgICAgICB0eXBlOiAnd29ya0F1dGhvcml6YXRpb24nLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvd29yay4/YXV0aC9pLCAvYXV0aG9yaXplZC4/dG8uP3dvcmsvaSwgL2xlZ2FsbHkuP3dvcmsvaSwgL3dvcmsuP3Blcm1pdC9pLCAvdmlzYS4/c3RhdHVzL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2F1dGhvcml6ZWRcXHMqdG9cXHMqd29yay9pLCAvbGVnYWxseVxccyooYXV0aG9yaXplZHxwZXJtaXR0ZWQpL2ksIC93b3JrXFxzKmF1dGhvcml6YXRpb24vaSwgL3JpZ2h0XFxzKnRvXFxzKndvcmsvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdzcG9uc29yc2hpcCcsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9zcG9uc29yL2ksIC92aXNhLj9zcG9uc29yL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3Nwb25zb3IvaSwgL3Zpc2FcXHMqc3BvbnNvci9pLCAvcmVxdWlyZVxccypzcG9uc29yc2hpcC9pLCAvbmVlZFxccypzcG9uc29yc2hpcC9pXSxcbiAgICB9LFxuICAgIC8vIEVFTyBmaWVsZHNcbiAgICB7XG4gICAgICAgIHR5cGU6ICd2ZXRlcmFuU3RhdHVzJyxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3ZldGVyYW4vaSwgL21pbGl0YXJ5L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3ZldGVyYW4vaSwgL21pbGl0YXJ5XFxzKnN0YXR1cy9pLCAvc2VydmVkXFxzKmluL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnZGlzYWJpbGl0eScsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9kaXNhYmlsaXR5L2ksIC9kaXNhYmxlZC9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9kaXNhYmlsaXR5L2ksIC9kaXNhYmxlZC9pLCAvYWNjb21tb2RhdGlvbi9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogJ2dlbmRlcicsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9nZW5kZXIvaSwgL3NleC9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9nZW5kZXIvaSwgL3NleC9pXSxcbiAgICAgICAgbmVnYXRpdmVQYXR0ZXJuczogWy9pZGVudGl0eS9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogJ2V0aG5pY2l0eScsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9ldGhuaWNpdHkvaSwgL3JhY2UvaSwgL2V0aG5pYy9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9ldGhuaWNpdHkvaSwgL3JhY2UvaSwgL2V0aG5pY1xccypiYWNrZ3JvdW5kL2ldLFxuICAgIH0sXG4gICAgLy8gU2tpbGxzXG4gICAge1xuICAgICAgICB0eXBlOiAnc2tpbGxzJyxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3NraWxscz8vaSwgL2V4cGVydGlzZS9pLCAvY29tcGV0ZW5jL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3NraWxscz8vaSwgL3RlY2huaWNhbFxccypza2lsbHMvaSwgL2tleVxccypza2lsbHMvaV0sXG4gICAgfSxcbiAgICAvLyBTdW1tYXJ5L0Jpb1xuICAgIHtcbiAgICAgICAgdHlwZTogJ3N1bW1hcnknLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvc3VtbWFyeS9pLCAvYmlvL2ksIC9hYm91dC4/eW91L2ksIC9wcm9maWxlL2ksIC9pbnRyb2R1Y3Rpb24vaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvc3VtbWFyeS9pLCAvcHJvZmVzc2lvbmFsXFxzKnN1bW1hcnkvaSwgL2Fib3V0XFxzKnlvdS9pLCAvdGVsbFxccyp1c1xccyphYm91dC9pLCAvYmlvL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2pvYi9pLCAvcG9zaXRpb24vaV0sXG4gICAgfSxcbl07XG4vLyBKb2Igc2l0ZSBVUkwgcGF0dGVybnMgZm9yIHNjcmFwZXIgZGV0ZWN0aW9uXG5leHBvcnQgY29uc3QgSk9CX1NJVEVfUEFUVEVSTlMgPSB7XG4gICAgbGlua2VkaW46IFtcbiAgICAgICAgL2xpbmtlZGluXFwuY29tXFwvam9ic1xcL3ZpZXdcXC8vLFxuICAgICAgICAvbGlua2VkaW5cXC5jb21cXC9qb2JzXFwvc2VhcmNoLyxcbiAgICAgICAgL2xpbmtlZGluXFwuY29tXFwvam9ic1xcL2NvbGxlY3Rpb25zLyxcbiAgICBdLFxuICAgIGluZGVlZDogW1xuICAgICAgICAvaW5kZWVkXFwuY29tXFwvdmlld2pvYi8sXG4gICAgICAgIC9pbmRlZWRcXC5jb21cXC9qb2JzLyxcbiAgICAgICAgL2luZGVlZFxcLmNvbVxcL2NtcFxcLy4rXFwvam9icy8sXG4gICAgXSxcbiAgICBncmVlbmhvdXNlOiBbXG4gICAgICAgIC9ib2FyZHNcXC5ncmVlbmhvdXNlXFwuaW9cXC8vLFxuICAgICAgICAvZ3JlZW5ob3VzZVxcLmlvXFwvLipcXC9qb2JzXFwvLyxcbiAgICBdLFxuICAgIGxldmVyOiBbXG4gICAgICAgIC9qb2JzXFwubGV2ZXJcXC5jb1xcLy8sXG4gICAgICAgIC9sZXZlclxcLmNvXFwvLipcXC9qb2JzXFwvLyxcbiAgICBdLFxuICAgIHdhdGVybG9vV29ya3M6IFtcbiAgICAgICAgL3dhdGVybG9vd29ya3NcXC51d2F0ZXJsb29cXC5jYS8sXG4gICAgXSxcbiAgICB3b3JrZGF5OiBbXG4gICAgICAgIC9teXdvcmtkYXlqb2JzXFwuY29tLyxcbiAgICAgICAgL3dvcmtkYXlqb2JzXFwuY29tLyxcbiAgICBdLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RKb2JTaXRlKHVybCkge1xuICAgIGZvciAoY29uc3QgW3NpdGUsIHBhdHRlcm5zXSBvZiBPYmplY3QuZW50cmllcyhKT0JfU0lURV9QQVRURVJOUykpIHtcbiAgICAgICAgaWYgKHBhdHRlcm5zLnNvbWUocCA9PiBwLnRlc3QodXJsKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzaXRlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAndW5rbm93bic7XG59XG4vLyBDb21tb24gcXVlc3Rpb24gcGF0dGVybnMgZm9yIGxlYXJuaW5nIHN5c3RlbVxuZXhwb3J0IGNvbnN0IENVU1RPTV9RVUVTVElPTl9JTkRJQ0FUT1JTID0gW1xuICAgIC93aHkuKih3YW50fGludGVyZXN0ZWR8YXBwbHl8am9pbikvaSxcbiAgICAvd2hhdC4qKG1ha2VzfGF0dHJhY3RlZHxleGNpdGVzKS9pLFxuICAgIC90ZWxsLiphYm91dC4qeW91cnNlbGYvaSxcbiAgICAvZGVzY3JpYmUuKihzaXR1YXRpb258dGltZXxleHBlcmllbmNlKS9pLFxuICAgIC9ob3cuKmhhbmRsZS9pLFxuICAgIC9ncmVhdGVzdC4qKHN0cmVuZ3RofHdlYWtuZXNzfGFjaGlldmVtZW50KS9pLFxuICAgIC93aGVyZS4qc2VlLip5b3Vyc2VsZi9pLFxuICAgIC93aHkuKnNob3VsZC4qaGlyZS9pLFxuICAgIC93aGF0Lipjb250cmlidXRlL2ksXG4gICAgL3NhbGFyeS4qZXhwZWN0YXRpb24vaSxcbiAgICAvYWRkaXRpb25hbC4qaW5mb3JtYXRpb24vaSxcbiAgICAvYW55dGhpbmcuKmVsc2UvaSxcbl07XG4iLCIvLyBGaWVsZCBkZXRlY3Rpb24gZm9yIGF1dG8tZmlsbFxuaW1wb3J0IHsgRklFTERfUEFUVEVSTlMsIENVU1RPTV9RVUVTVElPTl9JTkRJQ0FUT1JTIH0gZnJvbSAnQC9zaGFyZWQvZmllbGQtcGF0dGVybnMnO1xuZXhwb3J0IGNsYXNzIEZpZWxkRGV0ZWN0b3Ige1xuICAgIGRldGVjdEZpZWxkcyhmb3JtKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IFtdO1xuICAgICAgICBjb25zdCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0Jyk7XG4gICAgICAgIGZvciAoY29uc3QgaW5wdXQgb2YgaW5wdXRzKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gaW5wdXQ7XG4gICAgICAgICAgICAvLyBTa2lwIGhpZGRlbiwgZGlzYWJsZWQsIG9yIHN1Ym1pdCBpbnB1dHNcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZFNraXBFbGVtZW50KGVsZW1lbnQpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3QgZGV0ZWN0aW9uID0gdGhpcy5kZXRlY3RGaWVsZFR5cGUoZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoZGV0ZWN0aW9uLmZpZWxkVHlwZSAhPT0gJ3Vua25vd24nIHx8IGRldGVjdGlvbi5jb25maWRlbmNlID4gMC4xKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzLnB1c2goZGV0ZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cbiAgICBzaG91bGRTa2lwRWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZWxlbWVudDtcbiAgICAgICAgLy8gQ2hlY2sgY29tcHV0ZWQgc3R5bGUgZm9yIHZpc2liaWxpdHlcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgICAgICAgaWYgKHN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fCBzdHlsZS52aXNpYmlsaXR5ID09PSAnaGlkZGVuJykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZGlzYWJsZWQgc3RhdGVcbiAgICAgICAgaWYgKGlucHV0LmRpc2FibGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIC8vIENoZWNrIGlucHV0IHR5cGVcbiAgICAgICAgY29uc3Qgc2tpcFR5cGVzID0gWydoaWRkZW4nLCAnc3VibWl0JywgJ2J1dHRvbicsICdyZXNldCcsICdpbWFnZScsICdmaWxlJ107XG4gICAgICAgIGlmIChza2lwVHlwZXMuaW5jbHVkZXMoaW5wdXQudHlwZSkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBhIENTUkYvdG9rZW4gZmllbGRcbiAgICAgICAgaWYgKGlucHV0Lm5hbWU/LmluY2x1ZGVzKCdjc3JmJykgfHwgaW5wdXQubmFtZT8uaW5jbHVkZXMoJ3Rva2VuJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZGV0ZWN0RmllbGRUeXBlKGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3Qgc2lnbmFscyA9IHRoaXMuZ2F0aGVyU2lnbmFscyhlbGVtZW50KTtcbiAgICAgICAgY29uc3Qgc2NvcmVzID0gdGhpcy5zY29yZUFsbFBhdHRlcm5zKHNpZ25hbHMpO1xuICAgICAgICAvLyBHZXQgYmVzdCBtYXRjaFxuICAgICAgICBzY29yZXMuc29ydCgoYSwgYikgPT4gYi5jb25maWRlbmNlIC0gYS5jb25maWRlbmNlKTtcbiAgICAgICAgY29uc3QgYmVzdCA9IHNjb3Jlc1swXTtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHRoaXMgaXMgYSBjdXN0b20gcXVlc3Rpb25cbiAgICAgICAgbGV0IGZpZWxkVHlwZSA9IGJlc3Q/LmZpZWxkVHlwZSB8fCAndW5rbm93bic7XG4gICAgICAgIGxldCBjb25maWRlbmNlID0gYmVzdD8uY29uZmlkZW5jZSB8fCAwO1xuICAgICAgICBpZiAoY29uZmlkZW5jZSA8IDAuMykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaXQgbG9va3MgbGlrZSBhIGN1c3RvbSBxdWVzdGlvblxuICAgICAgICAgICAgaWYgKHRoaXMubG9va3NMaWtlQ3VzdG9tUXVlc3Rpb24oc2lnbmFscykpIHtcbiAgICAgICAgICAgICAgICBmaWVsZFR5cGUgPSAnY3VzdG9tUXVlc3Rpb24nO1xuICAgICAgICAgICAgICAgIGNvbmZpZGVuY2UgPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBmaWVsZFR5cGUsXG4gICAgICAgICAgICBjb25maWRlbmNlLFxuICAgICAgICAgICAgbGFiZWw6IHNpZ25hbHMubGFiZWwgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHNpZ25hbHMucGxhY2Vob2xkZXIgfHwgdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnYXRoZXJTaWduYWxzKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGVsZW1lbnQubmFtZT8udG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkPy50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICAgICAgdHlwZTogZWxlbWVudC50eXBlIHx8ICd0ZXh0JyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbGVtZW50LnBsYWNlaG9sZGVyPy50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICAgICAgYXV0b2NvbXBsZXRlOiBlbGVtZW50LmF1dG9jb21wbGV0ZSB8fCAnJyxcbiAgICAgICAgICAgIGxhYmVsOiB0aGlzLmZpbmRMYWJlbChlbGVtZW50KT8udG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIGFyaWFMYWJlbDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKT8udG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIG5lYXJieVRleHQ6IHRoaXMuZ2V0TmVhcmJ5VGV4dChlbGVtZW50KT8udG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIHBhcmVudENsYXNzZXM6IHRoaXMuZ2V0UGFyZW50Q2xhc3NlcyhlbGVtZW50KSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc2NvcmVBbGxQYXR0ZXJucyhzaWduYWxzKSB7XG4gICAgICAgIHJldHVybiBGSUVMRF9QQVRURVJOUy5tYXAoKHBhdHRlcm4pID0+ICh7XG4gICAgICAgICAgICBmaWVsZFR5cGU6IHBhdHRlcm4udHlwZSxcbiAgICAgICAgICAgIGNvbmZpZGVuY2U6IHRoaXMuY2FsY3VsYXRlQ29uZmlkZW5jZShzaWduYWxzLCBwYXR0ZXJuKSxcbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICBjYWxjdWxhdGVDb25maWRlbmNlKHNpZ25hbHMsIHBhdHRlcm4pIHtcbiAgICAgICAgbGV0IHNjb3JlID0gMDtcbiAgICAgICAgbGV0IG1heFNjb3JlID0gMDtcbiAgICAgICAgLy8gV2VpZ2h0IGRpZmZlcmVudCBzaWduYWxzXG4gICAgICAgIGNvbnN0IHdlaWdodHMgPSB7XG4gICAgICAgICAgICBhdXRvY29tcGxldGU6IDAuNCxcbiAgICAgICAgICAgIG5hbWU6IDAuMixcbiAgICAgICAgICAgIGlkOiAwLjE1LFxuICAgICAgICAgICAgbGFiZWw6IDAuMTUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogMC4xLFxuICAgICAgICAgICAgYXJpYUxhYmVsOiAwLjEsXG4gICAgICAgIH07XG4gICAgICAgIC8vIENoZWNrIGF1dG9jb21wbGV0ZSBhdHRyaWJ1dGUgKG1vc3QgcmVsaWFibGUpXG4gICAgICAgIGlmIChzaWduYWxzLmF1dG9jb21wbGV0ZSAmJiBwYXR0ZXJuLmF1dG9jb21wbGV0ZVZhbHVlcz8uaW5jbHVkZXMoc2lnbmFscy5hdXRvY29tcGxldGUpKSB7XG4gICAgICAgICAgICBzY29yZSArPSB3ZWlnaHRzLmF1dG9jb21wbGV0ZTtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLmF1dG9jb21wbGV0ZTtcbiAgICAgICAgLy8gQ2hlY2sgbmFtZSBhdHRyaWJ1dGVcbiAgICAgICAgaWYgKHBhdHRlcm4ubmFtZVBhdHRlcm5zPy5zb21lKChwKSA9PiBwLnRlc3Qoc2lnbmFscy5uYW1lKSkpIHtcbiAgICAgICAgICAgIHNjb3JlICs9IHdlaWdodHMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLm5hbWU7XG4gICAgICAgIC8vIENoZWNrIElEXG4gICAgICAgIGlmIChwYXR0ZXJuLmlkUGF0dGVybnM/LnNvbWUoKHApID0+IHAudGVzdChzaWduYWxzLmlkKSkpIHtcbiAgICAgICAgICAgIHNjb3JlICs9IHdlaWdodHMuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgbWF4U2NvcmUgKz0gd2VpZ2h0cy5pZDtcbiAgICAgICAgLy8gQ2hlY2sgbGFiZWxcbiAgICAgICAgaWYgKHBhdHRlcm4ubGFiZWxQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMubGFiZWwpKSkge1xuICAgICAgICAgICAgc2NvcmUgKz0gd2VpZ2h0cy5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLmxhYmVsO1xuICAgICAgICAvLyBDaGVjayBwbGFjZWhvbGRlclxuICAgICAgICBpZiAocGF0dGVybi5wbGFjZWhvbGRlclBhdHRlcm5zPy5zb21lKChwKSA9PiBwLnRlc3Qoc2lnbmFscy5wbGFjZWhvbGRlcikpKSB7XG4gICAgICAgICAgICBzY29yZSArPSB3ZWlnaHRzLnBsYWNlaG9sZGVyO1xuICAgICAgICB9XG4gICAgICAgIG1heFNjb3JlICs9IHdlaWdodHMucGxhY2Vob2xkZXI7XG4gICAgICAgIC8vIENoZWNrIGFyaWEtbGFiZWxcbiAgICAgICAgaWYgKHBhdHRlcm4ubGFiZWxQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMuYXJpYUxhYmVsKSkpIHtcbiAgICAgICAgICAgIHNjb3JlICs9IHdlaWdodHMuYXJpYUxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIG1heFNjb3JlICs9IHdlaWdodHMuYXJpYUxhYmVsO1xuICAgICAgICAvLyBOZWdhdGl2ZSBzaWduYWxzIChyZWR1Y2UgY29uZmlkZW5jZSBpZiBmb3VuZClcbiAgICAgICAgaWYgKHBhdHRlcm4ubmVnYXRpdmVQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMubmFtZSkgfHwgcC50ZXN0KHNpZ25hbHMubGFiZWwpIHx8IHAudGVzdChzaWduYWxzLmlkKSkpIHtcbiAgICAgICAgICAgIHNjb3JlIC09IDAuMztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgbWF4U2NvcmUgPiAwID8gc2NvcmUgLyBtYXhTY29yZSA6IDApO1xuICAgIH1cbiAgICBmaW5kTGFiZWwoZWxlbWVudCkge1xuICAgICAgICAvLyBNZXRob2QgMTogRXhwbGljaXQgbGFiZWwgdmlhIGZvciBhdHRyaWJ1dGVcbiAgICAgICAgaWYgKGVsZW1lbnQuaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGFiZWxbZm9yPVwiJHtlbGVtZW50LmlkfVwiXWApO1xuICAgICAgICAgICAgaWYgKGxhYmVsPy50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ldGhvZCAyOiBXcmFwcGluZyBsYWJlbFxuICAgICAgICBjb25zdCBwYXJlbnRMYWJlbCA9IGVsZW1lbnQuY2xvc2VzdCgnbGFiZWwnKTtcbiAgICAgICAgaWYgKHBhcmVudExhYmVsPy50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBpbnB1dCdzIHZhbHVlIGZyb20gbGFiZWwgdGV4dFxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHBhcmVudExhYmVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBlbGVtZW50LnZhbHVlIHx8ICcnO1xuICAgICAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShpbnB1dFZhbHVlLCAnJykudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ldGhvZCAzOiBhcmlhLWxhYmVsbGVkYnlcbiAgICAgICAgY29uc3QgbGFiZWxsZWRCeSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgICAgICAgaWYgKGxhYmVsbGVkQnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYWJlbGxlZEJ5KTtcbiAgICAgICAgICAgIGlmIChsYWJlbEVsPy50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWxFbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWV0aG9kIDQ6IFByZXZpb3VzIHNpYmxpbmcgbGFiZWxcbiAgICAgICAgbGV0IHNpYmxpbmcgPSBlbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIHdoaWxlIChzaWJsaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2libGluZy50YWdOYW1lID09PSAnTEFCRUwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpYmxpbmcudGV4dENvbnRlbnQ/LnRyaW0oKSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2libGluZyA9IHNpYmxpbmcucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgfVxuICAgICAgICAvLyBNZXRob2QgNTogUGFyZW50J3MgcHJldmlvdXMgc2libGluZyBsYWJlbFxuICAgICAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGxldCBwYXJlbnRTaWJsaW5nID0gcGFyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAocGFyZW50U2libGluZz8udGFnTmFtZSA9PT0gJ0xBQkVMJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnRTaWJsaW5nLnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZ2V0TmVhcmJ5VGV4dChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQuY2xvc2VzdCgnLmZvcm0tZ3JvdXAsIC5maWVsZCwgLmlucHV0LXdyYXBwZXIsIFtjbGFzcyo9XCJmaWVsZFwiXSwgW2NsYXNzKj1cImlucHV0XCJdJyk7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwYXJlbnQudGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoIDwgMjAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnZXRQYXJlbnRDbGFzc2VzKGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IFtdO1xuICAgICAgICBsZXQgY3VycmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgbGV0IGRlcHRoID0gMDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgJiYgZGVwdGggPCAzKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goLi4uY3VycmVudC5jbGFzc05hbWUuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsYXNzZXM7XG4gICAgfVxuICAgIGxvb2tzTGlrZUN1c3RvbVF1ZXN0aW9uKHNpZ25hbHMpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGAke3NpZ25hbHMubGFiZWx9ICR7c2lnbmFscy5wbGFjZWhvbGRlcn0gJHtzaWduYWxzLm5lYXJieVRleHR9YDtcbiAgICAgICAgcmV0dXJuIENVU1RPTV9RVUVTVElPTl9JTkRJQ0FUT1JTLnNvbWUoKHBhdHRlcm4pID0+IHBhdHRlcm4udGVzdCh0ZXh0KSk7XG4gICAgfVxufVxuIiwiLy8gRmllbGQtdG8tcHJvZmlsZSB2YWx1ZSBtYXBwaW5nXG5leHBvcnQgY2xhc3MgRmllbGRNYXBwZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2ZpbGUpIHtcbiAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICB9XG4gICAgbWFwRmllbGRUb1ZhbHVlKGZpZWxkKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkLmZpZWxkVHlwZTtcbiAgICAgICAgY29uc3QgbWFwcGluZyA9IHRoaXMuZ2V0TWFwcGluZ3MoKTtcbiAgICAgICAgY29uc3QgbWFwcGVyID0gbWFwcGluZ1tmaWVsZFR5cGVdO1xuICAgICAgICBpZiAobWFwcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwcGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldE1hcHBpbmdzKCkge1xuICAgICAgICBjb25zdCBwID0gdGhpcy5wcm9maWxlO1xuICAgICAgICBjb25zdCBjID0gcC5jb21wdXRlZDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIE5hbWUgZmllbGRzXG4gICAgICAgICAgICBmaXJzdE5hbWU6ICgpID0+IGM/LmZpcnN0TmFtZSB8fCBudWxsLFxuICAgICAgICAgICAgbGFzdE5hbWU6ICgpID0+IGM/Lmxhc3ROYW1lIHx8IG51bGwsXG4gICAgICAgICAgICBmdWxsTmFtZTogKCkgPT4gcC5jb250YWN0Py5uYW1lIHx8IG51bGwsXG4gICAgICAgICAgICAvLyBDb250YWN0IGZpZWxkc1xuICAgICAgICAgICAgZW1haWw6ICgpID0+IHAuY29udGFjdD8uZW1haWwgfHwgbnVsbCxcbiAgICAgICAgICAgIHBob25lOiAoKSA9PiBwLmNvbnRhY3Q/LnBob25lIHx8IG51bGwsXG4gICAgICAgICAgICBhZGRyZXNzOiAoKSA9PiBwLmNvbnRhY3Q/LmxvY2F0aW9uIHx8IG51bGwsXG4gICAgICAgICAgICBjaXR5OiAoKSA9PiB0aGlzLmV4dHJhY3RDaXR5KHAuY29udGFjdD8ubG9jYXRpb24pLFxuICAgICAgICAgICAgc3RhdGU6ICgpID0+IHRoaXMuZXh0cmFjdFN0YXRlKHAuY29udGFjdD8ubG9jYXRpb24pLFxuICAgICAgICAgICAgemlwQ29kZTogKCkgPT4gbnVsbCwgLy8gTm90IHR5cGljYWxseSBzdG9yZWRcbiAgICAgICAgICAgIGNvdW50cnk6ICgpID0+IHRoaXMuZXh0cmFjdENvdW50cnkocC5jb250YWN0Py5sb2NhdGlvbiksXG4gICAgICAgICAgICAvLyBTb2NpYWwvUHJvZmVzc2lvbmFsXG4gICAgICAgICAgICBsaW5rZWRpbjogKCkgPT4gcC5jb250YWN0Py5saW5rZWRpbiB8fCBudWxsLFxuICAgICAgICAgICAgZ2l0aHViOiAoKSA9PiBwLmNvbnRhY3Q/LmdpdGh1YiB8fCBudWxsLFxuICAgICAgICAgICAgd2Vic2l0ZTogKCkgPT4gcC5jb250YWN0Py53ZWJzaXRlIHx8IG51bGwsXG4gICAgICAgICAgICBwb3J0Zm9saW86ICgpID0+IHAuY29udGFjdD8ud2Vic2l0ZSB8fCBudWxsLFxuICAgICAgICAgICAgLy8gRW1wbG95bWVudFxuICAgICAgICAgICAgY3VycmVudENvbXBhbnk6ICgpID0+IGM/LmN1cnJlbnRDb21wYW55IHx8IG51bGwsXG4gICAgICAgICAgICBjdXJyZW50VGl0bGU6ICgpID0+IGM/LmN1cnJlbnRUaXRsZSB8fCBudWxsLFxuICAgICAgICAgICAgeWVhcnNFeHBlcmllbmNlOiAoKSA9PiBjPy55ZWFyc0V4cGVyaWVuY2U/LnRvU3RyaW5nKCkgfHwgbnVsbCxcbiAgICAgICAgICAgIC8vIEVkdWNhdGlvblxuICAgICAgICAgICAgc2Nob29sOiAoKSA9PiBjPy5tb3N0UmVjZW50U2Nob29sIHx8IG51bGwsXG4gICAgICAgICAgICBlZHVjYXRpb246ICgpID0+IHRoaXMuZm9ybWF0RWR1Y2F0aW9uKCksXG4gICAgICAgICAgICBkZWdyZWU6ICgpID0+IGM/Lm1vc3RSZWNlbnREZWdyZWUgfHwgbnVsbCxcbiAgICAgICAgICAgIGZpZWxkT2ZTdHVkeTogKCkgPT4gYz8ubW9zdFJlY2VudEZpZWxkIHx8IG51bGwsXG4gICAgICAgICAgICBncmFkdWF0aW9uWWVhcjogKCkgPT4gYz8uZ3JhZHVhdGlvblllYXIgfHwgbnVsbCxcbiAgICAgICAgICAgIGdwYTogKCkgPT4gcC5lZHVjYXRpb24/LlswXT8uZ3BhIHx8IG51bGwsXG4gICAgICAgICAgICAvLyBEb2N1bWVudHMgKHJldHVybiBudWxsLCBoYW5kbGVkIHNlcGFyYXRlbHkpXG4gICAgICAgICAgICByZXN1bWU6ICgpID0+IG51bGwsXG4gICAgICAgICAgICBjb3ZlckxldHRlcjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIC8vIENvbXBlbnNhdGlvblxuICAgICAgICAgICAgc2FsYXJ5OiAoKSA9PiBudWxsLCAvLyBVc2VyLXNwZWNpZmljLCBkb24ndCBhdXRvLWZpbGxcbiAgICAgICAgICAgIHNhbGFyeUV4cGVjdGF0aW9uOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgLy8gQXZhaWxhYmlsaXR5XG4gICAgICAgICAgICBzdGFydERhdGU6ICgpID0+IG51bGwsIC8vIFVzZXItc3BlY2lmaWNcbiAgICAgICAgICAgIGF2YWlsYWJpbGl0eTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIC8vIFdvcmsgYXV0aG9yaXphdGlvbiAoc2Vuc2l0aXZlLCBkb24ndCBhdXRvLWZpbGwpXG4gICAgICAgICAgICB3b3JrQXV0aG9yaXphdGlvbjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIHNwb25zb3JzaGlwOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgLy8gRUVPIGZpZWxkcyAoc2Vuc2l0aXZlLCBkb24ndCBhdXRvLWZpbGwpXG4gICAgICAgICAgICB2ZXRlcmFuU3RhdHVzOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgZGlzYWJpbGl0eTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIGdlbmRlcjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIGV0aG5pY2l0eTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIC8vIFNraWxscy9TdW1tYXJ5XG4gICAgICAgICAgICBza2lsbHM6ICgpID0+IGM/LnNraWxsc0xpc3QgfHwgbnVsbCxcbiAgICAgICAgICAgIHN1bW1hcnk6ICgpID0+IHAuc3VtbWFyeSB8fCBudWxsLFxuICAgICAgICAgICAgZXhwZXJpZW5jZTogKCkgPT4gdGhpcy5mb3JtYXRFeHBlcmllbmNlKCksXG4gICAgICAgICAgICAvLyBDdXN0b20vVW5rbm93biAoaGFuZGxlZCBieSBsZWFybmluZyBzeXN0ZW0pXG4gICAgICAgICAgICBjdXN0b21RdWVzdGlvbjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIHVua25vd246ICgpID0+IG51bGwsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGV4dHJhY3RDaXR5KGxvY2F0aW9uKSB7XG4gICAgICAgIGlmICghbG9jYXRpb24pXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgLy8gQ29tbW9uIHBhdHRlcm46IFwiQ2l0eSwgU3RhdGVcIiBvciBcIkNpdHksIFN0YXRlLCBDb3VudHJ5XCJcbiAgICAgICAgY29uc3QgcGFydHMgPSBsb2NhdGlvbi5zcGxpdCgnLCcpLm1hcCgocCkgPT4gcC50cmltKCkpO1xuICAgICAgICByZXR1cm4gcGFydHNbMF0gfHwgbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdFN0YXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIGlmICghbG9jYXRpb24pXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgY29uc3QgcGFydHMgPSBsb2NhdGlvbi5zcGxpdCgnLCcpLm1hcCgocCkgPT4gcC50cmltKCkpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBcIkNBXCIgb3IgXCJDYWxpZm9ybmlhXCIgb3IgXCJDQSA5NDEwNVwiXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHBhcnRzWzFdLnNwbGl0KCcgJylbMF07XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdENvdW50cnkobG9jYXRpb24pIHtcbiAgICAgICAgaWYgKCFsb2NhdGlvbilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IGxvY2F0aW9uLnNwbGl0KCcsJykubWFwKChwKSA9PiBwLnRyaW0oKSk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIC8vIERlZmF1bHQgdG8gVVNBIGlmIG9ubHkgY2l0eS9zdGF0ZVxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1VuaXRlZCBTdGF0ZXMnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmb3JtYXRFZHVjYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGVkdSA9IHRoaXMucHJvZmlsZS5lZHVjYXRpb24/LlswXTtcbiAgICAgICAgaWYgKCFlZHUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIGAke2VkdS5kZWdyZWV9IGluICR7ZWR1LmZpZWxkfSBmcm9tICR7ZWR1Lmluc3RpdHV0aW9ufWA7XG4gICAgfVxuICAgIGZvcm1hdEV4cGVyaWVuY2UoKSB7XG4gICAgICAgIGNvbnN0IGV4cHMgPSB0aGlzLnByb2ZpbGUuZXhwZXJpZW5jZXM7XG4gICAgICAgIGlmICghZXhwcyB8fCBleHBzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gZXhwc1xuICAgICAgICAgICAgLnNsaWNlKDAsIDMpXG4gICAgICAgICAgICAubWFwKChleHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBlcmlvZCA9IGV4cC5jdXJyZW50XG4gICAgICAgICAgICAgICAgPyBgJHtleHAuc3RhcnREYXRlfSAtIFByZXNlbnRgXG4gICAgICAgICAgICAgICAgOiBgJHtleHAuc3RhcnREYXRlfSAtICR7ZXhwLmVuZERhdGV9YDtcbiAgICAgICAgICAgIHJldHVybiBgJHtleHAudGl0bGV9IGF0ICR7ZXhwLmNvbXBhbnl9ICgke3BlcmlvZH0pYDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICB9XG4gICAgLy8gR2V0IGFsbCBtYXBwZWQgdmFsdWVzIGZvciBhIGZvcm1cbiAgICBnZXRBbGxNYXBwZWRWYWx1ZXMoZmllbGRzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5tYXBGaWVsZFRvVmFsdWUoZmllbGQpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnNldChmaWVsZC5lbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG59XG4iLCIvLyBBdXRvLWZpbGwgZW5naW5lIG9yY2hlc3RyYXRvclxuZXhwb3J0IGNsYXNzIEF1dG9GaWxsRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihkZXRlY3RvciwgbWFwcGVyKSB7XG4gICAgICAgIHRoaXMuZGV0ZWN0b3IgPSBkZXRlY3RvcjtcbiAgICAgICAgdGhpcy5tYXBwZXIgPSBtYXBwZXI7XG4gICAgfVxuICAgIGFzeW5jIGZpbGxGb3JtKGZpZWxkcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICBmaWxsZWQ6IDAsXG4gICAgICAgICAgICBza2lwcGVkOiAwLFxuICAgICAgICAgICAgZXJyb3JzOiAwLFxuICAgICAgICAgICAgZGV0YWlsczogW10sXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5tYXBwZXIubWFwRmllbGRUb1ZhbHVlKGZpZWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5za2lwcGVkKys7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5kZXRhaWxzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRUeXBlOiBmaWVsZC5maWVsZFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGxlZCA9IGF3YWl0IHRoaXMuZmlsbEZpZWxkKGZpZWxkLmVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5maWxsZWQrKztcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmRldGFpbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFR5cGU6IGZpZWxkLmZpZWxkVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc2tpcHBlZCsrO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZGV0YWlscy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkVHlwZTogZmllbGQuZmllbGRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvcnMrKztcbiAgICAgICAgICAgICAgICByZXN1bHQuZGV0YWlscy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRUeXBlOiBmaWVsZC5maWVsZFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBhc3luYyBmaWxsRmllbGQoZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBpbnB1dFR5cGUgPSBlbGVtZW50LnR5cGU/LnRvTG93ZXJDYXNlKCkgfHwgJ3RleHQnO1xuICAgICAgICAvLyBIYW5kbGUgZGlmZmVyZW50IGlucHV0IHR5cGVzXG4gICAgICAgIGlmICh0YWdOYW1lID09PSAnc2VsZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFNlbGVjdChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ05hbWUgPT09ICd0ZXh0YXJlYScpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGxUZXh0SW5wdXQoZWxlbWVudCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWdOYW1lID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGlucHV0VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgICAgICAgICBjYXNlICd0ZWwnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFRleHRJbnB1dChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWxsQ2hlY2tib3goZWxlbWVudCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFJhZGlvKGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbERhdGVJbnB1dChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFRleHRJbnB1dChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWxsVGV4dElucHV0KGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIC8vIEZvY3VzIHRoZSBlbGVtZW50XG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgLy8gQ2xlYXIgZXhpc3RpbmcgdmFsdWVcbiAgICAgICAgZWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAvLyBTZXQgbmV3IHZhbHVlXG4gICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgLy8gRGlzcGF0Y2ggZXZlbnRzIHRvIHRyaWdnZXIgdmFsaWRhdGlvbiBhbmQgZnJhbWV3b3Jrc1xuICAgICAgICB0aGlzLmRpc3BhdGNoSW5wdXRFdmVudHMoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlID09PSB2YWx1ZTtcbiAgICB9XG4gICAgZmlsbFNlbGVjdChlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBvcHRpb25zID0gQXJyYXkuZnJvbShlbGVtZW50Lm9wdGlvbnMpO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAvLyBUcnkgZXhhY3QgbWF0Y2ggZmlyc3RcbiAgICAgICAgbGV0IG1hdGNoaW5nT3B0aW9uID0gb3B0aW9ucy5maW5kKChvcHQpID0+IG9wdC52YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBub3JtYWxpemVkVmFsdWUgfHwgb3B0LnRleHQudG9Mb3dlckNhc2UoKSA9PT0gbm9ybWFsaXplZFZhbHVlKTtcbiAgICAgICAgLy8gVHJ5IHBhcnRpYWwgbWF0Y2hcbiAgICAgICAgaWYgKCFtYXRjaGluZ09wdGlvbikge1xuICAgICAgICAgICAgbWF0Y2hpbmdPcHRpb24gPSBvcHRpb25zLmZpbmQoKG9wdCkgPT4gb3B0LnZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9ybWFsaXplZFZhbHVlKSB8fFxuICAgICAgICAgICAgICAgIG9wdC50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9ybWFsaXplZFZhbHVlKSB8fFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRWYWx1ZS5pbmNsdWRlcyhvcHQudmFsdWUudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkVmFsdWUuaW5jbHVkZXMob3B0LnRleHQudG9Mb3dlckNhc2UoKSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaGluZ09wdGlvbikge1xuICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IG1hdGNoaW5nT3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaElucHV0RXZlbnRzKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWxsQ2hlY2tib3goZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qgc2hvdWxkQ2hlY2sgPSBbJ3RydWUnLCAneWVzJywgJzEnLCAnb24nXS5pbmNsdWRlcyh2YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgZWxlbWVudC5jaGVja2VkID0gc2hvdWxkQ2hlY2s7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hJbnB1dEV2ZW50cyhlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGZpbGxSYWRpbyhlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAvLyBGaW5kIHRoZSByYWRpbyBncm91cFxuICAgICAgICBjb25zdCBuYW1lID0gZWxlbWVudC5uYW1lO1xuICAgICAgICBpZiAoIW5hbWUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IHJhZGlvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGlucHV0W3R5cGU9XCJyYWRpb1wiXVtuYW1lPVwiJHtuYW1lfVwiXWApO1xuICAgICAgICBmb3IgKGNvbnN0IHJhZGlvIG9mIHJhZGlvcykge1xuICAgICAgICAgICAgY29uc3QgcmFkaW9JbnB1dCA9IHJhZGlvO1xuICAgICAgICAgICAgY29uc3QgcmFkaW9WYWx1ZSA9IHJhZGlvSW5wdXQudmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHJhZGlvTGFiZWwgPSB0aGlzLmdldFJhZGlvTGFiZWwocmFkaW9JbnB1dCk/LnRvTG93ZXJDYXNlKCkgfHwgJyc7XG4gICAgICAgICAgICBpZiAocmFkaW9WYWx1ZSA9PT0gbm9ybWFsaXplZFZhbHVlIHx8XG4gICAgICAgICAgICAgICAgcmFkaW9MYWJlbC5pbmNsdWRlcyhub3JtYWxpemVkVmFsdWUpIHx8XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFZhbHVlLmluY2x1ZGVzKHJhZGlvVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmFkaW9JbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoSW5wdXRFdmVudHMocmFkaW9JbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWxsRGF0ZUlucHV0KGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIC8vIFRyeSB0byBwYXJzZSBhbmQgZm9ybWF0IHRoZSBkYXRlXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgICAgIGlmIChpc05hTihkYXRlLmdldFRpbWUoKSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vIEZvcm1hdCBhcyBZWVlZLU1NLUREIGZvciBkYXRlIGlucHV0XG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IGRhdGUudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xuICAgICAgICBlbGVtZW50LnZhbHVlID0gZm9ybWF0dGVkO1xuICAgICAgICB0aGlzLmRpc3BhdGNoSW5wdXRFdmVudHMoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBnZXRSYWRpb0xhYmVsKHJhZGlvKSB7XG4gICAgICAgIC8vIENoZWNrIGZvciBhc3NvY2lhdGVkIGxhYmVsXG4gICAgICAgIGlmIChyYWRpby5pZCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke3JhZGlvLmlkfVwiXWApO1xuICAgICAgICAgICAgaWYgKGxhYmVsKVxuICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbC50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHdyYXBwaW5nIGxhYmVsXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHJhZGlvLmNsb3Nlc3QoJ2xhYmVsJyk7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQudGV4dENvbnRlbnQ/LnRyaW0oKSB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGZvciBuZXh0IHNpYmxpbmcgdGV4dFxuICAgICAgICBjb25zdCBuZXh0ID0gcmFkaW8ubmV4dFNpYmxpbmc7XG4gICAgICAgIGlmIChuZXh0Py5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0LnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZGlzcGF0Y2hJbnB1dEV2ZW50cyhlbGVtZW50KSB7XG4gICAgICAgIC8vIERpc3BhdGNoIGV2ZW50cyBpbiBvcmRlciB0aGF0IG1vc3QgZnJhbWV3b3JrcyBleHBlY3RcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnZm9jdXMnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2JsdXInLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICAvLyBGb3IgUmVhY3QgY29udHJvbGxlZCBjb21wb25lbnRzXG4gICAgICAgIGNvbnN0IG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5IVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZSwgJ3ZhbHVlJyk/LnNldDtcbiAgICAgICAgaWYgKG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIuY2FsbChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBCYXNlIHNjcmFwZXIgaW50ZXJmYWNlIGFuZCB1dGlsaXRpZXNcbmV4cG9ydCBjbGFzcyBCYXNlU2NyYXBlciB7XG4gICAgLy8gU2hhcmVkIHV0aWxpdGllc1xuICAgIGV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcikge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICByZXR1cm4gZWw/LnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdEh0bWxDb250ZW50KHNlbGVjdG9yKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIHJldHVybiBlbD8uaW5uZXJIVE1MPy50cmltKCkgfHwgbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdEF0dHJpYnV0ZShzZWxlY3RvciwgYXR0cikge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICByZXR1cm4gZWw/LmdldEF0dHJpYnV0ZShhdHRyKSB8fCBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0QWxsVGV4dChzZWxlY3Rvcikge1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50cylcbiAgICAgICAgICAgIC5tYXAoKGVsKSA9PiBlbC50ZXh0Q29udGVudD8udHJpbSgpKVxuICAgICAgICAgICAgLmZpbHRlcigodGV4dCkgPT4gISF0ZXh0KTtcbiAgICB9XG4gICAgd2FpdEZvckVsZW1lbnQoc2VsZWN0b3IsIHRpbWVvdXQgPSA1MDAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVsKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGVsKTtcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKF8sIG9icykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9icy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZCBhZnRlciAke3RpbWVvdXR9bXNgKSk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4dHJhY3RSZXF1aXJlbWVudHModGV4dCkge1xuICAgICAgICBjb25zdCByZXF1aXJlbWVudHMgPSBbXTtcbiAgICAgICAgLy8gU3BsaXQgYnkgY29tbW9uIGJ1bGxldCBwYXR0ZXJuc1xuICAgICAgICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoL1xcbnzigKJ84pemfOKXhnzilqp84pePfC1cXHN8XFwqXFxzLyk7XG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgICAgICAgICAgY29uc3QgY2xlYW5lZCA9IGxpbmUudHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNsZWFuZWQubGVuZ3RoID4gMjAgJiYgY2xlYW5lZC5sZW5ndGggPCA1MDApIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBpdCBsb29rcyBsaWtlIGEgcmVxdWlyZW1lbnRcbiAgICAgICAgICAgICAgICBpZiAoY2xlYW5lZC5tYXRjaCgvXih5b3V8d2V8dGhlfG11c3R8c2hvdWxkfHdpbGx8ZXhwZXJpZW5jZXxwcm9maWNpZW5jeXxrbm93bGVkZ2V8YWJpbGl0eXxzdHJvbmd8ZXhjZWxsZW50KS9pKSB8fFxuICAgICAgICAgICAgICAgICAgICBjbGVhbmVkLm1hdGNoKC9yZXF1aXJlZHxwcmVmZXJyZWR8Ym9udXN8cGx1cy9pKSB8fFxuICAgICAgICAgICAgICAgICAgICBjbGVhbmVkLm1hdGNoKC9eXFxkK1xcKz9cXHMqeWVhcnM/L2kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50cy5wdXNoKGNsZWFuZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVxdWlyZW1lbnRzLnNsaWNlKDAsIDE1KTtcbiAgICB9XG4gICAgZXh0cmFjdEtleXdvcmRzKHRleHQpIHtcbiAgICAgICAgY29uc3Qga2V5d29yZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIC8vIENvbW1vbiB0ZWNoIHNraWxscyBwYXR0ZXJuc1xuICAgICAgICBjb25zdCB0ZWNoUGF0dGVybnMgPSBbXG4gICAgICAgICAgICAvXFxiKHJlYWN0fGFuZ3VsYXJ8dnVlfHN2ZWx0ZXxuZXh0XFwuP2pzfG51eHQpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihub2RlXFwuP2pzfGV4cHJlc3N8ZmFzdGlmeXxuZXN0XFwuP2pzKVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIocHl0aG9ufGRqYW5nb3xmbGFza3xmYXN0YXBpKVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIoamF2YXxzcHJpbmd8a290bGluKVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIoZ298Z29sYW5nfHJ1c3R8Y1xcK1xcK3xjI3xcXC5uZXQpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYih0eXBlc2NyaXB0fGphdmFzY3JpcHR8ZXM2KVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIoc3FsfG15c3FsfHBvc3RncmVzcWx8bW9uZ29kYnxyZWRpc3xlbGFzdGljc2VhcmNoKVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIoYXdzfGdjcHxhenVyZXxkb2NrZXJ8a3ViZXJuZXRlc3xrOHMpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihnaXR8Y2lcXC9jZHxqZW5raW5zfGdpdGh1YlxccyphY3Rpb25zKVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIoZ3JhcGhxbHxyZXN0fGFwaXxtaWNyb3NlcnZpY2VzKVxcYi9naSxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIHRlY2hQYXR0ZXJucykge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHRleHQubWF0Y2gocGF0dGVybik7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIG1hdGNoZXMuZm9yRWFjaCgobSkgPT4ga2V5d29yZHMuYWRkKG0udG9Mb3dlckNhc2UoKS50cmltKCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShrZXl3b3Jkcyk7XG4gICAgfVxuICAgIGRldGVjdEpvYlR5cGUodGV4dCkge1xuICAgICAgICBjb25zdCBsb3dlciA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKCdpbnRlcm4nKSB8fCBsb3dlci5pbmNsdWRlcygnaW50ZXJuc2hpcCcpIHx8IGxvd2VyLmluY2x1ZGVzKCdjby1vcCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2ludGVybnNoaXAnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcygnY29udHJhY3QnKSB8fCBsb3dlci5pbmNsdWRlcygnY29udHJhY3RvcicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NvbnRyYWN0JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoJ3BhcnQtdGltZScpIHx8IGxvd2VyLmluY2x1ZGVzKCdwYXJ0IHRpbWUnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdwYXJ0LXRpbWUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcygnZnVsbC10aW1lJykgfHwgbG93ZXIuaW5jbHVkZXMoJ2Z1bGwgdGltZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Z1bGwtdGltZSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZGV0ZWN0UmVtb3RlKHRleHQpIHtcbiAgICAgICAgY29uc3QgbG93ZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiAobG93ZXIuaW5jbHVkZXMoJ3JlbW90ZScpIHx8XG4gICAgICAgICAgICBsb3dlci5pbmNsdWRlcygnd29yayBmcm9tIGhvbWUnKSB8fFxuICAgICAgICAgICAgbG93ZXIuaW5jbHVkZXMoJ3dmaCcpIHx8XG4gICAgICAgICAgICBsb3dlci5pbmNsdWRlcygnZnVsbHkgZGlzdHJpYnV0ZWQnKSB8fFxuICAgICAgICAgICAgbG93ZXIuaW5jbHVkZXMoJ2FueXdoZXJlJykpO1xuICAgIH1cbiAgICBleHRyYWN0U2FsYXJ5KHRleHQpIHtcbiAgICAgICAgLy8gTWF0Y2ggc2FsYXJ5IHBhdHRlcm5zIGxpa2UgJDEwMCwwMDAgLSAkMTUwLDAwMCBvciAkMTAwayAtICQxNTBrXG4gICAgICAgIGNvbnN0IHBhdHRlcm4gPSAvXFwkW1xcZCxdKyg/OmspPyg/OlxccypbLeKAk11cXHMqXFwkW1xcZCxdKyg/OmspPyk/KD86XFxzKig/OnBlcnxcXC8pXFxzKig/OnllYXJ8eXJ8YW5udW18YW5udWFsfGhvdXJ8aHIpKT8vZ2k7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gcGF0dGVybi5leGVjKHRleHQpO1xuICAgICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFswXSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY2xlYW5EZXNjcmlwdGlvbihodG1sKSB7XG4gICAgICAgIC8vIFJlbW92ZSBIVE1MIHRhZ3MgYnV0IHByZXNlcnZlIGxpbmUgYnJlYWtzXG4gICAgICAgIHJldHVybiBodG1sXG4gICAgICAgICAgICAucmVwbGFjZSgvPGJyXFxzKlxcLz8+L2dpLCAnXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC88XFwvcD4vZ2ksICdcXG5cXG4nKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzxcXC9kaXY+L2dpLCAnXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC88XFwvbGk+L2dpLCAnXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC88W14+XSs+L2csICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyZuYnNwOy9nLCAnICcpXG4gICAgICAgICAgICAucmVwbGFjZSgvJmFtcDsvZywgJyYnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyZndDsvZywgJz4nKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbnszLH0vZywgJ1xcblxcbicpXG4gICAgICAgICAgICAudHJpbSgpO1xuICAgIH1cbn1cbiIsIi8vIExpbmtlZEluIGpvYiBzY3JhcGVyXG5pbXBvcnQgeyBCYXNlU2NyYXBlciB9IGZyb20gJy4vYmFzZS1zY3JhcGVyJztcbmV4cG9ydCBjbGFzcyBMaW5rZWRJblNjcmFwZXIgZXh0ZW5kcyBCYXNlU2NyYXBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuc291cmNlID0gJ2xpbmtlZGluJztcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJucyA9IFtcbiAgICAgICAgICAgIC9saW5rZWRpblxcLmNvbVxcL2pvYnNcXC92aWV3XFwvKFxcZCspLyxcbiAgICAgICAgICAgIC9saW5rZWRpblxcLmNvbVxcL2pvYnNcXC9zZWFyY2gvLFxuICAgICAgICAgICAgL2xpbmtlZGluXFwuY29tXFwvam9ic1xcL2NvbGxlY3Rpb25zLyxcbiAgICAgICAgXTtcbiAgICB9XG4gICAgY2FuSGFuZGxlKHVybCkge1xuICAgICAgICByZXR1cm4gdGhpcy51cmxQYXR0ZXJucy5zb21lKChwKSA9PiBwLnRlc3QodXJsKSk7XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3RpbmcoKSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIGpvYiBkZXRhaWxzIHRvIGxvYWRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMud2FpdEZvckVsZW1lbnQoJy5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2pvYi10aXRsZSwgLmpvYnMtdW5pZmllZC10b3AtY2FyZF9fam9iLXRpdGxlJywgMzAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgLy8gVHJ5IGFsdGVybmF0aXZlIHNlbGVjdG9yc1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBtdWx0aXBsZSBzZWxlY3RvciBzdHJhdGVnaWVzIChMaW5rZWRJbiBjaGFuZ2VzIERPTSBmcmVxdWVudGx5KVxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZXh0cmFjdEpvYlRpdGxlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSB0aGlzLmV4dHJhY3RDb21wYW55KCk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5leHRyYWN0TG9jYXRpb24oKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmV4dHJhY3REZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb21wYW55IHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tDb2x1bWJ1c10gTGlua2VkSW4gc2NyYXBlcjogTWlzc2luZyByZXF1aXJlZCBmaWVsZHMnLCB7IHRpdGxlLCBjb21wYW55LCBkZXNjcmlwdGlvbjogISFkZXNjcmlwdGlvbiB9KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSB0byBleHRyYWN0IGZyb20gc3RydWN0dXJlZCBkYXRhXG4gICAgICAgIGNvbnN0IHN0cnVjdHVyZWREYXRhID0gdGhpcy5leHRyYWN0U3RydWN0dXJlZERhdGEoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbiB8fCBzdHJ1Y3R1cmVkRGF0YT8ubG9jYXRpb24sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJlcXVpcmVtZW50czogdGhpcy5leHRyYWN0UmVxdWlyZW1lbnRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIGtleXdvcmRzOiB0aGlzLmV4dHJhY3RLZXl3b3JkcyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBzYWxhcnk6IHRoaXMuZXh0cmFjdFNhbGFyeShkZXNjcmlwdGlvbikgfHwgc3RydWN0dXJlZERhdGE/LnNhbGFyeSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8ICcnKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZCgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IHN0cnVjdHVyZWREYXRhPy5wb3N0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICAvLyBKb2IgY2FyZHMgaW4gc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgY29uc3Qgam9iQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuam9iLWNhcmQtY29udGFpbmVyLCAuam9icy1zZWFyY2gtcmVzdWx0c19fbGlzdC1pdGVtLCAuc2NhZmZvbGQtbGF5b3V0X19saXN0LWl0ZW0nKTtcbiAgICAgICAgZm9yIChjb25zdCBjYXJkIG9mIGpvYkNhcmRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5qb2ItY2FyZC1saXN0X190aXRsZSwgLmpvYi1jYXJkLWNvbnRhaW5lcl9fbGluaywgYVtkYXRhLWNvbnRyb2wtbmFtZT1cImpvYl9jYXJkX3RpdGxlXCJdJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuam9iLWNhcmQtY29udGFpbmVyX19jb21wYW55LW5hbWUsIC5qb2ItY2FyZC1jb250YWluZXJfX3ByaW1hcnktZGVzY3JpcHRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuam9iLWNhcmQtY29udGFpbmVyX19tZXRhZGF0YS1pdGVtJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBhbnkgPSBjb21wYW55RWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBsb2NhdGlvbkVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHRpdGxlRWw/LmhyZWY7XG4gICAgICAgICAgICAgICAgaWYgKHRpdGxlICYmIGNvbXBhbnkgJiYgdXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGpvYnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJywgLy8gV291bGQgbmVlZCB0byBuYXZpZ2F0ZSB0byBnZXQgZnVsbCBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbQ29sdW1idXNdIEVycm9yIHNjcmFwaW5nIGpvYiBjYXJkOicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvYnM7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JUaXRsZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2pvYi10aXRsZScsXG4gICAgICAgICAgICAnLmpvYnMtdW5pZmllZC10b3AtY2FyZF9fam9iLXRpdGxlJyxcbiAgICAgICAgICAgICcudC0yNC5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2pvYi10aXRsZScsXG4gICAgICAgICAgICAnaDEudC0yNCcsXG4gICAgICAgICAgICAnLmpvYnMtdG9wLWNhcmRfX2pvYi10aXRsZScsXG4gICAgICAgICAgICAnaDFbY2xhc3MqPVwiam9iLXRpdGxlXCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdENvbXBhbnkoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICcuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19jb21wYW55LW5hbWUnLFxuICAgICAgICAgICAgJy5qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2NvbXBhbnktbmFtZScsXG4gICAgICAgICAgICAnLmpvYnMtdG9wLWNhcmRfX2NvbXBhbnktdXJsJyxcbiAgICAgICAgICAgICdhW2RhdGEtdHJhY2tpbmctY29udHJvbC1uYW1lPVwicHVibGljX2pvYnNfdG9wY2FyZC1vcmctbmFtZVwiXScsXG4gICAgICAgICAgICAnLmpvYi1kZXRhaWxzLWpvYnMtdW5pZmllZC10b3AtY2FyZF9fcHJpbWFyeS1kZXNjcmlwdGlvbi1jb250YWluZXIgYScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RMb2NhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2J1bGxldCcsXG4gICAgICAgICAgICAnLmpvYnMtdW5pZmllZC10b3AtY2FyZF9fYnVsbGV0JyxcbiAgICAgICAgICAgICcuam9icy10b3AtY2FyZF9fYnVsbGV0JyxcbiAgICAgICAgICAgICcuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19wcmltYXJ5LWRlc2NyaXB0aW9uLWNvbnRhaW5lciAudC1ibGFjay0tbGlnaHQnLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmICF0ZXh0LmluY2x1ZGVzKCdhcHBsaWNhbnQnKSAmJiAhdGV4dC5pbmNsdWRlcygnYWdvJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdERlc2NyaXB0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnLmpvYnMtZGVzY3JpcHRpb25fX2NvbnRlbnQnLFxuICAgICAgICAgICAgJy5qb2JzLWRlc2NyaXB0aW9uLWNvbnRlbnRfX3RleHQnLFxuICAgICAgICAgICAgJy5qb2JzLWJveF9faHRtbC1jb250ZW50JyxcbiAgICAgICAgICAgICcjam9iLWRldGFpbHMnLFxuICAgICAgICAgICAgJy5qb2JzLWRlc2NyaXB0aW9uJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLmV4dHJhY3RIdG1sQ29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoaHRtbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFuRGVzY3JpcHRpb24oaHRtbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZCgpIHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFwvdmlld1xcLyhcXGQrKS8pO1xuICAgICAgICByZXR1cm4gbWF0Y2g/LlsxXTtcbiAgICB9XG4gICAgZXh0cmFjdFN0cnVjdHVyZWREYXRhKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGRKc29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCJdJyk7XG4gICAgICAgICAgICBpZiAoIWxkSnNvbj8udGV4dENvbnRlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShsZEpzb24udGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogZGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8uYWRkcmVzc0xvY2FsaXR5LFxuICAgICAgICAgICAgICAgIHNhbGFyeTogZGF0YS5iYXNlU2FsYXJ5Py52YWx1ZVxuICAgICAgICAgICAgICAgICAgICA/IGAkJHtkYXRhLmJhc2VTYWxhcnkudmFsdWUubWluVmFsdWUgfHwgJyd9LSR7ZGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1heFZhbHVlIHx8ICcnfWBcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcG9zdGVkQXQ6IGRhdGEuZGF0ZVBvc3RlZCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBXYXRlcmxvbyBXb3JrcyBqb2Igc2NyYXBlciAoVW5pdmVyc2l0eSBvZiBXYXRlcmxvbyBjby1vcCBwb3J0YWwpXG5pbXBvcnQgeyBCYXNlU2NyYXBlciB9IGZyb20gJy4vYmFzZS1zY3JhcGVyJztcbmV4cG9ydCBjbGFzcyBXYXRlcmxvb1dvcmtzU2NyYXBlciBleHRlbmRzIEJhc2VTY3JhcGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSAnd2F0ZXJsb293b3Jrcyc7XG4gICAgICAgIHRoaXMudXJsUGF0dGVybnMgPSBbL3dhdGVybG9vd29ya3NcXC51d2F0ZXJsb29cXC5jYS9dO1xuICAgIH1cbiAgICBjYW5IYW5kbGUodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybFBhdHRlcm5zLnNvbWUoKHApID0+IHAudGVzdCh1cmwpKTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBsb2dnZWQgaW5cbiAgICAgICAgaWYgKHRoaXMuaXNMb2dpblBhZ2UoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tDb2x1bWJ1c10gV2F0ZXJsb28gV29ya3M6IFBsZWFzZSBsb2cgaW4gZmlyc3QnKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdhaXQgZm9yIGpvYiBkZXRhaWxzIHRvIGxvYWRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMud2FpdEZvckVsZW1lbnQoJy5wb3N0aW5nLWRldGFpbHMsIC5qb2ItcG9zdGluZy1kZXRhaWxzLCAjcG9zdGluZ0RpdicsIDMwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbQ29sdW1idXNdIFdhdGVybG9vIFdvcmtzOiBDb3VsZCBub3QgZmluZCBqb2IgZGV0YWlscycpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmV4dHJhY3RKb2JUaXRsZSgpO1xuICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5leHRyYWN0Q29tcGFueSgpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZXh0cmFjdERlc2NyaXB0aW9uKCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgIWNvbXBhbnkgfHwgIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW0NvbHVtYnVzXSBXYXRlcmxvbyBXb3JrcyBzY3JhcGVyOiBNaXNzaW5nIHJlcXVpcmVkIGZpZWxkcycpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmV4dHJhY3RMb2NhdGlvbigpO1xuICAgICAgICBjb25zdCBkZWFkbGluZSA9IHRoaXMuZXh0cmFjdERlYWRsaW5lKCk7XG4gICAgICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLmV4dHJhY3REZXRhaWxzVGFibGUoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbiB8fCBkZXRhaWxzLmxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiBkZXRhaWxzLnNhbGFyeSxcbiAgICAgICAgICAgIHR5cGU6ICdpbnRlcm5zaGlwJywgLy8gV2F0ZXJsb28gV29ya3MgaXMgZm9yIGNvLW9wL2ludGVybnNoaXBzXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8ICcnKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiBkZXRhaWxzLmpvYklkLFxuICAgICAgICAgICAgZGVhZGxpbmUsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3QoKSB7XG4gICAgICAgIGNvbnN0IGpvYnMgPSBbXTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgbG9nZ2VkIGluXG4gICAgICAgIGlmICh0aGlzLmlzTG9naW5QYWdlKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbQ29sdW1idXNdIFdhdGVybG9vIFdvcmtzOiBQbGVhc2UgbG9nIGluIHRvIHNjcmFwZSBqb2IgbGlzdCcpO1xuICAgICAgICAgICAgcmV0dXJuIGpvYnM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSm9iIGxpc3RpbmdzIGFyZSB0eXBpY2FsbHkgaW4gYSB0YWJsZVxuICAgICAgICBjb25zdCByb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpvYi1saXN0aW5nLXRhYmxlIHRib2R5IHRyLCAjcG9zdGluZ3NUYWJsZSB0Ym9keSB0ciwgLm9yYmlzTW9kdWxlQm9keSB0YWJsZSB0Ym9keSB0cicpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxzID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyk7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGxzLmxlbmd0aCA8IDMpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vIFR5cGljYWwgc3RydWN0dXJlOiBKb2IgVGl0bGUgfCBDb21wYW55IHwgTG9jYXRpb24gfCBEZWFkbGluZSB8IC4uLlxuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlQ2VsbCA9IGNlbGxzWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlTGluayA9IHRpdGxlQ2VsbC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUxpbms/LnRleHRDb250ZW50Py50cmltKCkgfHwgdGl0bGVDZWxsLnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gdGl0bGVMaW5rPy5ocmVmO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBhbnkgPSBjZWxsc1sxXT8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGNlbGxzWzJdPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlYWRsaW5lID0gY2VsbHNbM10/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRpdGxlICYmIGNvbXBhbnkgJiYgdXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGpvYnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJywgLy8gTmVlZCB0byBuYXZpZ2F0ZSBmb3IgZnVsbCBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJuc2hpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkbGluZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tDb2x1bWJ1c10gRXJyb3Igc2NyYXBpbmcgV2F0ZXJsb28gV29ya3Mgcm93OicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWxzbyB0cnkgY2FyZC1iYXNlZCBsYXlvdXRzIChuZXdlciBVSSlcbiAgICAgICAgY29uc3QgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuam9iLWNhcmQsIC5wb3N0aW5nLWNhcmQsIFtjbGFzcyo9XCJwb3N0aW5nLWl0ZW1cIl0nKTtcbiAgICAgICAgZm9yIChjb25zdCBjYXJkIG9mIGNhcmRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5qb2ItdGl0bGUsIC5wb3N0aW5nLXRpdGxlLCBoMywgaDQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wYW55RWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5lbXBsb3llci1uYW1lLCAuY29tcGFueS1uYW1lLCBbY2xhc3MqPVwiZW1wbG95ZXJcIl0nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuam9iLWxvY2F0aW9uLCAubG9jYXRpb24sIFtjbGFzcyo9XCJsb2NhdGlvblwiXScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignYVtocmVmKj1cInBvc3RpbmdcIl0nKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRpdGxlRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueSA9IGNvbXBhbnlFbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGxvY2F0aW9uRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbGlua0VsPy5ocmVmO1xuICAgICAgICAgICAgICAgIGlmICh0aXRsZSAmJiBjb21wYW55ICYmIHVybCkge1xuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcm5zaGlwJyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tDb2x1bWJ1c10gRXJyb3Igc2NyYXBpbmcgV2F0ZXJsb28gV29ya3MgY2FyZDonLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqb2JzO1xuICAgIH1cbiAgICBpc0xvZ2luUGFnZSgpIHtcbiAgICAgICAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuICh1cmwuaW5jbHVkZXMoJ2xvZ2luJykgfHxcbiAgICAgICAgICAgIHVybC5pbmNsdWRlcygnc2lnbmluJykgfHxcbiAgICAgICAgICAgIHVybC5pbmNsdWRlcygnY2FzLycpIHx8XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSAhPT0gbnVsbCk7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JUaXRsZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5wb3N0aW5nLXRpdGxlJyxcbiAgICAgICAgICAgICcuam9iLXRpdGxlJyxcbiAgICAgICAgICAgICcjcG9zdGluZ0RpdiBoMScsXG4gICAgICAgICAgICAnLmpvYi1wb3N0aW5nLWRldGFpbHMgaDEnLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJwb3N0aW5nXCJdIGgxJyxcbiAgICAgICAgICAgICdoMScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAzICYmIHRleHQubGVuZ3RoIDwgMjAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21wYW55KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnLmVtcGxveWVyLW5hbWUnLFxuICAgICAgICAgICAgJy5jb21wYW55LW5hbWUnLFxuICAgICAgICAgICAgJy5vcmdhbml6YXRpb24tbmFtZScsXG4gICAgICAgICAgICAnW2NsYXNzKj1cImVtcGxveWVyXCJdJyxcbiAgICAgICAgICAgICd0ZDpjb250YWlucyhcIk9yZ2FuaXphdGlvblwiKSArIHRkJyxcbiAgICAgICAgICAgICd0aDpjb250YWlucyhcIk9yZ2FuaXphdGlvblwiKSArIHRkJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdG9yIG1pZ2h0IGJlIGludmFsaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgdGFibGUtYmFzZWQgZXh0cmFjdGlvblxuICAgICAgICBjb25zdCByb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndHIsIC5kZXRhaWwtcm93Jyk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSByb3cudGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkgfHwgJyc7XG4gICAgICAgICAgICBpZiAodGV4dC5pbmNsdWRlcygnb3JnYW5pemF0aW9uJykgfHwgdGV4dC5pbmNsdWRlcygnZW1wbG95ZXInKSB8fCB0ZXh0LmluY2x1ZGVzKCdjb21wYW55JykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxscyA9IHJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCwgLnZhbHVlLCBkZCcpO1xuICAgICAgICAgICAgICAgIGlmIChjZWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY2VsbHNbY2VsbHMubGVuZ3RoIC0gMV0udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0TG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICcuam9iLWxvY2F0aW9uJyxcbiAgICAgICAgICAgICcubG9jYXRpb24nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJsb2NhdGlvblwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IHRhYmxlLWJhc2VkIGV4dHJhY3Rpb25cbiAgICAgICAgY29uc3Qgcm93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyLCAuZGV0YWlsLXJvdycpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gcm93LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuICAgICAgICAgICAgaWYgKHRleHQuaW5jbHVkZXMoJ2xvY2F0aW9uJykgfHwgdGV4dC5pbmNsdWRlcygnY2l0eScpIHx8IHRleHQuaW5jbHVkZXMoJ3JlZ2lvbicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbHMgPSByb3cucXVlcnlTZWxlY3RvckFsbCgndGQsIC52YWx1ZSwgZGQnKTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNlbGxzW2NlbGxzLmxlbmd0aCAtIDFdLnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3REZXNjcmlwdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5qb2ItZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgJy5wb3N0aW5nLWRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICcjcG9zdGluZ0RpdiAuZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgJy5qb2ItcG9zdGluZy1kZXRhaWxzIC5kZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAnW2NsYXNzKj1cImRlc2NyaXB0aW9uXCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLmV4dHJhY3RIdG1sQ29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoaHRtbCAmJiBodG1sLmxlbmd0aCA+IDUwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW5EZXNjcmlwdGlvbihodG1sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgdG8gZmluZCB0aGUgbWFpbiBjb250ZW50IGFyZWFcbiAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9zdGluZy1kZXRhaWxzLCAjcG9zdGluZ0RpdiwgLmpvYi1wb3N0aW5nLWRldGFpbHMnKTtcbiAgICAgICAgaWYgKG1haW5Db250ZW50KSB7XG4gICAgICAgICAgICBjb25zdCBodG1sID0gbWFpbkNvbnRlbnQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW5EZXNjcmlwdGlvbihodG1sKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdERlYWRsaW5lKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnLmFwcGxpY2F0aW9uLWRlYWRsaW5lJyxcbiAgICAgICAgICAgICcuZGVhZGxpbmUnLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJkZWFkbGluZVwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IHRhYmxlLWJhc2VkIGV4dHJhY3Rpb25cbiAgICAgICAgY29uc3Qgcm93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyLCAuZGV0YWlsLXJvdycpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gcm93LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuICAgICAgICAgICAgaWYgKHRleHQuaW5jbHVkZXMoJ2RlYWRsaW5lJykgfHwgdGV4dC5pbmNsdWRlcygnYXBwbHkgYnknKSB8fCB0ZXh0LmluY2x1ZGVzKCdkdWUnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxzID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkLCAudmFsdWUsIGRkJyk7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjZWxsc1tjZWxscy5sZW5ndGggLSAxXS50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGV4dHJhY3REZXRhaWxzVGFibGUoKSB7XG4gICAgICAgIGNvbnN0IGRldGFpbHMgPSB7fTtcbiAgICAgICAgY29uc3Qgcm93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyLCAuZGV0YWlsLXJvdywgZHQnKTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHJvdy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSB8fCAnJztcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgLy8gSGFuZGxlIGR0L2RkIHBhaXJzXG4gICAgICAgICAgICBpZiAocm93LnRhZ05hbWUgPT09ICdEVCcpIHtcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHJvdy50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgY29uc3QgZGQgPSByb3cubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmIChkZD8udGFnTmFtZSA9PT0gJ0REJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGRkLnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgdGFibGUgcm93c1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxzID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkLCB0aCcpO1xuICAgICAgICAgICAgICAgIGlmIChjZWxscy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGNlbGxzWzBdLnRleHRDb250ZW50Py50cmltKCk/LnRvTG93ZXJDYXNlKCkgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjZWxsc1sxXS50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhYmVsICYmIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsLmluY2x1ZGVzKCdqb2IgaWQnKSB8fCBsYWJlbC5pbmNsdWRlcygncG9zdGluZyBpZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHMuam9iSWQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsLmluY2x1ZGVzKCdsb2NhdGlvbicpIHx8IGxhYmVsLmluY2x1ZGVzKCdjaXR5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlscy5sb2NhdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGFiZWwuaW5jbHVkZXMoJ3NhbGFyeScpIHx8IGxhYmVsLmluY2x1ZGVzKCdjb21wZW5zYXRpb24nKSB8fCBsYWJlbC5pbmNsdWRlcygncGF5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlscy5zYWxhcnkgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldGFpbHM7XG4gICAgfVxufVxuIiwiLy8gSW5kZWVkIGpvYiBzY3JhcGVyXG5pbXBvcnQgeyBCYXNlU2NyYXBlciB9IGZyb20gJy4vYmFzZS1zY3JhcGVyJztcbmV4cG9ydCBjbGFzcyBJbmRlZWRTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9ICdpbmRlZWQnO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm5zID0gW1xuICAgICAgICAgICAgL2luZGVlZFxcLmNvbVxcL3ZpZXdqb2IvLFxuICAgICAgICAgICAgL2luZGVlZFxcLmNvbVxcL2pvYnNcXC8vLFxuICAgICAgICAgICAgL2luZGVlZFxcLmNvbVxcL2pvYlxcLy8sXG4gICAgICAgICAgICAvaW5kZWVkXFwuY29tXFwvcmNcXC9jbGsvLFxuICAgICAgICBdO1xuICAgIH1cbiAgICBjYW5IYW5kbGUodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybFBhdHRlcm5zLnNvbWUoKHApID0+IHAudGVzdCh1cmwpKTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gV2FpdCBmb3Igam9iIGRldGFpbHMgdG8gbG9hZFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yRWxlbWVudCgnLmpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXRpdGxlLCBbZGF0YS10ZXN0aWQ9XCJqb2JzZWFyY2gtSm9iSW5mb0hlYWRlci10aXRsZVwiXScsIDMwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggYXZhaWxhYmxlIGRhdGFcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZXh0cmFjdEpvYlRpdGxlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSB0aGlzLmV4dHJhY3RDb21wYW55KCk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5leHRyYWN0TG9jYXRpb24oKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmV4dHJhY3REZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb21wYW55IHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tDb2x1bWJ1c10gSW5kZWVkIHNjcmFwZXI6IE1pc3NpbmcgcmVxdWlyZWQgZmllbGRzJywgeyB0aXRsZSwgY29tcGFueSwgZGVzY3JpcHRpb246ICEhZGVzY3JpcHRpb24gfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVkRGF0YSA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24gfHwgc3RydWN0dXJlZERhdGE/LmxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiB0aGlzLmV4dHJhY3RTYWxhcnlGcm9tUGFnZSgpIHx8IHRoaXMuZXh0cmFjdFNhbGFyeShkZXNjcmlwdGlvbikgfHwgc3RydWN0dXJlZERhdGE/LnNhbGFyeSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8ICcnKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZCgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IHN0cnVjdHVyZWREYXRhPy5wb3N0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICAvLyBKb2IgY2FyZHMgaW4gc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgY29uc3Qgam9iQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuam9iX3NlZW5fYmVhY29uLCAuam9ic2VhcmNoLVJlc3VsdHNMaXN0ID4gbGksIFtkYXRhLXRlc3RpZD1cImpvYi1jYXJkXCJdJyk7XG4gICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBqb2JDYXJkcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuam9iVGl0bGUsIFtkYXRhLXRlc3RpZD1cImpvYlRpdGxlXCJdLCBoMi5qb2JUaXRsZSBhLCAuamNzLUpvYlRpdGxlJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuY29tcGFueU5hbWUsIFtkYXRhLXRlc3RpZD1cImNvbXBhbnktbmFtZVwiXSwgLmNvbXBhbnlfbG9jYXRpb24gLmNvbXBhbnlOYW1lJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FbCA9IGNhcmQucXVlcnlTZWxlY3RvcignLmNvbXBhbnlMb2NhdGlvbiwgW2RhdGEtdGVzdGlkPVwidGV4dC1sb2NhdGlvblwiXSwgLmNvbXBhbnlfbG9jYXRpb24gLmNvbXBhbnlMb2NhdGlvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbGFyeUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuc2FsYXJ5LXNuaXBwZXQtY29udGFpbmVyLCBbZGF0YS10ZXN0aWQ9XCJhdHRyaWJ1dGVfc25pcHBldF90ZXN0aWRcIl0sIC5lc3RpbWF0ZWQtc2FsYXJ5Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBhbnkgPSBjb21wYW55RWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBsb2NhdGlvbkVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbGFyeSA9IHNhbGFyeUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIC8vIEdldCBVUkwgZnJvbSB0aXRsZSBsaW5rIG9yIGRhdGEgYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHRpdGxlRWw/LmhyZWY7XG4gICAgICAgICAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgam9iS2V5ID0gY2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtamsnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYktleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gYGh0dHBzOi8vd3d3LmluZGVlZC5jb20vdmlld2pvYj9qaz0ke2pvYktleX1gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aXRsZSAmJiBjb21wYW55ICYmIHVybCkge1xuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBzYWxhcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tDb2x1bWJ1c10gRXJyb3Igc2NyYXBpbmcgSW5kZWVkIGpvYiBjYXJkOicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvYnM7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JUaXRsZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5qb2JzZWFyY2gtSm9iSW5mb0hlYWRlci10aXRsZScsXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiam9ic2VhcmNoLUpvYkluZm9IZWFkZXItdGl0bGVcIl0nLFxuICAgICAgICAgICAgJ2gxLmpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXRpdGxlJyxcbiAgICAgICAgICAgICcuaWNsLXUteHMtbWItLXhzIGgxJyxcbiAgICAgICAgICAgICdoMVtjbGFzcyo9XCJKb2JJbmZvSGVhZGVyXCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdENvbXBhbnkoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdbZGF0YS10ZXN0aWQ9XCJpbmxpbmVIZWFkZXItY29tcGFueU5hbWVcIl0gYScsXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiaW5saW5lSGVhZGVyLWNvbXBhbnlOYW1lXCJdJyxcbiAgICAgICAgICAgICcuam9ic2VhcmNoLUlubGluZUNvbXBhbnlSYXRpbmctY29tcGFueUhlYWRlciBhJyxcbiAgICAgICAgICAgICcuam9ic2VhcmNoLUlubGluZUNvbXBhbnlSYXRpbmcgYScsXG4gICAgICAgICAgICAnLmljbC11LWxnLW1yLS1zbSBhJyxcbiAgICAgICAgICAgICdbZGF0YS1jb21wYW55LW5hbWU9XCJ0cnVlXCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdExvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiaW5saW5lSGVhZGVyLWNvbXBhbnlMb2NhdGlvblwiXScsXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiam9iLWxvY2F0aW9uXCJdJyxcbiAgICAgICAgICAgICcuam9ic2VhcmNoLUpvYkluZm9IZWFkZXItc3VidGl0bGUgPiBkaXY6bnRoLWNoaWxkKDIpJyxcbiAgICAgICAgICAgICcuam9ic2VhcmNoLUlubGluZUNvbXBhbnlSYXRpbmcgKyBkaXYnLFxuICAgICAgICAgICAgJy5pY2wtdS14cy1tdC0teHMgLmljbC11LXRleHRDb2xvci0tc2Vjb25kYXJ5JyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dCAmJiAhdGV4dC5pbmNsdWRlcygncmV2aWV3cycpICYmICF0ZXh0LmluY2x1ZGVzKCdyYXRpbmcnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0RGVzY3JpcHRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICcjam9iRGVzY3JpcHRpb25UZXh0JyxcbiAgICAgICAgICAgICdbZGF0YS10ZXN0aWQ9XCJqb2JEZXNjcmlwdGlvblRleHRcIl0nLFxuICAgICAgICAgICAgJy5qb2JzZWFyY2gtam9iRGVzY3JpcHRpb25UZXh0JyxcbiAgICAgICAgICAgICcuam9ic2VhcmNoLUpvYkNvbXBvbmVudC1kZXNjcmlwdGlvbicsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sID0gdGhpcy5leHRyYWN0SHRtbENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbkRlc2NyaXB0aW9uKGh0bWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0U2FsYXJ5RnJvbVBhZ2UoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdbZGF0YS10ZXN0aWQ9XCJqb2JzZWFyY2gtSm9iTWV0YWRhdGFIZWFkZXItc2FsYXJ5SW5mb1wiXScsXG4gICAgICAgICAgICAnLmpvYnNlYXJjaC1Kb2JNZXRhZGF0YUhlYWRlci1zYWxhcnlJbmZvJyxcbiAgICAgICAgICAgICcjc2FsYXJ5SW5mb0FuZEpvYlR5cGUgLmF0dHJpYnV0ZV9zbmlwcGV0JyxcbiAgICAgICAgICAgICcuam9ic2VhcmNoLUpvYkluZm9IZWFkZXItc2FsYXJ5JyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dCAmJiB0ZXh0LmluY2x1ZGVzKCckJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iSWQoKSB7XG4gICAgICAgIC8vIEZyb20gVVJMIHBhcmFtZXRlclxuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICBjb25zdCBqayA9IHVybFBhcmFtcy5nZXQoJ2prJyk7XG4gICAgICAgIGlmIChqaylcbiAgICAgICAgICAgIHJldHVybiBqaztcbiAgICAgICAgLy8gRnJvbSBVUkwgcGF0aFxuICAgICAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9cXC9qb2JcXC8oW2EtZjAtOV0rKS9pKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5bMV07XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmxPYmogPSBuZXcgVVJMKHVybCk7XG4gICAgICAgICAgICBjb25zdCBqayA9IHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdqaycpO1xuICAgICAgICAgICAgaWYgKGprKVxuICAgICAgICAgICAgICAgIHJldHVybiBqaztcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC9cXC9qb2JcXC8oW2EtZjAtOV0rKS9pKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXh0cmFjdFN0cnVjdHVyZWREYXRhKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGRKc29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCJdJyk7XG4gICAgICAgICAgICBpZiAoIWxkSnNvbj8udGV4dENvbnRlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShsZEpzb24udGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgLy8gSW5kZWVkIG1heSBoYXZlIGFuIGFycmF5IG9mIHN0cnVjdHVyZWQgZGF0YVxuICAgICAgICAgICAgY29uc3Qgam9iRGF0YSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLmZpbmQoKGQpID0+IGRbJ0B0eXBlJ10gPT09ICdKb2JQb3N0aW5nJykgOiBkYXRhO1xuICAgICAgICAgICAgaWYgKCFqb2JEYXRhIHx8IGpvYkRhdGFbJ0B0eXBlJ10gIT09ICdKb2JQb3N0aW5nJylcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb246IGpvYkRhdGEuam9iTG9jYXRpb24/LmFkZHJlc3M/LmFkZHJlc3NMb2NhbGl0eSB8fFxuICAgICAgICAgICAgICAgICAgICBqb2JEYXRhLmpvYkxvY2F0aW9uPy5hZGRyZXNzPy5uYW1lLFxuICAgICAgICAgICAgICAgIHNhbGFyeTogam9iRGF0YS5iYXNlU2FsYXJ5Py52YWx1ZVxuICAgICAgICAgICAgICAgICAgICA/IGAkJHtqb2JEYXRhLmJhc2VTYWxhcnkudmFsdWUubWluVmFsdWUgfHwgJyd9LSR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1heFZhbHVlIHx8ICcnfSAke2pvYkRhdGEuYmFzZVNhbGFyeS52YWx1ZS51bml0VGV4dCB8fCAnJ31gXG4gICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBvc3RlZEF0OiBqb2JEYXRhLmRhdGVQb3N0ZWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8gR3JlZW5ob3VzZSBqb2IgYm9hcmQgc2NyYXBlclxuaW1wb3J0IHsgQmFzZVNjcmFwZXIgfSBmcm9tICcuL2Jhc2Utc2NyYXBlcic7XG5leHBvcnQgY2xhc3MgR3JlZW5ob3VzZVNjcmFwZXIgZXh0ZW5kcyBCYXNlU2NyYXBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuc291cmNlID0gJ2dyZWVuaG91c2UnO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm5zID0gW1xuICAgICAgICAgICAgL2JvYXJkc1xcLmdyZWVuaG91c2VcXC5pb1xcL1tcXHctXStcXC9qb2JzXFwvXFxkKy8sXG4gICAgICAgICAgICAvW1xcdy1dK1xcLmdyZWVuaG91c2VcXC5pb1xcL2pvYnNcXC9cXGQrLyxcbiAgICAgICAgICAgIC9ncmVlbmhvdXNlXFwuaW9cXC9lbWJlZFxcL2pvYl9hcHAvLFxuICAgICAgICBdO1xuICAgIH1cbiAgICBjYW5IYW5kbGUodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybFBhdHRlcm5zLnNvbWUoKHApID0+IHAudGVzdCh1cmwpKTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gV2FpdCBmb3Igam9iIGNvbnRlbnQgdG8gbG9hZFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yRWxlbWVudCgnLmFwcC10aXRsZSwgI2hlYWRlciAuY29tcGFueS1uYW1lLCAuam9iLXRpdGxlJywgMzAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCBhdmFpbGFibGUgZGF0YVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5leHRyYWN0Sm9iVGl0bGUoKTtcbiAgICAgICAgY29uc3QgY29tcGFueSA9IHRoaXMuZXh0cmFjdENvbXBhbnkoKTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmV4dHJhY3RMb2NhdGlvbigpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZXh0cmFjdERlc2NyaXB0aW9uKCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgIWNvbXBhbnkgfHwgIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW0NvbHVtYnVzXSBHcmVlbmhvdXNlIHNjcmFwZXI6IE1pc3NpbmcgcmVxdWlyZWQgZmllbGRzJywgeyB0aXRsZSwgY29tcGFueSwgZGVzY3JpcHRpb246ICEhZGVzY3JpcHRpb24gfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVkRGF0YSA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24gfHwgc3RydWN0dXJlZERhdGE/LmxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiB0aGlzLmV4dHJhY3RTYWxhcnkoZGVzY3JpcHRpb24pIHx8IHN0cnVjdHVyZWREYXRhPy5zYWxhcnksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmRldGVjdEpvYlR5cGUoZGVzY3JpcHRpb24pIHx8IHN0cnVjdHVyZWREYXRhPy50eXBlLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShsb2NhdGlvbiB8fCAnJykgfHwgdGhpcy5kZXRlY3RSZW1vdGUoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBzb3VyY2VKb2JJZDogdGhpcy5leHRyYWN0Sm9iSWQoKSxcbiAgICAgICAgICAgIHBvc3RlZEF0OiBzdHJ1Y3R1cmVkRGF0YT8ucG9zdGVkQXQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3QoKSB7XG4gICAgICAgIGNvbnN0IGpvYnMgPSBbXTtcbiAgICAgICAgLy8gSm9iIGNhcmRzIG9uIGRlcGFydG1lbnQvbGlzdGluZyBwYWdlc1xuICAgICAgICBjb25zdCBqb2JDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcGVuaW5nLCAuam9iLXBvc3QsIFtkYXRhLW1hcHBlZD1cInRydWVcIl0sIHNlY3Rpb24ubGV2ZWwtMCA+IGRpdicpO1xuICAgICAgICBmb3IgKGNvbnN0IGNhcmQgb2Ygam9iQ2FyZHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGVFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignYSwgLm9wZW5pbmctdGl0bGUsIC5qb2ItdGl0bGUnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcubG9jYXRpb24sIC5qb2ItbG9jYXRpb24sIHNwYW46bGFzdC1jaGlsZCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGl0bGVFbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGxvY2F0aW9uRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gdGl0bGVFbD8uaHJlZjtcbiAgICAgICAgICAgICAgICAvLyBDb21wYW55IGlzIHVzdWFsbHkgaW4gaGVhZGVyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueSA9IHRoaXMuZXh0cmFjdENvbXBhbnkoKTtcbiAgICAgICAgICAgICAgICBpZiAodGl0bGUgJiYgdXJsICYmIGNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgam9icy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VKb2JJZDogdGhpcy5leHRyYWN0Sm9iSWRGcm9tVXJsKHVybCksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbQ29sdW1idXNdIEVycm9yIHNjcmFwaW5nIEdyZWVuaG91c2Ugam9iIGNhcmQ6JywgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gam9icztcbiAgICB9XG4gICAgZXh0cmFjdEpvYlRpdGxlKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnLmFwcC10aXRsZScsXG4gICAgICAgICAgICAnLmpvYi10aXRsZScsXG4gICAgICAgICAgICAnaDEuaGVhZGluZycsXG4gICAgICAgICAgICAnLmpvYi1pbmZvIGgxJyxcbiAgICAgICAgICAgICcjaGVhZGVyIGgxJyxcbiAgICAgICAgICAgICdoMVtjbGFzcyo9XCJqb2JcIl0nLFxuICAgICAgICAgICAgJy5oZXJvIGgxJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgc3RydWN0dXJlZCBkYXRhXG4gICAgICAgIGNvbnN0IGxkSnNvbiA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIGlmIChsZEpzb24/LnRpdGxlKVxuICAgICAgICAgICAgcmV0dXJuIGxkSnNvbi50aXRsZTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21wYW55KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnLmNvbXBhbnktbmFtZScsXG4gICAgICAgICAgICAnI2hlYWRlciAuY29tcGFueS1uYW1lJyxcbiAgICAgICAgICAgICcubG9nby13cmFwcGVyIGltZ1thbHRdJyxcbiAgICAgICAgICAgICcuY29tcGFueS1oZWFkZXIgLm5hbWUnLFxuICAgICAgICAgICAgJ21ldGFbcHJvcGVydHk9XCJvZzpzaXRlX25hbWVcIl0nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yLmluY2x1ZGVzKCdtZXRhJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IG1ldGE/LmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZW50KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNlbGVjdG9yLmluY2x1ZGVzKCdpbWdbYWx0XScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgY29uc3QgYWx0ID0gaW1nPy5nZXRBdHRyaWJ1dGUoJ2FsdCcpO1xuICAgICAgICAgICAgICAgIGlmIChhbHQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHRyYWN0IGZyb20gVVJMIChib2FyZHMuZ3JlZW5ob3VzZS5pby9DT01QQU5ZL2pvYnMvLi4uKVxuICAgICAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9ncmVlbmhvdXNlXFwuaW9cXC8oW14vXSspLyk7XG4gICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaFsxXSAhPT0gJ2pvYnMnKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0ucmVwbGFjZSgvLS9nLCAnICcpLnJlcGxhY2UoL1xcYlxcdy9nLCAoYykgPT4gYy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdExvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnLmxvY2F0aW9uJyxcbiAgICAgICAgICAgICcuam9iLWxvY2F0aW9uJyxcbiAgICAgICAgICAgICcuY29tcGFueS1sb2NhdGlvbicsXG4gICAgICAgICAgICAnLmpvYi1pbmZvIC5sb2NhdGlvbicsXG4gICAgICAgICAgICAnI2hlYWRlciAubG9jYXRpb24nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0RGVzY3JpcHRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICcjY29udGVudCcsXG4gICAgICAgICAgICAnLmpvYi1kZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAnLmNvbnRlbnQtd3JhcHBlciAuY29udGVudCcsXG4gICAgICAgICAgICAnI2pvYl9kZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAnLmpvYi1jb250ZW50JyxcbiAgICAgICAgICAgICcuam9iLWluZm8gLmNvbnRlbnQnLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9IHRoaXMuZXh0cmFjdEh0bWxDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChodG1sICYmIGh0bWwubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW5EZXNjcmlwdGlvbihodG1sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdEpvYklkKCkge1xuICAgICAgICAvLyBGcm9tIFVSTDogYm9hcmRzLmdyZWVuaG91c2UuaW8vY29tcGFueS9qb2JzLzEyMzQ1XG4gICAgICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcL2pvYnNcXC8oXFxkKykvKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5bMV07XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC9cXC9qb2JzXFwvKFxcZCspLyk7XG4gICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgIH1cbiAgICBleHRyYWN0U3RydWN0dXJlZERhdGEoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsZEpzb25FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiXScpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbCBvZiBsZEpzb25FbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGlmICghZWwudGV4dENvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGVsLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JEYXRhID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEuZmluZCgoZCkgPT4gZFsnQHR5cGUnXSA9PT0gJ0pvYlBvc3RpbmcnKSA6IGRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCFqb2JEYXRhIHx8IGpvYkRhdGFbJ0B0eXBlJ10gIT09ICdKb2JQb3N0aW5nJylcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1wbG95bWVudFR5cGUgPSBqb2JEYXRhLmVtcGxveW1lbnRUeXBlPy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlO1xuICAgICAgICAgICAgICAgIGlmIChlbXBsb3ltZW50VHlwZT8uaW5jbHVkZXMoJ2Z1bGwnKSlcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdmdWxsLXRpbWUnO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVtcGxveW1lbnRUeXBlPy5pbmNsdWRlcygncGFydCcpKVxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3BhcnQtdGltZSc7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZW1wbG95bWVudFR5cGU/LmluY2x1ZGVzKCdjb250cmFjdCcpKVxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ2NvbnRyYWN0JztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbXBsb3ltZW50VHlwZT8uaW5jbHVkZXMoJ2ludGVybicpKVxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ2ludGVybnNoaXAnO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqb2JEYXRhLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogdHlwZW9mIGpvYkRhdGEuam9iTG9jYXRpb24gPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGpvYkRhdGEuam9iTG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIDogam9iRGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8uYWRkcmVzc0xvY2FsaXR5IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9iRGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8ubmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYkRhdGEuam9iTG9jYXRpb24/Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHNhbGFyeTogam9iRGF0YS5iYXNlU2FsYXJ5Py52YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgJCR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1pblZhbHVlIHx8ICcnfS0ke2pvYkRhdGEuYmFzZVNhbGFyeS52YWx1ZS5tYXhWYWx1ZSB8fCAnJ31gXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgcG9zdGVkQXQ6IGpvYkRhdGEuZGF0ZVBvc3RlZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBMZXZlciBqb2IgYm9hcmQgc2NyYXBlclxuaW1wb3J0IHsgQmFzZVNjcmFwZXIgfSBmcm9tICcuL2Jhc2Utc2NyYXBlcic7XG5leHBvcnQgY2xhc3MgTGV2ZXJTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9ICdsZXZlcic7XG4gICAgICAgIHRoaXMudXJsUGF0dGVybnMgPSBbXG4gICAgICAgICAgICAvam9ic1xcLmxldmVyXFwuY29cXC9bXFx3LV0rXFwvW1xcdy1dKy8sXG4gICAgICAgICAgICAvW1xcdy1dK1xcLmxldmVyXFwuY29cXC9bXFx3LV0rLyxcbiAgICAgICAgXTtcbiAgICB9XG4gICAgY2FuSGFuZGxlKHVybCkge1xuICAgICAgICByZXR1cm4gdGhpcy51cmxQYXR0ZXJucy5zb21lKChwKSA9PiBwLnRlc3QodXJsKSk7XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3RpbmcoKSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIGpvYiBjb250ZW50IHRvIGxvYWRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMud2FpdEZvckVsZW1lbnQoJy5wb3N0aW5nLWhlYWRsaW5lIGgyLCAucG9zdGluZy1oZWFkbGluZSBoMSwgLnNlY3Rpb24td3JhcHBlcicsIDMwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggYXZhaWxhYmxlIGRhdGFcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZXh0cmFjdEpvYlRpdGxlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSB0aGlzLmV4dHJhY3RDb21wYW55KCk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5leHRyYWN0TG9jYXRpb24oKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmV4dHJhY3REZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb21wYW55IHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tDb2x1bWJ1c10gTGV2ZXIgc2NyYXBlcjogTWlzc2luZyByZXF1aXJlZCBmaWVsZHMnLCB7IHRpdGxlLCBjb21wYW55LCBkZXNjcmlwdGlvbjogISFkZXNjcmlwdGlvbiB9KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0cnVjdHVyZWREYXRhID0gdGhpcy5leHRyYWN0U3RydWN0dXJlZERhdGEoKTtcbiAgICAgICAgY29uc3QgY29tbWl0bWVudCA9IHRoaXMuZXh0cmFjdENvbW1pdG1lbnQoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbiB8fCBzdHJ1Y3R1cmVkRGF0YT8ubG9jYXRpb24sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJlcXVpcmVtZW50czogdGhpcy5leHRyYWN0UmVxdWlyZW1lbnRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIGtleXdvcmRzOiB0aGlzLmV4dHJhY3RLZXl3b3JkcyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBzYWxhcnk6IHRoaXMuZXh0cmFjdFNhbGFyeShkZXNjcmlwdGlvbikgfHwgc3RydWN0dXJlZERhdGE/LnNhbGFyeSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZUZyb21Db21taXRtZW50KGNvbW1pdG1lbnQpIHx8IHRoaXMuZGV0ZWN0Sm9iVHlwZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8ICcnKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZCgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IHN0cnVjdHVyZWREYXRhPy5wb3N0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICAvLyBKb2IgcG9zdGluZ3Mgb24gY29tcGFueSBwYWdlXG4gICAgICAgIGNvbnN0IGpvYkNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvc3RpbmcsIFtkYXRhLXFhPVwicG9zdGluZy1uYW1lXCJdJyk7XG4gICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBqb2JDYXJkcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcucG9zdGluZy10aXRsZSBoNSwgLnBvc3RpbmctbmFtZSwgYVtkYXRhLXFhPVwicG9zdGluZy1uYW1lXCJdJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FbCA9IGNhcmQucXVlcnlTZWxlY3RvcignLmxvY2F0aW9uLCAucG9zdGluZy1jYXRlZ29yaWVzIC5zb3J0LWJ5LWxvY2F0aW9uLCAud29ya3BsYWNlVHlwZXMnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21taXRtZW50RWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5jb21taXRtZW50LCAucG9zdGluZy1jYXRlZ29yaWVzIC5zb3J0LWJ5LWNvbW1pdG1lbnQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRpdGxlRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBsb2NhdGlvbkVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1pdG1lbnQgPSBjb21taXRtZW50RWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCdhLnBvc3RpbmctdGl0bGUsIGFbZGF0YS1xYT1cInBvc3RpbmctbmFtZVwiXScpPy5ocmVmIHx8XG4gICAgICAgICAgICAgICAgICAgIGNhcmQuaHJlZjtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5leHRyYWN0Q29tcGFueSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aXRsZSAmJiB1cmwgJiYgY29tcGFueSkge1xuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZUZyb21Db21taXRtZW50KGNvbW1pdG1lbnQgPz8gbnVsbCksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbQ29sdW1idXNdIEVycm9yIHNjcmFwaW5nIExldmVyIGpvYiBjYXJkOicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvYnM7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JUaXRsZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5wb3N0aW5nLWhlYWRsaW5lIGgyJyxcbiAgICAgICAgICAgICcucG9zdGluZy1oZWFkbGluZSBoMScsXG4gICAgICAgICAgICAnW2RhdGEtcWE9XCJwb3N0aW5nLW5hbWVcIl0nLFxuICAgICAgICAgICAgJy5wb3N0aW5nLWhlYWRlciBoMicsXG4gICAgICAgICAgICAnLnNlY3Rpb24ucGFnZS1jZW50ZXJlZC5wb3N0aW5nLWhlYWRlciBoMScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21wYW55KCkge1xuICAgICAgICAvLyBUcnkgbG9nbyBhbHQgdGV4dFxuICAgICAgICBjb25zdCBsb2dvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4taGVhZGVyLWxvZ28gaW1nLCAucG9zdGluZy1oZWFkZXIgLmxvZ28gaW1nLCBoZWFkZXIgaW1nJyk7XG4gICAgICAgIGlmIChsb2dvKSB7XG4gICAgICAgICAgICBjb25zdCBhbHQgPSBsb2dvLmdldEF0dHJpYnV0ZSgnYWx0Jyk7XG4gICAgICAgICAgICBpZiAoYWx0ICYmIGFsdCAhPT0gJ0NvbXBhbnkgTG9nbycpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsdDtcbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgcGFnZSB0aXRsZVxuICAgICAgICBjb25zdCBwYWdlVGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICAgICAgaWYgKHBhZ2VUaXRsZSkge1xuICAgICAgICAgICAgLy8gRm9ybWF0OiBcIkpvYiBUaXRsZSAtIENvbXBhbnkgTmFtZVwiXG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHBhZ2VUaXRsZS5zcGxpdCgnIC0gJyk7XG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0ucmVwbGFjZSgnIEpvYnMnLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEV4dHJhY3QgZnJvbSBVUkxcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvbGV2ZXJcXC5jb1xcLyhbXi9dKykvKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV0ucmVwbGFjZSgvLS9nLCAnICcpLnJlcGxhY2UoL1xcYlxcdy9nLCAoYykgPT4gYy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdExvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnLnBvc3RpbmctY2F0ZWdvcmllcyAubG9jYXRpb24nLFxuICAgICAgICAgICAgJy5wb3N0aW5nLWhlYWRsaW5lIC5sb2NhdGlvbicsXG4gICAgICAgICAgICAnLnNvcnQtYnktbG9jYXRpb24nLFxuICAgICAgICAgICAgJy53b3JrcGxhY2VUeXBlcycsXG4gICAgICAgICAgICAnW2RhdGEtcWE9XCJwb3N0aW5nLWxvY2F0aW9uXCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdENvbW1pdG1lbnQoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICcucG9zdGluZy1jYXRlZ29yaWVzIC5jb21taXRtZW50JyxcbiAgICAgICAgICAgICcuc29ydC1ieS1jb21taXRtZW50JyxcbiAgICAgICAgICAgICdbZGF0YS1xYT1cInBvc3RpbmctY29tbWl0bWVudFwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3REZXNjcmlwdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5wb3N0aW5nLXBhZ2UgLmNvbnRlbnQnLFxuICAgICAgICAgICAgJy5zZWN0aW9uLXdyYXBwZXIucGFnZS1mdWxsLXdpZHRoJyxcbiAgICAgICAgICAgICcuc2VjdGlvbi5wYWdlLWNlbnRlcmVkJyxcbiAgICAgICAgICAgICdbZGF0YS1xYT1cImpvYi1kZXNjcmlwdGlvblwiXScsXG4gICAgICAgICAgICAnLnBvc3RpbmctZGVzY3JpcHRpb24nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgLy8gRm9yIExldmVyLCB3ZSB3YW50IHRvIGdldCBhbGwgY29udGVudCBzZWN0aW9uc1xuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IEFycmF5LmZyb20oc2VjdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKHMpID0+IHMuaW5uZXJIVE1MKVxuICAgICAgICAgICAgICAgICAgICAuam9pbignXFxuXFxuJyk7XG4gICAgICAgICAgICAgICAgaWYgKGh0bWwubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFuRGVzY3JpcHRpb24oaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBnZXR0aW5nIHRoZSBtYWluIGNvbnRlbnQgYXJlYVxuICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50LXdyYXBwZXIgLmNvbnRlbnQsIG1haW4gLmNvbnRlbnQnKTtcbiAgICAgICAgaWYgKG1haW5Db250ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbkRlc2NyaXB0aW9uKG1haW5Db250ZW50LmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZCgpIHtcbiAgICAgICAgLy8gRnJvbSBVUkw6IGpvYnMubGV2ZXIuY28vY29tcGFueS9qb2ItaWQtdXVpZFxuICAgICAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9sZXZlclxcLmNvXFwvW14vXStcXC8oW2EtZjAtOS1dKykvaSk7XG4gICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iSWRGcm9tVXJsKHVybCkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvbGV2ZXJcXC5jb1xcL1teL10rXFwvKFthLWYwLTktXSspL2kpO1xuICAgICAgICByZXR1cm4gbWF0Y2g/LlsxXTtcbiAgICB9XG4gICAgZGV0ZWN0Sm9iVHlwZUZyb21Db21taXRtZW50KGNvbW1pdG1lbnQpIHtcbiAgICAgICAgaWYgKCFjb21taXRtZW50KVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbG93ZXIgPSBjb21taXRtZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcygnZnVsbC10aW1lJykgfHwgbG93ZXIuaW5jbHVkZXMoJ2Z1bGwgdGltZScpKVxuICAgICAgICAgICAgcmV0dXJuICdmdWxsLXRpbWUnO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoJ3BhcnQtdGltZScpIHx8IGxvd2VyLmluY2x1ZGVzKCdwYXJ0IHRpbWUnKSlcbiAgICAgICAgICAgIHJldHVybiAncGFydC10aW1lJztcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKCdjb250cmFjdCcpIHx8IGxvd2VyLmluY2x1ZGVzKCdjb250cmFjdG9yJykpXG4gICAgICAgICAgICByZXR1cm4gJ2NvbnRyYWN0JztcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKCdpbnRlcm4nKSlcbiAgICAgICAgICAgIHJldHVybiAnaW50ZXJuc2hpcCc7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGxkSnNvbkVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCJdJyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGxkSnNvbkVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbC50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoZWwudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvYkRhdGEgPSBBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5maW5kKChkKSA9PiBkWydAdHlwZSddID09PSAnSm9iUG9zdGluZycpIDogZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoIWpvYkRhdGEgfHwgam9iRGF0YVsnQHR5cGUnXSAhPT0gJ0pvYlBvc3RpbmcnKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogdHlwZW9mIGpvYkRhdGEuam9iTG9jYXRpb24gPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGpvYkRhdGEuam9iTG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIDogam9iRGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8uYWRkcmVzc0xvY2FsaXR5IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9iRGF0YS5qb2JMb2NhdGlvbj8ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc2FsYXJ5OiBqb2JEYXRhLmJhc2VTYWxhcnk/LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGAkJHtqb2JEYXRhLmJhc2VTYWxhcnkudmFsdWUubWluVmFsdWUgfHwgJyd9LSR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1heFZhbHVlIHx8ICcnfWBcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBwb3N0ZWRBdDogam9iRGF0YS5kYXRlUG9zdGVkLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIEdlbmVyaWMgam9iIHNjcmFwZXIgZm9yIHVua25vd24gc2l0ZXNcbmltcG9ydCB7IEJhc2VTY3JhcGVyIH0gZnJvbSAnLi9iYXNlLXNjcmFwZXInO1xuZXhwb3J0IGNsYXNzIEdlbmVyaWNTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9ICd1bmtub3duJztcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJucyA9IFtdO1xuICAgIH1cbiAgICBjYW5IYW5kbGUoX3VybCkge1xuICAgICAgICAvLyBHZW5lcmljIHNjcmFwZXIgYWx3YXlzIHJldHVybnMgdHJ1ZSBhcyBmYWxsYmFja1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGV4dHJhY3Qgam9iIGluZm9ybWF0aW9uIHVzaW5nIGNvbW1vbiBwYXR0ZXJuc1xuICAgICAgICAvLyBDaGVjayBmb3Igc3RydWN0dXJlZCBkYXRhIGZpcnN0XG4gICAgICAgIGNvbnN0IHN0cnVjdHVyZWREYXRhID0gdGhpcy5leHRyYWN0U3RydWN0dXJlZERhdGEoKTtcbiAgICAgICAgaWYgKHN0cnVjdHVyZWREYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RydWN0dXJlZERhdGE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IGNvbW1vbiBzZWxlY3RvcnNcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmZpbmRUaXRsZSgpO1xuICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5maW5kQ29tcGFueSgpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZmluZERlc2NyaXB0aW9uKCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW0NvbHVtYnVzXSBHZW5lcmljIHNjcmFwZXI6IENvdWxkIG5vdCBmaW5kIHJlcXVpcmVkIGZpZWxkcycpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmZpbmRMb2NhdGlvbigpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb21wYW55OiBjb21wYW55IHx8ICdVbmtub3duIENvbXBhbnknLFxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB0aGlzLmV4dHJhY3RSZXF1aXJlbWVudHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAga2V5d29yZHM6IHRoaXMuZXh0cmFjdEtleXdvcmRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHNhbGFyeTogdGhpcy5leHRyYWN0U2FsYXJ5KGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8ICcnKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLmRldGVjdFNvdXJjZSgpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0KCkge1xuICAgICAgICAvLyBHZW5lcmljIHNjcmFwaW5nIG9mIGpvYiBsaXN0cyBpcyB1bnJlbGlhYmxlXG4gICAgICAgIC8vIFJldHVybiBlbXB0eSBhcnJheSBmb3IgdW5rbm93biBzaXRlc1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIExvb2sgZm9yIEpTT04tTEQgam9iIHBvc3Rpbmcgc2NoZW1hXG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCJdJyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNjcmlwdCBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2Uoc2NyaXB0LnRleHRDb250ZW50IHx8ICcnKTtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgc2luZ2xlIGpvYiBwb3N0aW5nXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbJ0B0eXBlJ10gPT09ICdKb2JQb3N0aW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUpvYlBvc3RpbmdTY2hlbWEoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBhcnJheSBvZiBpdGVtc1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpvYlBvc3RpbmcgPSBkYXRhLmZpbmQoKGl0ZW0pID0+IGl0ZW1bJ0B0eXBlJ10gPT09ICdKb2JQb3N0aW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqb2JQb3N0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUpvYlBvc3RpbmdTY2hlbWEoam9iUG9zdGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIEBncmFwaFxuICAgICAgICAgICAgICAgIGlmIChkYXRhWydAZ3JhcGgnXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBqb2JQb3N0aW5nID0gZGF0YVsnQGdyYXBoJ10uZmluZCgoaXRlbSkgPT4gaXRlbVsnQHR5cGUnXSA9PT0gJ0pvYlBvc3RpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYlBvc3RpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSm9iUG9zdGluZ1NjaGVtYShqb2JQb3N0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW0NvbHVtYnVzXSBDb3VsZCBub3QgcGFyc2Ugc3RydWN0dXJlZCBkYXRhOicsIGVycik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHBhcnNlSm9iUG9zdGluZ1NjaGVtYShkYXRhKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZGF0YS50aXRsZSB8fCAnJztcbiAgICAgICAgY29uc3QgY29tcGFueSA9IGRhdGEuaGlyaW5nT3JnYW5pemF0aW9uPy5uYW1lIHx8ICcnO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRhdGEuZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgICAgIC8vIEV4dHJhY3QgbG9jYXRpb25cbiAgICAgICAgbGV0IGxvY2F0aW9uO1xuICAgICAgICBjb25zdCBqb2JMb2NhdGlvbiA9IGRhdGEuam9iTG9jYXRpb247XG4gICAgICAgIGlmIChqb2JMb2NhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgYWRkcmVzcyA9IGpvYkxvY2F0aW9uLmFkZHJlc3M7XG4gICAgICAgICAgICBpZiAoYWRkcmVzcykge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gW2FkZHJlc3MuYWRkcmVzc0xvY2FsaXR5LCBhZGRyZXNzLmFkZHJlc3NSZWdpb24sIGFkZHJlc3MuYWRkcmVzc0NvdW50cnldXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXh0cmFjdCBzYWxhcnlcbiAgICAgICAgbGV0IHNhbGFyeTtcbiAgICAgICAgY29uc3QgYmFzZVNhbGFyeSA9IGRhdGEuYmFzZVNhbGFyeTtcbiAgICAgICAgaWYgKGJhc2VTYWxhcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYmFzZVNhbGFyeS52YWx1ZTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbmN5ID0gYmFzZVNhbGFyeS5jdXJyZW5jeSB8fCAnVVNEJztcbiAgICAgICAgICAgICAgICBjb25zdCBtaW4gPSB2YWx1ZS5taW5WYWx1ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXggPSB2YWx1ZS5tYXhWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAobWluICYmIG1heCkge1xuICAgICAgICAgICAgICAgICAgICBzYWxhcnkgPSBgJHtjdXJyZW5jeX0gJHttaW4udG9Mb2NhbGVTdHJpbmcoKX0gLSAke21heC50b0xvY2FsZVN0cmluZygpfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhbGFyeSA9IGAke2N1cnJlbmN5fSAke3ZhbHVlLnRvTG9jYWxlU3RyaW5nKCl9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuY2xlYW5EZXNjcmlwdGlvbihkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5LFxuICAgICAgICAgICAgdHlwZTogdGhpcy5wYXJzZUVtcGxveW1lbnRUeXBlKGRhdGEuZW1wbG95bWVudFR5cGUpLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLmRldGVjdFNvdXJjZSgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IGRhdGEuZGF0ZVBvc3RlZCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcGFyc2VFbXBsb3ltZW50VHlwZSh0eXBlKSB7XG4gICAgICAgIGlmICghdHlwZSlcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGxvd2VyID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoJ2Z1bGwnKSlcbiAgICAgICAgICAgIHJldHVybiAnZnVsbC10aW1lJztcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKCdwYXJ0JykpXG4gICAgICAgICAgICByZXR1cm4gJ3BhcnQtdGltZSc7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcygnY29udHJhY3QnKSB8fCBsb3dlci5pbmNsdWRlcygndGVtcG9yYXJ5JykpXG4gICAgICAgICAgICByZXR1cm4gJ2NvbnRyYWN0JztcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKCdpbnRlcm4nKSlcbiAgICAgICAgICAgIHJldHVybiAnaW50ZXJuc2hpcCc7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGZpbmRUaXRsZSgpIHtcbiAgICAgICAgLy8gQ29tbW9uIHRpdGxlIHNlbGVjdG9yc1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnaDFbY2xhc3MqPVwidGl0bGVcIl0nLFxuICAgICAgICAgICAgJ2gxW2NsYXNzKj1cImpvYlwiXScsXG4gICAgICAgICAgICAnLmpvYi10aXRsZScsXG4gICAgICAgICAgICAnLnBvc3RpbmctdGl0bGUnLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJqb2ItdGl0bGVcIl0nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJwb3N0aW5nLXRpdGxlXCJdJyxcbiAgICAgICAgICAgICdoMScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAzICYmIHRleHQubGVuZ3RoIDwgMjAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBjb21tb24gbm9uLXRpdGxlIGNvbnRlbnRcbiAgICAgICAgICAgICAgICBpZiAoIXRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnc2lnbiBpbicpICYmICF0ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2xvZyBpbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgZG9jdW1lbnQgdGl0bGVcbiAgICAgICAgY29uc3QgZG9jVGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICAgICAgaWYgKGRvY1RpdGxlICYmIGRvY1RpdGxlLmxlbmd0aCA+IDUpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBjb21tb24gc3VmZml4ZXNcbiAgICAgICAgICAgIGNvbnN0IGNsZWFuZWQgPSBkb2NUaXRsZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMqWy18XVxccyouKyQvLCAnJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKmF0XFxzKy4rJC9pLCAnJylcbiAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgaWYgKGNsZWFuZWQubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGVhbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kQ29tcGFueSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJ1tjbGFzcyo9XCJjb21wYW55LW5hbWVcIl0nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJlbXBsb3llclwiXScsXG4gICAgICAgICAgICAnW2NsYXNzKj1cIm9yZ2FuaXphdGlvblwiXScsXG4gICAgICAgICAgICAnLmNvbXBhbnknLFxuICAgICAgICAgICAgJy5lbXBsb3llcicsXG4gICAgICAgICAgICAnYVtocmVmKj1cImNvbXBhbnlcIl0nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMSAmJiB0ZXh0Lmxlbmd0aCA8IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBtZXRhIHRhZ3NcbiAgICAgICAgY29uc3Qgb2dTaXRlTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbcHJvcGVydHk9XCJvZzpzaXRlX25hbWVcIl0nKTtcbiAgICAgICAgaWYgKG9nU2l0ZU5hbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBvZ1NpdGVOYW1lLmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZpbmREZXNjcmlwdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJy5qb2ItZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgJy5wb3N0aW5nLWRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICdbY2xhc3MqPVwiam9iLWRlc2NyaXB0aW9uXCJdJyxcbiAgICAgICAgICAgICdbY2xhc3MqPVwicG9zdGluZy1kZXNjcmlwdGlvblwiXScsXG4gICAgICAgICAgICAnW2NsYXNzKj1cImRlc2NyaXB0aW9uXCJdJyxcbiAgICAgICAgICAgICdhcnRpY2xlJyxcbiAgICAgICAgICAgICcuY29udGVudCcsXG4gICAgICAgICAgICAnbWFpbicsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sID0gdGhpcy5leHRyYWN0SHRtbENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGh0bWwgJiYgaHRtbC5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbkRlc2NyaXB0aW9uKGh0bWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kTG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdbY2xhc3MqPVwibG9jYXRpb25cIl0nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJhZGRyZXNzXCJdJyxcbiAgICAgICAgICAgICcubG9jYXRpb24nLFxuICAgICAgICAgICAgJy5qb2ItbG9jYXRpb24nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMiAmJiB0ZXh0Lmxlbmd0aCA8IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBkZXRlY3RTb3VyY2UoKSB7XG4gICAgICAgIGNvbnN0IGhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIC8vIFJlbW92ZSBjb21tb24gcHJlZml4ZXNcbiAgICAgICAgY29uc3QgY2xlYW5lZCA9IGhvc3RuYW1lXG4gICAgICAgICAgICAucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL15qb2JzXFwuLywgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXmNhcmVlcnNcXC4vLCAnJyk7XG4gICAgICAgIC8vIEV4dHJhY3QgbWFpbiBkb21haW5cbiAgICAgICAgY29uc3QgcGFydHMgPSBjbGVhbmVkLnNwbGl0KCcuJyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbGVhbmVkO1xuICAgIH1cbn1cbiIsIi8vIFNjcmFwZXIgcmVnaXN0cnkgLSBtYXBzIFVSTHMgdG8gYXBwcm9wcmlhdGUgc2NyYXBlcnNcbmltcG9ydCB7IExpbmtlZEluU2NyYXBlciB9IGZyb20gJy4vbGlua2VkaW4tc2NyYXBlcic7XG5pbXBvcnQgeyBXYXRlcmxvb1dvcmtzU2NyYXBlciB9IGZyb20gJy4vd2F0ZXJsb28td29ya3Mtc2NyYXBlcic7XG5pbXBvcnQgeyBJbmRlZWRTY3JhcGVyIH0gZnJvbSAnLi9pbmRlZWQtc2NyYXBlcic7XG5pbXBvcnQgeyBHcmVlbmhvdXNlU2NyYXBlciB9IGZyb20gJy4vZ3JlZW5ob3VzZS1zY3JhcGVyJztcbmltcG9ydCB7IExldmVyU2NyYXBlciB9IGZyb20gJy4vbGV2ZXItc2NyYXBlcic7XG5pbXBvcnQgeyBHZW5lcmljU2NyYXBlciB9IGZyb20gJy4vZ2VuZXJpYy1zY3JhcGVyJztcbi8vIEluaXRpYWxpemUgYWxsIHNjcmFwZXJzXG5jb25zdCBzY3JhcGVycyA9IFtcbiAgICBuZXcgTGlua2VkSW5TY3JhcGVyKCksXG4gICAgbmV3IFdhdGVybG9vV29ya3NTY3JhcGVyKCksXG4gICAgbmV3IEluZGVlZFNjcmFwZXIoKSxcbiAgICBuZXcgR3JlZW5ob3VzZVNjcmFwZXIoKSxcbiAgICBuZXcgTGV2ZXJTY3JhcGVyKCksXG5dO1xuY29uc3QgZ2VuZXJpY1NjcmFwZXIgPSBuZXcgR2VuZXJpY1NjcmFwZXIoKTtcbi8qKlxuICogR2V0IHRoZSBhcHByb3ByaWF0ZSBzY3JhcGVyIGZvciBhIFVSTFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2NyYXBlckZvclVybCh1cmwpIHtcbiAgICBjb25zdCBzY3JhcGVyID0gc2NyYXBlcnMuZmluZCgocykgPT4gcy5jYW5IYW5kbGUodXJsKSk7XG4gICAgcmV0dXJuIHNjcmFwZXIgfHwgZ2VuZXJpY1NjcmFwZXI7XG59XG4vKipcbiAqIENoZWNrIGlmIHdlIGhhdmUgYSBzcGVjaWFsaXplZCBzY3JhcGVyIGZvciB0aGlzIFVSTFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzU3BlY2lhbGl6ZWRTY3JhcGVyKHVybCkge1xuICAgIHJldHVybiBzY3JhcGVycy5zb21lKChzKSA9PiBzLmNhbkhhbmRsZSh1cmwpKTtcbn1cbi8qKlxuICogR2V0IGFsbCBhdmFpbGFibGUgc2NyYXBlciBzb3VyY2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmFpbGFibGVTb3VyY2VzKCkge1xuICAgIHJldHVybiBzY3JhcGVycy5tYXAoKHMpID0+IHMuc291cmNlKTtcbn1cbiIsIi8vIE1lc3NhZ2UgcGFzc2luZyB1dGlsaXRpZXMgZm9yIGV4dGVuc2lvbiBjb21tdW5pY2F0aW9uXG4vLyBUeXBlLXNhZmUgbWVzc2FnZSBjcmVhdG9yc1xuZXhwb3J0IGNvbnN0IE1lc3NhZ2VzID0ge1xuICAgIC8vIEF1dGggbWVzc2FnZXNcbiAgICBnZXRBdXRoU3RhdHVzOiAoKSA9PiAoeyB0eXBlOiAnR0VUX0FVVEhfU1RBVFVTJyB9KSxcbiAgICBvcGVuQXV0aDogKCkgPT4gKHsgdHlwZTogJ09QRU5fQVVUSCcgfSksXG4gICAgbG9nb3V0OiAoKSA9PiAoeyB0eXBlOiAnTE9HT1VUJyB9KSxcbiAgICAvLyBQcm9maWxlIG1lc3NhZ2VzXG4gICAgZ2V0UHJvZmlsZTogKCkgPT4gKHsgdHlwZTogJ0dFVF9QUk9GSUxFJyB9KSxcbiAgICAvLyBGb3JtIGZpbGxpbmcgbWVzc2FnZXNcbiAgICBmaWxsRm9ybTogKGZpZWxkcykgPT4gKHtcbiAgICAgICAgdHlwZTogJ0ZJTExfRk9STScsXG4gICAgICAgIHBheWxvYWQ6IGZpZWxkcyxcbiAgICB9KSxcbiAgICAvLyBTY3JhcGluZyBtZXNzYWdlc1xuICAgIHNjcmFwZUpvYjogKCkgPT4gKHsgdHlwZTogJ1NDUkFQRV9KT0InIH0pLFxuICAgIHNjcmFwZUpvYkxpc3Q6ICgpID0+ICh7IHR5cGU6ICdTQ1JBUEVfSk9CX0xJU1QnIH0pLFxuICAgIGltcG9ydEpvYjogKGpvYikgPT4gKHtcbiAgICAgICAgdHlwZTogJ0lNUE9SVF9KT0InLFxuICAgICAgICBwYXlsb2FkOiBqb2IsXG4gICAgfSksXG4gICAgaW1wb3J0Sm9ic0JhdGNoOiAoam9icykgPT4gKHtcbiAgICAgICAgdHlwZTogJ0lNUE9SVF9KT0JTX0JBVENIJyxcbiAgICAgICAgcGF5bG9hZDogam9icyxcbiAgICB9KSxcbiAgICAvLyBMZWFybmluZyBtZXNzYWdlc1xuICAgIHNhdmVBbnN3ZXI6IChkYXRhKSA9PiAoe1xuICAgICAgICB0eXBlOiAnU0FWRV9BTlNXRVInLFxuICAgICAgICBwYXlsb2FkOiBkYXRhLFxuICAgIH0pLFxuICAgIHNlYXJjaEFuc3dlcnM6IChxdWVzdGlvbikgPT4gKHtcbiAgICAgICAgdHlwZTogJ1NFQVJDSF9BTlNXRVJTJyxcbiAgICAgICAgcGF5bG9hZDogcXVlc3Rpb24sXG4gICAgfSksXG4gICAgam9iRGV0ZWN0ZWQ6IChtZXRhKSA9PiAoe1xuICAgICAgICB0eXBlOiAnSk9CX0RFVEVDVEVEJyxcbiAgICAgICAgcGF5bG9hZDogbWV0YSxcbiAgICB9KSxcbn07XG4vLyBTZW5kIG1lc3NhZ2UgdG8gYmFja2dyb3VuZCBzY3JpcHRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSB8fCB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ05vIHJlc3BvbnNlIHJlY2VpdmVkJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBTZW5kIG1lc3NhZ2UgdG8gY29udGVudCBzY3JpcHQgaW4gc3BlY2lmaWMgdGFiXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFRvVGFiKHRhYklkLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCBtZXNzYWdlLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UgfHwgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyByZXNwb25zZSByZWNlaXZlZCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8gU2VuZCBtZXNzYWdlIHRvIGFsbCBjb250ZW50IHNjcmlwdHNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBicm9hZGNhc3RNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe30pO1xuICAgIGZvciAoY29uc3QgdGFiIG9mIHRhYnMpIHtcbiAgICAgICAgaWYgKHRhYi5pZCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgIC8vIFRhYiBtaWdodCBub3QgaGF2ZSBjb250ZW50IHNjcmlwdCBsb2FkZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIENvbnRlbnQgc2NyaXB0IGVudHJ5IHBvaW50IGZvciBDb2x1bWJ1cyBleHRlbnNpb25cbi8vIEltcG9ydCBzdHlsZXMgZm9yIGNvbnRlbnQgc2NyaXB0XG5pbXBvcnQgJy4vdWkvc3R5bGVzLmNzcyc7XG5pbXBvcnQgeyBGaWVsZERldGVjdG9yIH0gZnJvbSAnLi9hdXRvLWZpbGwvZmllbGQtZGV0ZWN0b3InO1xuaW1wb3J0IHsgRmllbGRNYXBwZXIgfSBmcm9tICcuL2F1dG8tZmlsbC9maWVsZC1tYXBwZXInO1xuaW1wb3J0IHsgQXV0b0ZpbGxFbmdpbmUgfSBmcm9tICcuL2F1dG8tZmlsbC9lbmdpbmUnO1xuaW1wb3J0IHsgZ2V0U2NyYXBlckZvclVybCB9IGZyb20gJy4vc2NyYXBlcnMvc2NyYXBlci1yZWdpc3RyeSc7XG5pbXBvcnQgeyBzZW5kTWVzc2FnZSwgTWVzc2FnZXMgfSBmcm9tICdAL3NoYXJlZC9tZXNzYWdlcyc7XG4vLyBJbml0aWFsaXplIGNvbXBvbmVudHNcbmNvbnN0IGZpZWxkRGV0ZWN0b3IgPSBuZXcgRmllbGREZXRlY3RvcigpO1xubGV0IGF1dG9GaWxsRW5naW5lID0gbnVsbDtcbmxldCBjYWNoZWRQcm9maWxlID0gbnVsbDtcbmxldCBkZXRlY3RlZEZpZWxkcyA9IFtdO1xubGV0IHNjcmFwZWRKb2IgPSBudWxsO1xubGV0IGpvYkRldGVjdGVkRm9yVXJsID0gbnVsbDtcbi8vIFNjYW4gcGFnZSBvbiBsb2FkXG5zY2FuUGFnZSgpO1xuLy8gUmUtc2NhbiBvbiBkeW5hbWljIGNvbnRlbnQgY2hhbmdlc1xuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihkZWJvdW5jZShzY2FuUGFnZSwgNTAwKSk7XG5vYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuYXN5bmMgZnVuY3Rpb24gc2NhblBhZ2UoKSB7XG4gICAgLy8gRGV0ZWN0IGZvcm1zXG4gICAgY29uc3QgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJyk7XG4gICAgZm9yIChjb25zdCBmb3JtIG9mIGZvcm1zKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGZpZWxkRGV0ZWN0b3IuZGV0ZWN0RmllbGRzKGZvcm0pO1xuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRldGVjdGVkRmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tDb2x1bWJ1c10gRGV0ZWN0ZWQgZmllbGRzOicsIGZpZWxkcy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIENoZWNrIGZvciBqb2IgbGlzdGluZ1xuICAgIGNvbnN0IHNjcmFwZXIgPSBnZXRTY3JhcGVyRm9yVXJsKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICBpZiAoc2NyYXBlci5jYW5IYW5kbGUod2luZG93LmxvY2F0aW9uLmhyZWYpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzY3JhcGVkSm9iID0gYXdhaXQgc2NyYXBlci5zY3JhcGVKb2JMaXN0aW5nKCk7XG4gICAgICAgICAgICBpZiAoc2NyYXBlZEpvYikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbQ29sdW1idXNdIFNjcmFwZWQgam9iOicsIHNjcmFwZWRKb2IudGl0bGUpO1xuICAgICAgICAgICAgICAgIGlmIChqb2JEZXRlY3RlZEZvclVybCAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgam9iRGV0ZWN0ZWRGb3JVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuam9iRGV0ZWN0ZWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHNjcmFwZWRKb2IudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55OiBzY3JhcGVkSm9iLmNvbXBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNjcmFwZWRKb2IudXJsLFxuICAgICAgICAgICAgICAgICAgICB9KSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcignW0NvbHVtYnVzXSBGYWlsZWQgdG8gbm90aWZ5IGpvYiBkZXRlY3RlZDonLCBlcnIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0NvbHVtYnVzXSBTY3JhcGUgZXJyb3I6JywgZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIEhhbmRsZSBtZXNzYWdlcyBmcm9tIHBvcHVwIGFuZCBiYWNrZ3JvdW5kXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgaGFuZGxlTWVzc2FnZShtZXNzYWdlKVxuICAgICAgICAudGhlbihzZW5kUmVzcG9uc2UpXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTsgLy8gQXN5bmMgcmVzcG9uc2Vcbn0pO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnR0VUX1BBR0VfU1RBVFVTJzpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaGFzRm9ybTogZGV0ZWN0ZWRGaWVsZHMubGVuZ3RoID4gMCxcbiAgICAgICAgICAgICAgICBoYXNKb2JMaXN0aW5nOiBzY3JhcGVkSm9iICE9PSBudWxsLFxuICAgICAgICAgICAgICAgIGRldGVjdGVkRmllbGRzOiBkZXRlY3RlZEZpZWxkcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgc2NyYXBlZEpvYixcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgJ1RSSUdHRVJfRklMTCc6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlRmlsbEZvcm0oKTtcbiAgICAgICAgY2FzZSAnVFJJR0dFUl9JTVBPUlQnOlxuICAgICAgICAgICAgaWYgKHNjcmFwZWRKb2IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VuZE1lc3NhZ2UoTWVzc2FnZXMuaW1wb3J0Sm9iKHNjcmFwZWRKb2IpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ05vIGpvYiBkZXRlY3RlZCcgfTtcbiAgICAgICAgY2FzZSAnU0NSQVBFX0pPQic6XG4gICAgICAgICAgICBjb25zdCBzY3JhcGVyID0gZ2V0U2NyYXBlckZvclVybCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICBpZiAoc2NyYXBlci5jYW5IYW5kbGUod2luZG93LmxvY2F0aW9uLmhyZWYpKSB7XG4gICAgICAgICAgICAgICAgc2NyYXBlZEpvYiA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlSm9iTGlzdGluZygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHNjcmFwZWRKb2IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ05vIHNjcmFwZXIgYXZhaWxhYmxlIGZvciB0aGlzIHNpdGUnIH07XG4gICAgICAgIGNhc2UgJ1NDUkFQRV9KT0JfTElTVCc6XG4gICAgICAgICAgICBjb25zdCBsaXN0U2NyYXBlciA9IGdldFNjcmFwZXJGb3JVcmwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgaWYgKGxpc3RTY3JhcGVyLmNhbkhhbmRsZSh3aW5kb3cubG9jYXRpb24uaHJlZikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JzID0gYXdhaXQgbGlzdFNjcmFwZXIuc2NyYXBlSm9iTGlzdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGpvYnMgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ05vIHNjcmFwZXIgYXZhaWxhYmxlIGZvciB0aGlzIHNpdGUnIH07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIG1lc3NhZ2UgdHlwZTogJHttZXNzYWdlLnR5cGV9YCB9O1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUZpbGxGb3JtKCkge1xuICAgIGlmIChkZXRlY3RlZEZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm8gZmllbGRzIGRldGVjdGVkJyB9O1xuICAgIH1cbiAgICAvLyBHZXQgcHJvZmlsZSBpZiBub3QgY2FjaGVkXG4gICAgaWYgKCFjYWNoZWRQcm9maWxlKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2V0UHJvZmlsZSgpKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzIHx8ICFyZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdGYWlsZWQgdG8gbG9hZCBwcm9maWxlJyB9O1xuICAgICAgICB9XG4gICAgICAgIGNhY2hlZFByb2ZpbGUgPSByZXNwb25zZS5kYXRhO1xuICAgIH1cbiAgICAvLyBDcmVhdGUgbWFwcGVyIGFuZCBlbmdpbmVcbiAgICBjb25zdCBtYXBwZXIgPSBuZXcgRmllbGRNYXBwZXIoY2FjaGVkUHJvZmlsZSk7XG4gICAgYXV0b0ZpbGxFbmdpbmUgPSBuZXcgQXV0b0ZpbGxFbmdpbmUoZmllbGREZXRlY3RvciwgbWFwcGVyKTtcbiAgICAvLyBGaWxsIHRoZSBmb3JtXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXV0b0ZpbGxFbmdpbmUuZmlsbEZvcm0oZGV0ZWN0ZWRGaWVsZHMpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdCB9O1xufVxuLy8gVXRpbGl0eTogZGVib3VuY2UgZnVuY3Rpb25cbmZ1bmN0aW9uIGRlYm91bmNlKGZuLCBkZWxheSkge1xuICAgIGxldCB0aW1lb3V0SWQ7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGZuKC4uLmFyZ3MpLCBkZWxheSk7XG4gICAgfTtcbn1cbmNvbnNvbGUubG9nKCdbQ29sdW1idXNdIENvbnRlbnQgc2NyaXB0IGxvYWRlZCcpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9