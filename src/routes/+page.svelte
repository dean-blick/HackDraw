<script lang="ts">
    import { onMount } from "svelte";
    import { Segment } from '@skeletonlabs/skeleton-svelte';

    let size = $state('sm');

    let width: number = $state(0)
    let pixels: Array<Array<string>> = $state([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],])
    let isScreenLarge: boolean = $derived(width > 1023)

    async function GetPixels() {
        let response = await fetch('/')
        let data: Array<{index: number, pixels: Array<string>}> = await response.json()
        let i = 0
        data.forEach(element => {
            pixels[i] = element.pixels
            i = i + 1
        });
        await setTimeout(() => {
            GetPixels()
        }, 500);
    }

    onMount(() => {
        GetPixels()
    })

</script>

<svelte:window bind:innerWidth={width}/>
<div class="flex flex-col lg:flex-row">
    <div class="card bg-surface-100-900 flex flex-row lg:flex-col h-screen">
        <Segment name="size" value={size} onValueChange={(e) => (size = e.value!)} orientation="vertical">
            <Segment.Item value="sm">Small</Segment.Item>
            <Segment.Item value="md">Medium</Segment.Item>
            <Segment.Item value="lg">Large</Segment.Item>
          </Segment>
    </div>
</div>
<div class="grid grid-rows-100 grid-cols-100">
    {#each Array(10000) as _, i}
        <button style="backgroundColor: {pixels[Math.floor(i/100)][i % 100]}" class="w-4 h-4" aria-label="pixel"></button>
    {/each}

</div>