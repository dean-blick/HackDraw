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

export async function POST({request}): Promise<Response> {
    let body = await request.json()
    const filter = { index: Math.floor(body.index / 100) }; // Find the document with _id 1
    
    const data = (await canvasData.find(filter).toArray()).map(e => ({
        ...e
    }))
    let doc = data[0]
    let newPixels = doc.pixels
    newPixels[body.index%100] = body.color
    const updateDoc = {
        $set: { pixels: newPixels },
    };
    
    await canvasData.updateOne(filter, updateDoc)

    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json',
        }
    });
}