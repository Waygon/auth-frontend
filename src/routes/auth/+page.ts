import type { ServerLoad } from "@sveltejs/kit"

export const load:ServerLoad = async ({ locals }) => {
    return {
        'version': "1.0"
    }
}