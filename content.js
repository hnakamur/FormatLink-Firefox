browser.runtime.onMessage.addListener(request => {
    if (request.method === 'getSelection') {
        // Replace successive spaces including newlines to one space.
        var sel = window.getSelection().toString().trim().replace(/\s+/g, ' ');
        return Promise.resolve({"selection": sel});
    } else {
        return Promise.resolve({"error": "unknown method"});
    }
});
