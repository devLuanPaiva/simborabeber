import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: process.env.REGION_AWS!,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID_AWS!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS!,
    },
});