<script lang='ts'>
    import { enhance } from "$app/forms";
    import { error } from "@sveltejs/kit";

    export let form:any;
    export let data:any;

    $: console.log(form)
    
    const getReportTypeOptions = async () => {
        try {
            const res = await fetch('http://10.31.128.18:8080/api/ReportShare/report-type-options', {
                method: 'GET',
                credentials: 'include'
            })
            
            if(!res.ok)
                return new Error(res.statusText)

            const resJson = await res?.json()
            return resJson;
        } catch(err) {
            console.log(err)
            throw err
        }
    }

    let reportTypeOptions = getReportTypeOptions();
</script>

{#if form?.success}
    <div class="bg-slate-300 rounded-md p-4">
        <p>Name: {form?.formData.name}</p>
        <p>Message: {form?.formData.message}</p>
    </div>
{/if}

<h1 class="mb-2 font-bold">Svelte Kit Forms</h1>

<form class="bg-slate-200 rounded-lg p-6" action="?/contactus" method="POST" use:enhance>
    <div>
        <label for="name">Name</label>
        <input type="text" name="name" placeholder="Type your name..." value={form?.name ?? ""}>
        {#if form?.errors?.name}
            <span class="text-red-600">{form?.errors?.name[0]}</span>
        {/if}
    </div>

    <div>
        <label for="email">Email</label>
        <input type="text" name="email" placeholder="Type here..." value={form?.email ?? ""}>
        {#if form?.errors?.email}
            <span class="text-red-600">{form?.errors?.email[0]}</span>
        {/if}
    </div>

    <div>
        <label for="message">Message</label>
        <textarea name="message" cols="30" rows="10">{form?.message}</textarea>
        {#if form?.errors?.message}
            <span class="text-red-600">{form?.errors?.message[0]}</span>
        {/if}
    </div>

    <button>Submit</button>
</form>

<h1 class="mb-2 mt-4 font-bold">Login Form</h1>

<form class="bg-slate-200 rounded-lg p-6" action="?/login" method="POST" use:enhance>
    {#if form?.apiErrors}
        <div class="text-red-600">Errors: {form?.apiErrors}</div>
    {/if}
    <div>
        <label for="username">Username</label>
        <input type="text" name="username" placeholder="Username..." value={form?.username ?? ""} autocomplete="off"/>
        {#if form?.formErrors?.username}
            <span class="text-red-600">{form?.formErrors?.username[0]}</span>
        {/if}
    </div>

    <div>
        <label for="username">Password</label>
        <input type="password" name="password" placeholder="Password..." value={form?.password ?? ""} autocomplete="new-password"/>
        {#if form?.formErrors?.password}
            <span class="text-red-600">{form?.formErrors?.password[0]}</span>
        {/if}
    </div>

    <button class="bg-green-400 p-2 rounded-md">Submit</button>
</form>

<h1 class="mb-2 mt-4 font-bold">Load Data</h1>
<section>
    <div>Version {data?.version ?? "-"}</div>
    <div>Report Type Options: 
        <button class="bg-orange-200 p-1 rounded-md" on:click={() => { reportTypeOptions = getReportTypeOptions() }}>Reload</button>
        {#await reportTypeOptions}
            Loading data...
        {:then data}
            {data}
        {:catch err}
            {err}
        {/await}
    </div>
</section>

