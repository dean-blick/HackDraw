import { canvasData } from "$lib/server/canvasData";
import { canvasInfo } from "$lib/server/canvasInfo"
import { ObjectId } from "mongodb";

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

    const info = (await canvasInfo.find().toArray()).map(e => ({
        ...e
    }))
    let infoData = info[0]
    let newUsers: Array<string> = infoData.usernames
    if (!newUsers.includes(body.userName) && body.userName != "") {
        newUsers.push(body.userName)
    }
    console.log(newUsers)
    canvasInfo.updateOne({"_id": ObjectId.createFromHexString('67f1887bfc15c7e9ea128c26')}, {$set: {usernames: newUsers}})

    if (body.type == "agree") {
        return new Response(JSON.stringify({success: true}), {
            headers: {
                'content-type': 'application/json',
            }
        }); 
    } 

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