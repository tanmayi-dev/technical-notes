# AWS AI Practitioner - Certification Notes

# AWS AI Practitioner (AIF-C01) — Cheat Sheet

---

## Exam Overview

| Detail | Info |
|--------|------|
| Exam code | AIF-C01 |
| Duration | 90 minutes |
| Questions | 65 (50 scored + 15 unscored) |
| Pass score | 700 / 1000 |
| Cost | $75 USD |
| Format | Multiple choice & multiple response |

### Domain Weightings

| # | Domain | Weight |
|---|--------|--------|
| 1 | Fundamentals of AI & ML | 20% |
| 2 | Fundamentals of Generative AI | 24% |
| 3 | Applications of Foundation Models | 28% |
| 4 | Guidelines for Responsible AI | 14% |
| 5 | Security, Compliance & Governance | 14% |

---

## Domain 1 — AI & ML Fundamentals (20%)

### Types of Machine Learning

| Type | How it works | Example use case |
|------|-------------|-----------------|
| **Supervised** | Learns from labelled data; maps inputs → outputs | Spam detection, fraud prediction |
| **Unsupervised** | Finds hidden patterns in unlabelled data | Customer segmentation, anomaly detection |
| **Reinforcement** | Agent learns by maximising reward signals | Game AI, robotics, recommendation tuning |
| **Semi-supervised** | Small labelled + large unlabelled dataset | Medical image classification |

### ML Pipeline Stages

```
Data collection → EDA → Preprocessing → Feature engineering
→ Model training → Hyperparameter tuning → Evaluation
→ Deployment → Monitoring
```

### Key ML Concepts

| Term | Definition |
|------|-----------|
| **Overfitting** | High train accuracy, low test accuracy — model memorised training data |
| **Underfitting** | Poor accuracy on both train and test — model is too simple |
| **Bias** | Systematic error from wrong assumptions |
| **Variance** | Sensitivity to small fluctuations in training data |
| **Regularisation** | Technique (L1/L2) to prevent overfitting |
| **Feature engineering** | Transforming raw data into useful model inputs |
| **Data augmentation** | Artificially expanding training data (e.g., image flips) |
| **Train/val/test split** | Typical 70 / 15 / 15 or 80 / 10 / 10 |

### Evaluation Metrics

| Metric | Used for | Notes |
|--------|----------|-------|
| **Accuracy** | Classification | % correct predictions |
| **Precision** | Classification | True positives / all predicted positives |
| **Recall** | Classification | True positives / all actual positives |
| **F1 Score** | Classification | Harmonic mean of precision & recall |
| **AUC-ROC** | Classification | Area under ROC curve; 1.0 = perfect |
| **RMSE** | Regression | Root mean square error; lower = better |
| **MAE** | Regression | Mean absolute error |

### Neural Network Basics

| Term | Meaning |
|------|---------|
| **Neuron / node** | Basic computational unit |
| **Layer** | Input → hidden → output layers |
| **Activation function** | ReLU, Sigmoid, Softmax — adds non-linearity |
| **Backpropagation** | Algorithm to update weights via gradient descent |
| **Epoch** | One full pass through the training dataset |
| **Batch size** | Number of samples per gradient update |
| **Learning rate** | Step size for weight updates |
| **CNN** | Convolutional Neural Net — best for image tasks |
| **RNN / LSTM** | Recurrent networks — best for sequences/time series |
| **Transformer** | Attention-based architecture — backbone of LLMs |

---

## Domain 2 — Fundamentals of Generative AI (24%)

### Core Concepts

