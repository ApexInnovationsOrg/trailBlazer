export function getMediaType(source) {
    // if(source == undefined)
    // {
    //     throw Error('Source is undefined');
    // }
    let extension = source.split(".")[source.split(".").length-1]
    let key = ""

    switch (extension) {
        case "png":
        case "jpg":
        case "bmp":
        default:
            key = "image"
            break

        case "mp4":
            key = "video"
            break
    }

    return {
        key,
        extension
    }
} 

