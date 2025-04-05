<script lang="ts">
    import { onMount } from "svelte";
    import { Segment } from '@skeletonlabs/skeleton-svelte';
    
	import ColorPicker from 'svelte-awesome-color-picker';

    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

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
        }, 250);
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
            body: JSON.stringify({type: "pixel", index: i, color: activeColor}), 
        });
    }

    async function agree() {
        hasAgreed = true;
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',       
            },
            body: JSON.stringify({type: "agree", userName: userName}), 
        });
    }

    onMount(() => {
        GetPixels()
        contributors = data.data
        
    })

</script>


<svelte:window bind:innerWidth={width}/>


{#if !hasAgreed}
    <div class="flex flex-col justify-center items-center h-screen w-screen">
        <div class="card w-1/6 mb-5">
            By clicking the button below you agree to respect the contributions of others and to keep the art appropriate. Enjoy!
        </div>
        <div class="card w-1/6 mb-2">Please enter your name if you would like to be on the list of contributors:</div>
        <input type="text" class="input w-1/6 mb-5" bind:value={userName}/>
        <button onclick={() => agree()} class="btn preset-filled-primary-500">
            I Agree
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
        <div class="flex flex-col justify-center ml-10 overflow-scroll">
            <h1 class="card m-2 font-bold">Contributors: </h1>
            {#each contributors as item}
                <div class="card bg-surface-300-700 m-3 py-1 px-2">{item}</div>
            {/each}
        </div>
    </div>
    
{/if}