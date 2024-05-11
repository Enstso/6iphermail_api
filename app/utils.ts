
async function requestHelper(url: string, method: string,header?: any, body?: any) {
    body = body || {};
    const req = await fetch(url, {
        method: method,
        headers: header,
        body:  JSON.stringify(body),
    });

    return req;
}

export default requestHelper;