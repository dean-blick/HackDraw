
import type { PageServerLoad } from "./$types";
import { canvasInfo } from "$lib/server/canvasInfo";


export const load: PageServerLoad = async function() {

    const data = (await canvasInfo.find().toArray()).map(e => ({
        ...e
    }))
    console.log(data)
    return {data: data[0].usernames}
}