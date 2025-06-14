import {
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;
    private readonly cloudFrontUrl: string;

    constructor() {
        this.bucketName = process.env.AWS_BUCKET;
        this.cloudFrontUrl = process.env.AWS_CLOUDFRONT_URL;

        this.s3Client = new S3Client({
            region: process.env.AWS_BUCKET_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    async getUploadUrl({
        key,
        contentType,
    }: {
        key: string;
        contentType?: string;
    }) {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                ContentType: contentType,
            });

            return getSignedUrl(this.s3Client, command, { expiresIn:  60 * 60 * 2});
        } catch (error) {
            throw error; // TODO: create custom error for s3
        }
    }

    async getFileUrl({ key }: { key: string }) {
        try {
            return `${this.cloudFrontUrl}/${key}`;
        } catch (error) {
            throw error; // TODO: create custom error for s3
        }
    }

}