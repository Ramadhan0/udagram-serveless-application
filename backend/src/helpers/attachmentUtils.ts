import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const {
    ATTACHMENT_S3_BUCKET,
    SIGNED_URL_EXPIRATION
} = process.env

const s3_client = new XAWS.S3({ signatureVersion: 'v4' })

// TODO: Implement the fileStogare logic
export const AttachmentUtils = (todoId: string, userId: string) => {
    return s3_client.getSignedUrl('putObject', {
        Bucket: ATTACHMENT_S3_BUCKET,
        Key: [todoId, userId],
        Expires: SIGNED_URL_EXPIRATION
    })
}
