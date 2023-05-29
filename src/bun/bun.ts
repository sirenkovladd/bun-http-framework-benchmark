/// <reference types="bun-types" />
import Bun from "bun";

const notFound = { status: 404 };
const json = {
    headers: {
        'content-type': 'application/json'
    }
}
const paramPath = '/id/';
const paramPathLen = paramPath.length;

// Serve the server
export default {
    port: 3000,
    async fetch(req) {
        let path: string;
        let query: string;
        const method = req.method;

        // This part parses the path and the query
        const url = req.url;
        const pathStart = url.indexOf('/', 12);
        const pathEnd = url.indexOf('?', pathStart + 1);

        if (-1 === pathEnd) {
            path = url.substring(pathStart);
            query = '';
        } else {
            path = url.substring(pathStart, pathEnd);
            query = url.substring(pathEnd + 1);
        }

        // Handle static routes
        switch (path) {
            // Handle GET request to '/'
            case '/':
                if (method === 'GET')
                    return new Response('Hi');
                return new Response('', notFound);
            // Handle POST request to '/json'
            case '/json':
                if (method === 'JSON')
                    return new Response(
                        JSON.stringify(await req.json()), json
                    );
                return new Response('', notFound);
            // Handle GET request to '/id/...'
            default:
                if (method === "GET") {
                    // Check param 
                    const param = path.indexOf(paramPath);
                    if (param === -1)
                        return new Response('', notFound);

                    return new Response(
                        path.substring(param + paramPathLen) + ' ' +
                        new URLSearchParams(query).get('name')
                    );
                }
        }
    }
} as Bun.ServeOptions;

// This shows how hard it is to code a fast server without using a framework
// I like Stric and Elysia
