import { canvasData } from "$lib/server/canvasData";

export async function GET(): Promise<Response> {

    const data = (await canvasData.find().toArray()).map(e => ({
        ...e,
        _id: "none"
    }))
    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json',
        }
    });
}