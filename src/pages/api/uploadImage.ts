// @ts-nocheck
import { getImage } from "../../utils/formidable";
import { uploadImage } from "../../utils/cloudinary";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handle(req, res) {
    const imageUploaded = await getImage(req);

    const imageData = await uploadImage(imageUploaded.path);

    const imageURL = "https://res.cloudinary.com/dx3a3nnee/v" + imageData.version + "/" + imageData.public_id + "." + imageData.format;

    res.json(imageURL);
}