| Term | Definition |
|------|-----------|
| **Generative AI** | AI that creates new content (text, image, audio, video, code) |
| **Foundation Model (FM)** | Large pre-trained model adaptable to many tasks |
| **Large Language Model (LLM)** | FM focused on understanding and generating text |
| **Transformer** | Architecture using self-attention; enables parallel training on massive corpora |
| **Token** | Basic unit of text (≈ ¾ of a word on average) |
| **Context window** | Max tokens a model can process in one call |
| **Embedding** | Numerical vector representation of text/image; similar content = similar vectors |
| **Diffusion model** | Generates images by progressively removing noise (used by Stable Diffusion) |
| **Multimodal model** | Accepts/produces multiple modalities: text, image, audio, video |
| **Hallucination** | Model generates confident but factually wrong output |

### Inference Parameters (Exam Favourite)

| Parameter | Effect | Exam tip |
|-----------|--------|----------|
| **Temperature** | Low (0–0.3) = deterministic; high (0.7–1.0) = creative | Customer service → low; creative writing → high |
| **Top-P** | Sample from top tokens summing to P probability | Controls diversity |
| **Top-K** | Only consider top K candidate tokens | Reduces repetition |
| **Max tokens** | Maximum length of generated output | Higher = more cost |

### Prompt Engineering Techniques

| Technique | Description | When to use |
|-----------|-------------|-------------|
| **Zero-shot** | No examples in prompt; relies on pre-training | Simple, general tasks |
| **Few-shot** | 2–5 input/output examples in prompt | Specific format or style needed |
| **Chain-of-thought (CoT)** | Ask model to "think step by step" | Complex reasoning problems |
| **RAG** | Retrieve docs → inject into prompt → answer | Reducing hallucinations; current data |
| **ReAct** | Reason + Act in loops with tool use | Agentic tasks |
| **System prompt** | Sets model persona, rules, and behaviour | All production deployments |

### RAG (Retrieval Augmented Generation)

```
User query → Embed query → Search vector DB → Retrieve top-K docs
→ Inject docs into prompt → LLM generates grounded answer
```

- **Why RAG?** Keeps answers grounded; no retraining required; supports dynamic/current data
- **AWS services:** Bedrock Knowledge Bases + OpenSearch / Aurora (stores embeddings)

### Model Customisation Options

| Method | Description | Use when |
|--------|-------------|----------|
| **Prompt engineering** | Modify input only | Quickest; no training cost |
| **RAG** | Add external knowledge at inference time | Dynamic data; no retraining |
| **Fine-tuning** | Train on your labelled data; creates private copy | Domain-specific style/format |
| **Continued pre-training** | Feed unlabelled domain text to Titan models | Domain-specific vocabulary |

---

## Domain 3 — Applications of Foundation Models (28%)

### Amazon Bedrock — Key Service for the Exam

**What it is:** Serverless API to access, customise, and deploy foundation models — no infra to manage.

**Key features:**

| Feature | What it does |
|---------|-------------|
| **Model access** | API calls to multiple FMs from different providers |
| **Knowledge bases** | Built-in RAG pipeline; connects S3 → embeddings → OpenSearch/Aurora |
| **Agents** | Multi-step reasoning; calls APIs/tools autonomously |
| **Fine-tuning** | Creates a private custom model on Bedrock infrastructure |
| **Guardrails** | Content filters, denied topics, PII detection, prompt injection protection |
| **Model Evaluation** | Automated and human evaluation of FM responses |

### Bedrock Foundation Models — Full Reference

#### Amazon Models

| Model | Type | Best for |
|-------|------|----------|
| **Titan Text Lite** | Text generation | Cheapest; summarisation, classification |
| **Titan Text Express** | Text generation | Balanced cost/quality |
| **Titan Text Premier** | Text generation | Highest quality Amazon text model |
| **Titan Embeddings v1/v2** | Embeddings | Semantic search, RAG vector store |
| **Titan Image Generator** | Image generation | Text-to-image, multimodal search |
| **Nova Micro** | Text | Fastest, cheapest Nova |
| **Nova Lite** | Text + Vision | Low latency multimodal |
| **Nova Pro** | Text + Vision + Video | Flagship multimodal model |
| **Nova Canvas** | Image generation | High-quality image gen |
| **Nova Reel** | Video generation | Text/image → video |

