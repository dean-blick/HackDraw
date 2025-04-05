<script lang="ts">
    import { onMount } from "svelte";

    let width: number = $state(0)
    let pixels: Array<string> = $state([])
    let isScreenLarge: boolean = $derived(width > 1023)

    async function GetPixels() {
        let response = await fetch('/')
        let pixels = await response.json()
        await setTimeout(() => {
            GetPixels()
        }, 500);
    }

    onMount(() => {
        GetPixels()
    })

</script>

<svelte:window bind:innerWidth={width}/>

<div class="flex flex-row lg:flex-col">

</div>
{#each Array(5) as _, i}
    <button style="backgroundColor: {pixels[i]}" class="w-4 h-4" aria-label="pixel"></button>
{/each}