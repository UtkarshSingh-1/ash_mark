import { Storage } from '@google-cloud/storage'

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64!, 'base64').toString()
)

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials,
})

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!)

export { storage, bucket }

export async function uploadFile(file: File, folder: string = 'products') {
  const fileName = `${folder}/${Date.now()}-${file.name}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  
  const gcsFile = bucket.file(fileName)
  
  await gcsFile.save(fileBuffer, {
    metadata: {
      contentType: file.type,
    },
  })
  
  await gcsFile.makePublic()
  
  return `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${fileName}`
}