#### Anthropic Models (Claude family)

| Model | Strengths |
|-------|----------|
| **Claude Haiku** | Fastest, cheapest; simple tasks |
| **Claude Sonnet** | Balanced speed + quality; most used |
| **Claude Opus** | Most intelligent; complex reasoning, analysis |

> **Key facts:** Large context window, strong reasoning, multilingual, safety-first design

#### Meta Models (Llama family)

| Model | Strengths |
|-------|----------|
| **Llama 3 8B** | Lightweight; fast inference |
| **Llama 3 70B** | Strong general reasoning |
| **Llama 3.2 (Vision)** | Multimodal (image + text) |

> **Key facts:** Open source; flexible fine-tuning; strong code generation

#### Cohere Models

| Model | Strengths |
|-------|----------|
| **Command R** | Optimised for RAG pipelines |
| **Command R+** | Higher quality RAG + complex tasks |
| **Embed v3** | Best-in-class embeddings for semantic search |

> **Key facts:** Best choice when building enterprise RAG; native citation support

#### Stability AI Models

| Model | Strengths |
|-------|----------|
| **Stable Diffusion XL** | High-quality text-to-image |
| **Stable Diffusion 3.5** | State-of-the-art photorealistic image gen |

> **Use for:** Marketing assets, gaming visuals, advertising, creative content

#### AI21 Labs Models

| Model | Strengths |
|-------|----------|
| **Jurassic-2** | Multilingual; detailed content creation |
| **Jamba** | Hybrid attention + MoE; long documents |

> **Key facts:** Exceptional multilingual support; good for reports and documents

#### Mistral AI Models

| Model | Strengths |
|-------|----------|
| **Mistral 7B** | Efficient; cost-effective general text |
| **Mixtral 8x7B** | Mixture of Experts; strong reasoning at lower cost |

### Model Selection Guide (Exam Cheat)

| Use case | Best model choice |
|----------|-----------------|
| Complex reasoning & analysis | Claude Sonnet / Opus |
| RAG enterprise search | Cohere Command R+ |
| Text-to-image | Stable Diffusion or Titan Image Generator |
| Embeddings for vector search | Titan Embeddings or Cohere Embed |
| Open-source / fine-tunable | Llama 3 |
| Video generation | Nova Reel |
| Cheapest text generation | Titan Text Lite or Nova Micro |
| Multilingual content | AI21 Jurassic or Claude |

---

## AWS AI Services Reference

### Computer Vision

| Service | What it does | Key capabilities |
|---------|-------------|-----------------|
| **Amazon Rekognition** | Image & video analysis | Object/scene detection, face recognition, celebrity ID, content moderation, text in images, PPE detection |
| **Amazon Textract** | Extract text from documents | OCR, tables, forms, key-value pairs, IDs and passports, medical forms |

### Natural Language Processing (NLP)

| Service | What it does | Key capabilities |
|---------|-------------|-----------------|
| **Amazon Comprehend** | NLP — find meaning in text | Sentiment analysis, entity recognition, language detection, PII detection, topic modelling |
| **Amazon Translate** | Machine translation | 75+ languages, real-time + batch, custom terminology |
| **Amazon Transcribe** | Speech → text | Call analytics, medical transcription, speaker identification, custom vocabulary |
| **Amazon Polly** | Text → speech | Neural voices, SSML support, 20+ languages, lexicons |
| **Amazon Lex** | Build chatbots | Intents + slots, multi-channel (web/phone/Slack), same tech as Alexa |

### Search & Recommendations

| Service | What it does | Key use cases |
|---------|-------------|--------------|
| **Amazon Kendra** | Intelligent enterprise search | Semantic search over internal docs; FAQ extraction; connects S3, SharePoint, RDS |
| **Amazon Personalize** | Real-time recommendations | Product recommendations, content ranking, next-best-action |
| **Amazon Forecast** | Time-series forecasting | Demand forecasting, inventory planning, staffing; AutoML built-in |

