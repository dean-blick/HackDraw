<script lang="ts">
    import { onMount } from "svelte";
    import { Segment } from '@skeletonlabs/skeleton-svelte';
    
	import ColorPicker from 'svelte-awesome-color-picker';


    let size = $state('sm');

    let width: number = $state(0)
    let pixels: Array<Array<string>> = $state([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],])
    let isScreenLarge: boolean = $derived(width > 1023)

    let zoomSizes: Array<number> = $state([1, 2, 3, 4, 5])
    let zoomLevel: number = $state(0)

    let colors: Array<string> = $state(["#FFFFFF","#000000","#FF0000","#00FF00","#0000FF"])

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
        if (colors.includes(activeColor)) {
            console.log(colors)
        } else {
            colors.push(activeColor)
            console.log(colors)
        }

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

{#if !isScreenLarge}
    <div class="h-screen w-screen absolute bg-surface-50-950">
        Please interact with this app on a larger screen, we are still working on mobile!
    </div>
{/if}
{#if isScreenLarge}

    <div class="flex flex-col lg:flex-row">
        <div class="bg-surface-100-900 flex flex-row lg:flex-col h-screen w-[120px]">
            <ColorPicker
                bind:hex = {activeColor}
            position="responsive"
            />
            <Segment name="size" value={activeColor} onValueChange={(e) => (activeColor = e.value!)} orientation="vertical">
                {#each colors as color}
                    <Segment.Item value={color} ><div class="w-4 h-4" style="background-color: {color}"></div></Segment.Item>
                {/each}
            </Segment>
            <button onclick={() => zoomIn()} disabled={zoomLevel == 4}>Zoom In</button>
            <button onclick={() => zoomOut()} disabled={zoomLevel == 0}>Zoom Out</button>
        </div>
        <div class="grid grid-rows-100 grid-cols-100 h-screen w-1/2">
            {#each Array(10000) as _, i}
                <button onclick={() => sendPixel(i)} style="background-color: {pixels[Math.floor(i/100)][i % 100]}" class="p-1 border-[1px] border-gray-300" aria-label="pixel"></button>
            {/each}
        </div>
    </div>
    
{/if}