<script lang="ts">
    import { onMount } from "svelte";
    import { Segment } from '@skeletonlabs/skeleton-svelte';
    import { draw } from "svelte/transition";

    let size = $state('sm');

    let width: number = $state(0)
    let pixels: Array<Array<string>> = $state([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],])
    let isScreenLarge: boolean = $derived(width > 1023)

    let zoomSizes: Array<number> = $state([2, 3, 4, 5, 6])
    let zoomLevel: number = $state(0)

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
        }, 750);
    }

    let activeColor: string = $state("#000000")

    async function sendPixel(i: number) {
        pixels[Math.floor(i/100)][i % 100] = activeColor
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',       
            },
            body: JSON.stringify({index: i, color: activeColor}), 
        });
    }

    function zoomIn() {
        if (zoomLevel < 4) zoomLevel = zoomLevel + 1
    }

    function zoomOut() {
        if (zoomLevel > 0) zoomLevel = zoomLevel - 1
    }

    onMount(() => {
        GetPixels()
    })

</script>

<svelte:window bind:innerWidth={width}/>
<div class="flex flex-col lg:flex-row">
    <div class="bg-surface-100-900 flex flex-row lg:flex-col h-screen w-[120px]">
        <Segment name="size" value={size} onValueChange={(e) => (size = e.value!)} orientation="vertical">
            <Segment.Item value="sm">Small</Segment.Item>
            <Segment.Item value="md">Medium</Segment.Item>
            <Segment.Item value="lg">Large</Segment.Item>
        </Segment>
        <button onclick={() => zoomIn()} disabled={zoomLevel == 4}>Zoom In</button>
        <button onclick={() => zoomOut()} disabled={zoomLevel == 0}>Zoom Out</button>
    </div>
    <div class="grid grid-rows-100 grid-cols-100 h-screen w-1/2 overflow-scroll">
        {#each Array(10000) as _, i}
            <button onclick={() => sendPixel(i)} style="background-color: {pixels[Math.floor(i/100)][i % 100]}" class="w-{zoomSizes[zoomLevel]} h-{zoomSizes[zoomLevel]} border-[1px] border-gray-300" aria-label="pixel"></button>
        {/each}
    </div>
</div>
