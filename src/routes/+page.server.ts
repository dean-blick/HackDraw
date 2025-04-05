
import type { PageServerLoad } from "./$types";
import { canvasInfo } from "$lib/server/canvasInfo";
import { canvasBackup } from "$lib/server/canvasBackup";
import { canvasData } from "$lib/server/canvasData";


export const load: PageServerLoad = async function() {
    // canvasBackup.drop()
    // const backup = (await canvasData.find().toArray()).map(e => ({
    //     ...e
    // }))
    // backup.forEach((element) => {
    //     canvasBackup.insertOne({index: element.index, pixels: element.pixels})
    // })
    const data = (await canvasInfo.find().toArray()).map(e => ({
        ...e
    }))
    return {data: data[0].usernames}
}