import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

interface UploadToS3Params {
    buffer: Buffer;
    key: string;
    contentType: string;
}

export async function uploadToS3({ buffer, key, contentType }: UploadToS3Params) {
    if (!process.env.BUCKET_NAME_AWS || !process.env.REGION_AWS) {
        console.error("[uploadToS3] missing config", JSON.stringify({
            hasBucket: Boolean(process.env.BUCKET_NAME_AWS),
            hasRegion: Boolean(process.env.REGION_AWS),
        }, null, 2));
        throw new Error("S3 configuration missing");
    }

    const params = {
        Bucket: process.env.BUCKET_NAME_AWS,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    };

    console.log("[uploadToS3] sending PutObjectCommand", JSON.stringify({
        Bucket: params.Bucket,
        Key: params.Key,
        ContentType: params.ContentType,
        sizeBytes: buffer.byteLength,
    }, null, 2));

    await s3.send(new PutObjectCommand(params));

    const url = `https://${params.Bucket}.s3.${process.env.REGION_AWS}.amazonaws.com/${params.Key}`;

    console.log("[uploadToS3] upload succeeded", JSON.stringify({ url }, null, 2));

    return url;
}
