import { z } from 'zod'
import { error } from '@sveltejs/kit'

const contactSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(2)
        .max(64, { message: 'Name must be less than 64 characters' })
        .trim(),
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .max(64, { message: 'Email must be less than 64 characters'})
        .email({ message: 'Email must be a valid email address'}),
    message: z
        .string({ required_error: 'Message is required'})
        .min(5, { message: 'Message must be at least 5 characters' })
        .trim()
})
const loginSchema = z.object({
    username: z
        .string({required_error: 'Username is required'})
        .min(1)
        .trim(),
    password: z
        .string({required_error: 'Password is required'})
        .min(1)
        .trim()
})

export const actions = {
    contactus: async({ request }) => {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = contactSchema.parse(formData)
            console.log('validation success!')
            console.log(result)
        }
        catch(err:any) {
            const { fieldErrors: errors } = err.flatten()
            const { name, email, message } = formData
            return {
                name, email, message, errors
            }
        }
    },
    login: async({ request, fetch, cookies }) => {
        const formData:any = Object.fromEntries(await request.formData())

        try {
            // validation
            const valResult = loginSchema.parse(formData)

            // api invoke
            console.log("------- invoke login api");
            const apiResponse = await fetch('http://host.docker.internal:8080/api/auth/login-cookie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: valResult.username,
                    password: valResult.password
                }),
                credentials: 'include'
            })
            console.log("------- invoke login api response");

            // handle api response
            if(apiResponse.ok){
                const apiResultJson = await apiResponse.json()
                request.headers.set('set-cookie', apiResponse.headers.get('set-cookie') ?? "")
            } else {
                throw new Error(apiResponse.statusText)
            }
        }
        catch(err: any) {
            const { username, password } = formData

            // form error
            if(err?.flatten) {
                const { fieldErrors: formErrors } = err?.flatten() ?? {}
                return {
                    username, password, formErrors
                }
            }

            // api error
            return {
                username,
                apiErrors: err?.message
            }
        }
    }
}