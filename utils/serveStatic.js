import path from 'node:path'
import fs from 'node:fs/promises'

import { sendResponse } from './sendResponse.js'
import { getContentType } from './getContentType.js'

export const serveStatic = async (req, res, baseDir) => {

    const publicDir = path.join(baseDir, 'public');
    const filePath = path.join(
        publicDir,
        req.url === '/' ? 'index.html' : req.url
    );

    // console.log('Request URL:', req.url);
    // console.log('Serving file:', filePath);

    const ext = path.extname(filePath);
    const contentType = getContentType(ext);

    try {

        const content = await fs.readFile(filePath);
        // console.log('Content type:', contentType);
        sendResponse(res, 200, contentType, content);

    } catch (err) {

        if (err.code === 'ENOENT') {
            const content = await fs.readFile(path.join(publicDir, '404.html'));
            sendResponse(res, 404, 'text/html', content);
        } else {
            sendResponse(res, 500, 'text/html', '<html><h1>Server Error: ${err.code}</h1></html>');
        }

    }

}