### ML Platform

| Service | What it does | Key features |
|---------|-------------|-------------|
| **Amazon SageMaker** | Build, train, deploy ML models | Studio (IDE), Autopilot (AutoML), Ground Truth (data labelling), Clarify (bias), Model Monitor, JumpStart (pretrained models), Canvas (no-code ML) |

### Human-in-the-Loop & Other

| Service | What it does |
|---------|-------------|
| **Amazon A2I (Augmented AI)** | Human review for low-confidence ML predictions; integrates with Textract & Rekognition |
| **Amazon Fraud Detector** | Detect online fraud using ML; uses your historical data |
| **Amazon CodeWhisperer** | AI coding assistant (now part of Amazon Q Developer) |

### Generative AI Services

| Service | What it does |
|---------|-------------|
| **Amazon Bedrock** | Serverless access to foundation models; RAG, agents, fine-tuning, guardrails |
| **Amazon Q Business** | Enterprise GenAI chatbot connected to your company data |
| **Amazon Q Developer** | AI coding assistant (write, debug, explain, test code) |

---

## Domain 4 — Responsible AI (14%)

### Core Principles

| Principle | Definition | AWS Tool |
|-----------|-----------|----------|
| **Fairness** | No discrimination by race, gender, age, etc. | SageMaker Clarify |
| **Explainability** | Understand why a model made a decision | SageMaker Clarify (SHAP) |
| **Transparency** | Open about data, methods, and limitations | SageMaker Model Cards |
| **Privacy** | Protect PII; anonymise training data | Bedrock Guardrails, Macie |
| **Robustness** | Handle adversarial inputs and edge cases | Model Monitor |
| **Safety** | Prevent harmful outputs | Bedrock Guardrails, A2I |
| **Accountability** | Clear ownership of AI decisions | AWS Audit Manager |

### AWS Responsible AI Tools

| Tool | Purpose |
|------|---------|
| **SageMaker Clarify** | Detects bias in data & model; feature importance (SHAP); pre- and post-training analysis |
| **SageMaker Model Monitor** | Monitors deployed models for data drift, model drift, bias drift |
| **SageMaker Model Cards** | Documents model purpose, training data, evaluation, risk rating |
| **Bedrock Guardrails** | Content filters, denied topics, PII detection, prompt injection defence |
| **Amazon A2I** | Human review loop for low-confidence predictions |

### Types of Bias

| Type | Description |
|------|-------------|
| **Data bias** | Training data doesn't represent all groups fairly |
| **Algorithmic bias** | Model amplifies existing biases in data |
| **Confirmation bias** | Model only learns patterns that match existing beliefs |
| **Sampling bias** | Training sample not representative of real-world population |

---

## Domain 5 — Security, Compliance & Governance (14%)

### Security Tools

| Service | What it does |
|---------|-------------|
| **AWS IAM** | Identity & access management; least-privilege for AI services |
| **AWS KMS** | Encryption key management; encrypt training data & model artefacts |
| **Amazon Macie** | Discovers and protects PII in S3 using ML |
| **Amazon Inspector** | Automated vulnerability scanning for EC2, Lambda, containers |
| **AWS Shield** | DDoS protection |

### Audit & Compliance Tools

| Service | What it does |
|---------|-------------|
| **AWS CloudTrail** | Logs all API calls — audit who called which AI service and when |
| **AWS Config** | Tracks resource config changes; ensures governance rules are met |
| **AWS Audit Manager** | Continuously audits AWS usage against GDPR, HIPAA, SOC, etc. |
| **AWS Artifact** | On-demand AWS compliance reports (ISO, SOC, PCI-DSS) — document repo |

### Bedrock Security Features

