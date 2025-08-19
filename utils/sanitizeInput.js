import sanitizeHtml from 'sanitize-html'

export const sanitizeInput = (data) => {

    const sanitizedData = {};

    for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string') {
            sanitizedData[key] = sanitizeHtml(val, { allowedTags: ['b'], allowedAttributes: {}});
        } else {
            sanitizedData[key] = val;
        }
    }

    return sanitizedData;
}