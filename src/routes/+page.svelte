<script lang="ts">
    import { onMount } from "svelte";
    import { Segment } from '@skeletonlabs/skeleton-svelte';
    import pixelData from '../lib/pixels.json'
    import names from '../lib/names.json'
    
	import ColorPicker from 'svelte-awesome-color-picker';

    import type { PageData } from "./$types";

    let size = $state('sm');

    let contributors: Array<string> = $state([])

    let gridDisabled: boolean = $state(false)

    let width: number = $state(0)
    let pixels: Array<Array<string>> = $state([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],])
    let isScreenLarge: boolean = $derived(width > 1024)

    let userName: string = $state("")

    let zoomSizes: Array<number> = $state([1, 2, 3, 4, 5])
    let zoomLevel: number = $state(0)

    let hasAgreed: boolean = $state(false)

    let colors: Array<string> = $state(["#FFFFFF","#000000","#FF0000","#00FF00","#0000FF"])

    

    let activeColor: string = $state("#000000")

    async function sendPixel(i: number) {
        if (!colors.includes(activeColor)) {
            colors.push(activeColor)
        }

        pixels[Math.floor(i/100)][i % 100] = activeColor
    }

    async function agree() {
        hasAgreed = true;
    }

    onMount(() => {
        //contributors = data.data
        //replace with hard coded data

        let i = 0
        pixels = pixelData
    })

</script>


<svelte:window bind:innerWidth={width}/>


{#if !hasAgreed}
    <div class="flex flex-col justify-center items-center h-screen w-screen">
        <div class="card w-1/6 mb-5">
            This app is no longer connected to the database in order to preserve the creation of the participants of Hack KU 2025. You can still use it as it was, but your changes will not save. 
        </div>
        <div class="card w-1/6 mb-5">
            Contributors were able to input a name if they wanted to be included in the list, but many chose not to be. Thanks!
        </div>
        <button onclick={() => agree()} class="btn preset-filled-primary-500">
            Enter
        </button>
    </div>
{/if}
{#if !isScreenLarge && hasAgreed}
    <div class="h-screen w-screen absolute bg-surface-50-950">
        Please interact with this app on a larger screen, we are still working on mobile!
    </div>
{/if}
{#if isScreenLarge && hasAgreed}
    <div class="flex lg:flex-row">
        <div class="bg-surface-100-900 flex flex-row lg:flex-col h-screen w-[175px]">
            <div class="w-40 btn preset-filled-surface-500 z-10 m-1 self-center">
                <ColorPicker
                    bind:hex = {activeColor}
                    
                position="responsive"
                />
            </div>
            <Segment name="size" value={activeColor} onValueChange={(e) => (activeColor = e.value!)} orientation="vertical">
                <div class="grid grid-cols-3">
                    {#each colors as color}
                        <Segment.Item value={color} ><div class="w-4 h-4" style="background-color: {color}"></div></Segment.Item>
                    {/each}

                </div>
            </Segment>
            <div class="flex flex-row w-full justify-center items-center">
                <div class="mr-2">Grid: </div>
                <input type="checkbox" bind:checked={gridDisabled}/>
            </div>
        </div>
        <div class="grid grid-rows-100 grid-cols-100 h-screen w-200">
            {#each Array(10000) as _, i}
                <button onclick={() => sendPixel(i)} style="background-color: {pixels[Math.floor(i/100)][i % 100]}" class={"p-1  " + (gridDisabled ? (" border-[1px] border-gray-300") : ("border-0"))} aria-label="pixel"></button>
            {/each}
        </div>
        <div class="flex flex-col ml-10 overflow-y-scroll h-screen">
            <h1 class="card m-2 font-bold">Contributors: </h1>
            {#each names.names as item}
                <div class="card bg-surface-300-700 m-3 py-1 px-2">{item}</div>
            {/each}
        </div>
    </div>
    
{/if}