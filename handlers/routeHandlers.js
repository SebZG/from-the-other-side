import { getData } from '../utils/getData.js'
import { sendResponse } from '../utils/sendResponse.js'
import { parseJSONBody } from '../utils/parseJSONBody.js'
import { sanitizeInput } from '../utils/sanitizeInput.js'
import { addNewSighting } from '../utils/addNewSighting.js'
import { sightingEvents } from '../events/sightingEvents.js'
import { stories } from '../data/stories.js'

export const handleGet = async (res) => {
    const data = await getData();
    const content = JSON.stringify(data);
    sendResponse(res, 200, 'application/json', content);
}

export const handlePost = async (req, res) => {

    try {

        const parsedBody = await parseJSONBody(req);
        const sanitizedBody = sanitizeInput(parsedBody);
        await addNewSighting(sanitizedBody);
        sightingEvents.emit('sighting-added', sanitizedBody);
        sendResponse(res, 201, 'application/json', JSON.stringify(sanitizedBody));

    } catch (err) {
        sendResponse(res, 400, 'application/json', JSON.stringify({ error: err }));
    }

}

export const handleNews = async (req, res) => {
    res.statusCode = 200;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    setInterval(() => {
        let randomIndex = Math.floor(Math.random() * stories.length);

        res.write(
            `data: ${JSON.stringify({
                event: 'news-update',
                story: stories[randomIndex]
            })}\n\n`
        );
    }, 3000);
}