| Feature | Protection |
|---------|-----------|
| **Private model copies** | Fine-tuned models stay in your account; not shared with AWS |
| **VPC support** | Keep Bedrock traffic within your private network |
| **Encryption** | Data encrypted in transit (TLS) and at rest (KMS) |
| **Guardrails** | Block prompt injections, PII exposure, harmful content |

---

## Commonly Confused Services (Exam Traps)

| Pair | Service A | Service B |
|------|-----------|-----------|
| **Transcribe vs Lex** | Speech → text (transcription only) | Speech → intent → chatbot action |
| **Comprehend vs Textract** | Analyse meaning in text (NLP) | Extract text from scanned documents (OCR) |
| **Kendra vs Personalize** | Search internal knowledge bases | Personalised product/content recommendations |
| **Bedrock vs SageMaker** | Use/customise pre-built FMs (GenAI) | Build & train custom ML models from scratch |
| **Fine-tuning vs RAG** | Retrain model with your data (permanent) | Inject context at query time (no retraining) |
| **Rekognition vs Textract** | Faces, objects, labels in images | Text, tables, forms in scanned documents |
| **Forecast vs Personalize** | Time-series prediction (demand, inventory) | Real-time individual recommendations |
| **Q Business vs Q Developer** | Enterprise chatbot on company data | AI coding assistant |

---

## Service → Use Case Quick Reference

| Use case | AWS Service |
|----------|------------|
| Build a chatbot / voice bot | Amazon Lex |
| Detect sentiment in reviews | Amazon Comprehend |
| Transcribe call centre audio | Amazon Transcribe |
| Translate documents | Amazon Translate |
| Read text aloud (TTS) | Amazon Polly |
| Extract data from scanned invoices | Amazon Textract |
| Detect faces / objects in images | Amazon Rekognition |
| Generate text/images with GenAI | Amazon Bedrock |
| Q&A over internal company docs | Amazon Kendra or Amazon Q Business |
| Personalised product recommendations | Amazon Personalize |
| Forecast inventory demand | Amazon Forecast |
| Detect payment fraud | Amazon Fraud Detector |
| Build & train a custom ML model | Amazon SageMaker |
| Detect bias in ML model | SageMaker Clarify |
| Monitor model after deployment | SageMaker Model Monitor |
| Human review of AI predictions | Amazon A2I |
| Code assistant / AI pair programming | Amazon Q Developer |
| Label training data | SageMaker Ground Truth |
| No-code ML model builder | SageMaker Canvas |
| Compliance reports & audit docs | AWS Artifact |
| Audit all API calls | AWS CloudTrail |
| Protect PII in S3 | Amazon Macie |

---

## Key Definitions Quick-Fire

| Term | One-line definition |
|------|-------------------|
| **Tokens** | Chunks of text a model processes; 1 token ≈ ¾ word |
| **Context window** | Max tokens model can hold in one session |
| **Hallucination** | Model generates plausible but incorrect output |
| **RAG** | Retrieve real docs → ground LLM responses in facts |
| **Embeddings** | Vectors representing meaning; used in semantic search |
| **Fine-tuning** | Additional training on task-specific labelled data |
| **Zero-shot** | Prompt with no examples |
| **Few-shot** | Prompt with 2–5 input/output examples |
| **Chain-of-thought** | Ask model to reason step by step |
| **Prompt injection** | Malicious text tries to hijack model behaviour |
| **Guardrails** | Bedrock feature to filter/block harmful model outputs |
| **Agents** | LLMs that plan, call tools, and complete multi-step tasks autonomously |
| **Temperature** | Controls output randomness (0 = deterministic, 1 = creative) |
| **Foundation model** | Large pre-trained model usable for many downstream tasks |
| **Overfitting** | Model memorised training data; fails on new data |
| **Data drift** | Input data distribution changes after deployment |
| **Model drift** | Model performance degrades over time |

---

*AWS AI Practitioner (AIF-C01) Cheat Sheet — All rights reserved to their respective AWS documentation sources.*