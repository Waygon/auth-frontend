import type { Handle, HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
    // sync request client cookie
    request.headers.set('cookie', event.request.headers.get('cookie') ?? "");
	return fetch(request);
};

export const handle:Handle = async ({ event, resolve }) => {
    const response = await resolve(event)

    console.log("[Hook] Handle:", response)
    // if(event.locals.session.data) {

    // }

    return response;
}