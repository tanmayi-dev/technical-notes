# Set Up an App Dev Environment on Google Cloud

- [Cloud Storage: Qwik Start - Cloud Console](#1)
- [Cloud Storage: Qwik Start - CLI/SDK](#2)
- [Cloud IAM: Qwik Start](#3)
- [Cloud Monitoring: Qwik Start](#4)
- [Cloud Run Functions: Qwik Start - Console](#5)
- [Cloud Run Functions: Qwik Start - Command Line](#6)
- [Pub/Sub: Qwik Start - Console](#7)
- [Pub/Sub: Qwik Start - Command Line](#8)
- [Pub/Sub: Qwik Start - Python](#9)
- [Set Up an App Dev Environment on Google Cloud: Challenge Lab](#10)

## Cloud Storage: Qwik Start - Cloud Console <a id="1"></a>

---


## Cloud Storage: Qwik Start - CLI/SDK <a id="2"></a>

### Task 1 : Create a bucket

```
gcloud storage buckets create gs://<YOUR-BUCKET-NAME>
```

### Task 2 : Upload an object into your bucket

1. Download image into your bucket
```
curl https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/800px-Ada_Lovelace_portrait.jpg --output ada.jpg
```

2. Use `gcloud storage cp` command to upload the image from location where you saved it to the backet you created
```
gcloud storage cp ada.jpg gs://YOUR-BUCKET-NAME
```

### Task 3 : Download an object from your bucket

### Task 4 : Copy an object to a folder in the bucket

### Task 5 : List contents of a bucket or folder

### Task 6 : List details for an object

### Task 7 : Make your object publicly accessible

### Task 8 : Remove public access

--
## Cloud IAM: Qwik Start <a id="3"></a>

--
## Cloud Monitoring: Qwik Start <a id="4"></a>

--
## Cloud Run Functions: Qwik Start - Console <a id="5"></a>

--
## Cloud Run Functions: Qwik Start - Command Line <a id="6"></a>

--
## Pub/Sub: Qwik Start - Console <a id="7"></a>

--
## Pub/Sub: Qwik Start - Command Line <a id="8"></a>

--
## Pub/Sub: Qwik Start - Python <a id="9"></a>

--
## Set Up an App Dev Environment on Google Cloud: Challenge Lab <a id="10"></a>

### Task 1 : Create a bucket

```bash

# 1. Set variables (Replace placeholders with your actual lab IDs)
export BUCKET_NAME=<Bucket Name>
export TOPIC_NAME=<Topic Name>
export FUNCTION_NAME=<Function Name>
export USERNAME2=<Username>
export REGION=<Region>

# 2. Enable necessary APIs
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com \
  eventarc.googleapis.com \
  run.googleapis.com \
  pubsub.googleapis.com

# 3. Create the Bucket and Pub/Sub Topic
gcloud storage buckets create gs://$BUCKET_NAME --location=$REGION
gcloud pubsub topics create $TOPIC_NAME

```

<!---
1. Go to Navigation menu > Cloud Storage > Buckets
2. Click **+ Create**
3. Enter your bucket information and click **Continue**
    a. Name your bucket (can use **Project ID** as bucket name)
    b. Choose **Region** for **Location Type** and <Location> for **Location**
    c. Choose **Standard** for **default storage class**
5. Leave the rest of the fields as their defualt values and click **Create**
-->

### Task 2 : Create a Pub/Sub topic
```bash
# 4. Get Project Number
PROJECT_NUMBER=$(gcloud projects describe $GOOGLE_CLOUD_PROJECT --format='value(projectNumber)')

# 5. Create Pub/Sub Identity and grant Token Creator role
gcloud beta services identity create --service=pubsub.googleapis.com

gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
    --member="serviceAccount:service-$PROJECT_NUMBER@gcp-sa-pubsub.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountTokenCreator"

# 6. Grant Eventarc Receiver role to the Compute service account
gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/eventarc.eventReceiver"

# 7. Grant Pub/Sub Publisher role to the Storage service account
STORAGE_SERVICE_ACCOUNT=$(gsutil kms serviceaccount -p $GOOGLE_CLOUD_PROJECT)
gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
    --member="serviceAccount:$STORAGE_SERVICE_ACCOUNT" \
    --role="roles/pubsub.publisher"

```

### Task 3 : Create the thumbnail Cloud Run Function
```bash
# 8. Create directory and files
mkdir memories-task && cd memories-task

# 9. Create index.js (Using Sharp library for thumbnails)
cat > index.js <<EOF
const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');
const sharp = require('sharp');

functions.cloudEvent('$FUNCTION_NAME', async cloudEvent => {
  const event = cloudEvent.data;
  const fileName = event.name;
  const bucketName = event.bucket;
  const bucket = new Storage().bucket(bucketName);
  const topicName = '$TOPIC_NAME';
  const pubsub = new PubSub();

  if (fileName.search("64x64_thumbnail") === -1) {
    const filename_split = fileName.split('.');
    const filename_ext = filename_split[filename_split.length - 1].toLowerCase();
    const filename_without_ext = fileName.substring(0, fileName.length - filename_ext.length - 1);

    if (filename_ext === 'png' || filename_ext === 'jpg' || filename_ext === 'jpeg') {
      const gcsObject = bucket.file(fileName);
      const newFilename = \`\${filename_without_ext}_64x64_thumbnail.\${filename_ext}\`;
      const gcsNewObject = bucket.file(newFilename);

      try {
        const [buffer] = await gcsObject.download();
        const resizedBuffer = await sharp(buffer)
          .resize(64, 64, { fit: 'inside', withoutEnlargement: true })
          .toFormat(filename_ext)
          .toBuffer();

        await gcsNewObject.save(resizedBuffer, {
          metadata: { contentType: \`image/\${filename_ext}\` },
        });

        await pubsub.topic(topicName).publishMessage({ data: Buffer.from(newFilename) });
        console.log(\`Success: \${fileName} → \${newFilename}\`);
      } catch (err) {
        console.error(\`Error: \${err}\`);
      }
    }
  }
});
EOF

# 10. Create package.json
cat > package.json <<EOF
{
  "name": "thumbnails",
  "version": "1.0.0",
  "dependencies": {
    "@google-cloud/functions-framework": "^3.0.0",
    "@google-cloud/pubsub": "^2.0.0",
    "@google-cloud/storage": "^6.11.0",
    "sharp": "^0.32.1"
  }
}
EOF

# 11. Deploy the Function
gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=nodejs22 \
  --region=$REGION \
  --source=. \
  --entry-point=$FUNCTION_NAME \
  --trigger-location=$REGION \
  --trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \
  --trigger-event-filters="bucket=$BUCKET_NAME" \
  --allow-unauthenticated

```

### Task 4 : Remove the previous cloud engineer
```bash
# 12. Upload a test image to trigger the function
curl -o map.jpg https://storage.googleapis.com/cloud-training/gsp315/map.jpg
gcloud storage cp map.jpg gs://$BUCKET_NAME/

# 13. Remove the Previous Cloud Engineer (Username 2)
gcloud projects remove-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
  --member="user:$USERNAME2" \
  --role="roles/viewer"
```



--
