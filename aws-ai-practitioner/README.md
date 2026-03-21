# AWS AI Practitioner (AIF-C01) — Cheat Sheet v2

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

## AWS Infrastructure Basics (Exam Gotcha)

- **Region** — physical location where AWS clusters data centers (e.g., us-east-1)
- **Availability Zone (AZ)** — one or more discrete data centers with redundant power, networking, and connectivity
- **Each AWS Region has a minimum of 3 AZs** — isolated and physically separate
- **AZs are connected** via high-bandwidth, low-latency, redundant metro fiber
- AZs have independent power, cooling, and physical security

> **Exam tip:** AZs ≠ data centers (one AZ can have multiple data centers). Regions ≠ AZs.

---

## Domain 1 — AI & ML Fundamentals (20%)

### Types of Machine Learning

| Type | How it works | Example use case |
|------|-------------|-----------------|
| **Supervised** | Learns from labelled data; maps inputs → outputs | Spam detection, fraud prediction |
| **Unsupervised** | Finds hidden patterns in unlabelled data | Customer segmentation, anomaly detection |
| **Reinforcement** | Agent learns by maximising reward signals | Game AI, robotics, recommendation tuning |
| **Semi-supervised** | Small labelled + large unlabelled dataset | Medical image classification |

### Supervised Learning Algorithms

| Algorithm | Type | How it works | Use case |
|-----------|------|-------------|----------|
| **Linear Regression** | Regression | Fits a line to predict continuous output | House price prediction, sales forecasting |
| **Logistic Regression** | Classification | Predicts probability of a class using sigmoid | Spam detection, disease diagnosis |
| **Decision Tree** | Both | Splits data on feature conditions into a tree | Loan approval, customer churn |
| **Random Forest** | Both | Ensemble of many decision trees; majority vote | Fraud detection, feature selection |
| **Support Vector Machine (SVM)** | Classification | Finds hyperplane that best separates classes | Image classification, text categorisation |
| **Neural Networks** | Both | Layers of nodes; learns complex non-linear patterns | Image recognition, NLP, GenAI |
| **Gradient Boosting (XGBoost)** | Both | Builds trees sequentially; each corrects the last | Tabular data competitions, ranking |

### Unsupervised Learning Algorithms

| Algorithm | How it works | Use case |
|-----------|-------------|----------|
| **K-Means Clustering** | Groups data into K clusters by proximity | Customer segmentation, anomaly detection |
| **PCA** | Reduces dimensions while preserving variance | Feature reduction, visualisation |
| **Autoencoders** | Encoder compresses → decoder reconstructs | Anomaly detection, denoising |
| **DBSCAN** | Clusters based on density; handles noise | Geographic clustering, outlier detection |

### ML Pipeline Stages

```
Data collection → EDA → Preprocessing → Feature engineering
→ Model training → Hyperparameter tuning → Evaluation
→ Deployment → Monitoring
```

### Data Preparation & EDA

| Step | What it involves |
|------|----------------|
| **EDA (Exploratory Data Analysis)** | Understand distributions, outliers, correlations; use histograms, box plots, heatmaps |
| **Data cleaning** | Handle missing values (impute/drop), fix inconsistencies, remove duplicates |
| **Feature engineering** | Create new features from raw data; encode categoricals; normalise/standardise |
| **Data augmentation** | Artificially expand training data — flip/rotate images, synonym replacement in text |
| **Train/val/test split** | Typical 70 / 15 / 15 or 80 / 10 / 10; prevents data leakage |
| **Normalisation** | Scale features to [0,1] range |
| **Standardisation** | Scale features to mean=0, std=1 (Z-score) |

### Key ML Concepts

| Term | Definition |
|------|-----------|
| **Overfitting** | High train accuracy, low test accuracy — model memorised training data |
| **Underfitting** | Poor accuracy on both train and test — model is too simple |
| **Bias** | Systematic error from wrong assumptions |
| **Variance** | Sensitivity to small fluctuations in training data |
| **Regularisation** | Technique to prevent overfitting by penalising complexity |
| **Feature engineering** | Transforming raw data into useful model inputs |
| **Data augmentation** | Artificially expanding training data (e.g., image flips) |
| **Train/val/test split** | Typical 70 / 15 / 15 or 80 / 10 / 10 |

### Regularisation Deep Dive

| Technique | How it works | Use when |
|-----------|-------------|----------|
| **L1 (Lasso)** | Adds sum of absolute weights to loss; can zero out features | Feature selection; sparse models |
| **L2 (Ridge)** | Adds sum of squared weights to loss; shrinks all weights | General overfitting prevention |
| **Dropout** | Randomly deactivates neurons during training (e.g., 20–50%) | Neural networks; prevents co-adaptation |
| **Early stopping** | Stop training when validation loss stops improving | Any model; saves compute |

> **Exam tip:** If model is overfitting → increase regularisation. If underfitting → decrease regularisation (or get more data/complex model).

### Hyperparameters vs Parameters

| | Hyperparameters | Parameters |
|--|----------------|-----------|
| **Set by** | You, before training | Model, learned during training |
| **Examples** | Learning rate, batch size, epochs, dropout rate, number of layers, regularisation strength | Weights, biases in a neural network |
| **Purpose** | Control the training process | Define model behaviour on input |
| **Tuning** | Grid search, random search, Bayesian optimisation | Gradient descent (automatic) |

> **Exam tip:** Hyperparameters and parameters are NOT part of prompting technique. Prompt components are: Instructions, Context, Input data, Output Indicator.

### Learning Rate & Training Parameters

| Parameter | Effect | Exam tip |
|-----------|--------|----------|
| **Learning rate (high)** | Trains fast; may overshoot optimal, diverge | Too high = model never converges |
| **Learning rate (low)** | Slow training; very precise | Too low = stuck in local minima |
| **Batch size** | Number of samples per gradient update | Smaller = more noise but generalises better |
| **Epochs** | How many times model sees entire dataset | Too many = overfitting; too few = underfitting |
| **Dropout rate** | % of neurons randomly disabled per step | Typical range: 20–50% |

### Evaluation Metrics (Full Forms + Meanings)

| Metric | Full form | Formula / Meaning | Exam tip |
|--------|-----------|-------------------|----------|
| **RMSE** | Root Mean Square Error | √(mean of squared errors) — penalises large errors heavily | Lower = better; regression |
| **MAE** | Mean Absolute Error | Mean of absolute differences — easy to interpret | Lower = better; regression |
| **Accuracy** | — | (TP + TN) / Total | Use when classes are balanced |
| **Precision** | — | TP / (TP + FP) | Use when false positives are costly |
| **Recall** | — | TP / (TP + FN) | Use when false negatives are costly (e.g., cancer detection) |
| **F1 Score** | — | 2 × (Precision × Recall) / (Precision + Recall) | Use when imbalanced classes |
| **AUC-ROC** | Area Under Curve — Receiver Operating Characteristic | 1.0 = perfect; 0.5 = random | Classifier comparison |
| **BLEU** | Bilingual Evaluation Understudy | Measures overlap of generated text vs reference text | NLP / translation quality |
| **ROUGE** | Recall-Oriented Understudy for Gisting Evaluation | Measures recall of n-grams vs reference text | Summarisation quality |
| **BERT Score** | Bidirectional Encoder Representations from Transformers | Uses embeddings to compare semantic similarity | NLP generation quality |
| **Perplexity** | — | How well model predicts a sample; lower = better | Language model evaluation |

### Confusion Matrix

```
                    Predicted Positive    Predicted Negative
Actual Positive         TP (True Pos)       FN (False Neg)   ← Miss
Actual Negative         FP (False Pos)      TN (True Neg)
                           ↑ False Alarm
```

- **TP** — correctly predicted positive
- **TN** — correctly predicted negative
- **FP** — predicted positive but actually negative (Type I error)
- **FN** — predicted negative but actually positive (Type II error)

### Correlation Matrix

- Table showing correlation coefficients between every pair of features
- Values range from **-1** (perfect negative) to **+1** (perfect positive); 0 = no correlation
- Used in EDA to detect multicollinearity and find predictive features
- High correlation between two input features → consider dropping one

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

## Model Architectures — Deep Dive

### Transformer Models

- **What:** Architecture using self-attention to process all tokens in parallel (not sequentially like RNN)
- **How it works:** Attention mechanism weighs importance of every word relative to every other word
- **Key components:** Encoder (understand input), Decoder (generate output), Attention heads
- **Why important:** Foundation of all modern LLMs (GPT, Claude, BERT, etc.)
- **Use cases:** Text generation, translation, summarisation, Q&A, code generation

| Variant | Direction | Used for |
|---------|-----------|----------|
| **Encoder-only (BERT)** | Bidirectional | Text classification, NER, sentiment |
| **Decoder-only (GPT, Claude)** | Left-to-right | Text generation, completion |
| **Encoder-Decoder (T5, BART)** | Both | Translation, summarisation |

### BERT (Bidirectional Encoder Representations from Transformers)

- Reads text in both directions simultaneously (bidirectional)
- Pre-trained on masked language modelling and next sentence prediction
- **Use cases:** Sentiment analysis, named entity recognition, question answering, search
- Not generative — used for understanding, not generation
- **Example:** Google Search uses BERT to understand query intent

### GANs (Generative Adversarial Networks)

- **What:** Two networks trained together — Generator vs Discriminator
- **Generator:** Creates fake data (images, text) trying to fool the discriminator
- **Discriminator:** Tries to tell real from fake
- **Training:** Both compete until generator produces realistic outputs
- **Use cases:** Image generation, deepfakes, data augmentation, style transfer
- **Limitation:** Training is unstable; mode collapse can occur

### VAEs (Variational Autoencoders)

- **What:** Encoder compresses input to a latent space distribution; decoder reconstructs from samples
- **How:** Learns mean & variance of latent space → sample → decode
- **Vs regular autoencoder:** Regular = fixed point; VAE = probability distribution → smoother generation
- **Use cases:** Image generation, anomaly detection, drug discovery, data generation
- **Advantage over GANs:** More stable training; continuous latent space

### Diffusion Models

- **What:** Learn to generate data by reversing a noise-addition process
- **Forward pass:** Gradually add Gaussian noise to real data over many steps
- **Reverse pass (generation):** Learn to denoise step by step → produces new realistic data
- **Use cases:** Image generation (Stable Diffusion, DALL·E 3), audio generation, video generation
- **Why they won:** Higher quality and more diverse outputs than GANs for images

| Model type | How it generates | Best known for |
|------------|-----------------|----------------|
| **GAN** | Generator vs discriminator competition | Fast generation, faces |
| **VAE** | Sample from latent distribution | Smooth interpolation, anomaly detection |
| **Diffusion** | Iterative denoising | Highest quality images (Stable Diffusion) |
| **Transformer** | Predict next token autoregressively | Text generation (Claude, GPT) |
| **CNN** | Convolutions over spatial features | Image classification (not generative) |
| **LSTM/RNN** | Sequential hidden state | Time series, older NLP |
| **ARIMA** | Statistical time-series formula | Simple forecasting; no ML training needed |

---

## Domain 2 — Fundamentals of Generative AI (24%)

### Core Concepts

| Term | Definition |
|------|-----------|
| **Generative AI** | AI that creates new content (text, image, audio, video, code) based on patterns in training data |
| **Foundation Model (FM)** | Large pre-trained model adaptable to many tasks |
| **Large Language Model (LLM)** | FM focused on understanding and generating text |
| **Transformer** | Architecture using self-attention; enables parallel training on massive corpora |
| **Token** | Basic unit of text that a model processes; 1 token ≈ ¾ of a word on average |
| **Context window** | Max number of tokens a model can consider at once — measured in tokens, NOT characters |
| **Embedding** | Numerical vector representation of text/image; similar content = similar vectors |
| **Vector** | List of numbers representing meaning; stored in a vector database for similarity search |
| **Diffusion model** | Generates images by progressively removing noise (Stable Diffusion) |
| **Multimodal model** | Accepts/produces multiple modalities: text, image, audio, video |
| **Hallucination** | Model generates confident but factually wrong output |

> **Exam gotcha — Context window:** The context window defines how much text a model can process at once, measured in **tokens** not characters. Tokens ≠ characters ≠ words. Embeddings are about meaning, not capacity.

### Tokens, Embeddings, Vectors — Distinctions

| Concept | Definition | Used for |
|---------|-----------|----------|
| **Token** | Unit of text the model processes (≈ ¾ word) | Input/output cost measurement |
| **Embedding** | Dense vector that encodes semantic meaning of text | Semantic search, RAG, similarity |
| **Vector** | The numerical array that an embedding produces | Stored in vector DB; compared via cosine similarity |
| **Context window** | Total tokens model can hold in memory at once | Determines max prompt + response length |

> **Cost tip:** Bedrock charges per token in input + output. Reduce input tokens → reduce cost. Temperature and Top-P have no effect on cost.

### Prompt Components (Exam Favourite)

A good prompt has 4 parts:

| Component | What it is |
|-----------|-----------|
| **Instructions** | The task — what the model should do |
| **Context** | External information to guide the model |
| **Input data** | The specific input you want a response for |
| **Output Indicator** | Desired output type or format |

> **Wrong answers on exam:** Hyperparameters and Parameters are NOT prompt components.

### Prompt Engineering Best Practices

- **Unambiguous prompts** — clearly define desired response; avoid vague language
- **Adequate context** — include output requirements and format constraints
- **Balance targeted info and desired output** — not too simple, not too complex
- **Experiment and refine** — iterative process; test and adjust

### Prompt Engineering Techniques

| Technique | Description | When to use |
|-----------|-------------|-------------|
| **Zero-shot** | No examples in prompt; relies on pre-training | Simple, general tasks |
| **Few-shot** | 2–5 input/output examples in prompt | Specific format or style needed |
| **Chain-of-thought (CoT)** | Ask model to "think step by step" | Complex reasoning problems |
| **RAG** | Retrieve docs → inject into prompt → answer | Reducing hallucinations; current data |
| **ReAct** | Reason + Act in loops with tool use | Agentic tasks |
| **System prompt** | Sets model persona, rules, and behaviour | All production deployments |

### Inference Parameters (Exam Favourite)

| Parameter | Effect | Exam tip |
|-----------|--------|----------|
| **Temperature** | Low (0–0.3) = deterministic; high (0.7–1.0) = creative | Customer service → low; creative writing → high |
| **Top-P** | Sample from top tokens summing to P probability | Controls diversity; does NOT affect cost |
| **Top-K** | Only consider top K candidate tokens | Reduces repetition |
| **Max tokens** | Maximum length of generated output | Higher = more cost |

> **Cost reduction:** Reduce number of input tokens → lower cost. Changing temperature/Top-P/Top-K does NOT reduce cost.

### Types of Model Inference

| Type | Description | Cost | Use when |
|------|-------------|------|----------|
| **On-demand** | Pay per token; no commitment | Higher per token | Variable/unpredictable traffic |
| **Provisioned Throughput** | Reserve model capacity; pay per hour | Lower per token at scale | Consistent high-volume workloads; required for custom/fine-tuned models |
| **Batch inference** | Process large datasets offline asynchronously | Cheapest | Non-real-time bulk processing |

> **Exam tip:** Custom/fine-tuned models on Bedrock REQUIRE Provisioned Throughput — cannot be used with on-demand.

### RAG (Retrieval Augmented Generation)

```
User query → Embed query → Search vector DB → Retrieve top-K docs
→ Inject docs into prompt → LLM generates grounded answer
```

- **Why RAG?** Keeps answers grounded; no retraining required; supports dynamic/current data
- **Default vector DB for Bedrock Knowledge Bases:** Amazon OpenSearch Serverless
- **Also supported:** Pinecone, Redis Enterprise Cloud, Aurora (pgvector), MongoDB
- **AWS services:** S3 (source docs) → Bedrock Knowledge Bases → OpenSearch Serverless (embeddings)

### Model Customisation Options

| Method | Data type | Permanence | Use when |
|--------|-----------|-----------|----------|
| **Prompt engineering** | None | None | Quickest; no training cost |
| **RAG** | Unlabelled docs | At inference time | Dynamic data; no retraining |
| **Fine-tuning** | **Labelled** data | Creates private copy | Domain-specific style/format/task |
| **Continued pre-training** | **Unlabelled** data | Updates model weights | Domain-specific vocabulary/knowledge |

> **Key distinction:** Fine-tuning = labelled data. Continued pre-training = unlabelled data.

### Transfer Learning & Adaptation Techniques

| Technique | Description | Use when |
|-----------|-------------|----------|
| **Transfer learning** | Take a pre-trained model; apply to a new related task | Limited labelled data for new task |
| **Fine-tuning** | Further train pre-trained model on labelled task-specific data | Adapt style/format/domain |
| **Domain adaptation** | Fine-tune on domain-specific unlabelled text | Technical jargon; medical, legal, finance |
| **Continued pre-training** | Feed new unlabelled data to extend model knowledge | Update knowledge without full retraining |
| **Incremental learning** | Model learns from new data over time without forgetting old | Streaming data; evolving datasets |
| **Self-supervised learning** | Model generates its own labels from unlabelled data | Foundational pre-training of LLMs |

---

## Domain 3 — Applications of Foundation Models (28%)

### Amazon Bedrock — Key Service for the Exam

**What it is:** Serverless API to access, customise, and deploy foundation models — no infra to manage.
**You can pick the FM.** Amazon Q does not let you pick the FM.

| Feature | What it does |
|---------|-------------|
| **Model access** | API calls to multiple FMs from different providers |
| **Knowledge bases** | Built-in RAG pipeline; S3 → embeddings → OpenSearch Serverless (default) |
| **Agents** | Multi-step reasoning; calls APIs/tools autonomously |
| **Fine-tuning** | Creates a private custom model; requires Provisioned Throughput to use |
| **Guardrails** | Content filters, denied topics, PII detection, prompt injection protection, watermarking |
| **Model Evaluation** | Automated and human evaluation of FM responses |

### Bedrock Custom Models — How it works

**Step 1 — Customize a model:**
- **Fine-tuning:** Use labelled data; improve accuracy for specific tasks; smaller dataset, less training time
- **Continued Pre-training:** Use unlabelled data; updates some parameters; retains prior learning and adds new knowledge; more efficient than full retraining

**Step 2 — Purchase Provisioned Throughput:**
- Required to load and use custom models in playground or production
- Cannot use on-demand pricing for custom models

### Amazon Q — Key Distinctions

| | Amazon Bedrock | Amazon Q |
|--|---------------|---------|
| **FM selection** | You pick the FM | No FM selection — managed by AWS |
| **Customisation** | Full (fine-tune, RAG, prompts) | Limited to connecting data sources |
| **Use case** | Developers building GenAI apps | Business users / end-user chatbot |
| **Variants** | Single service | Q Business, Q Developer |

### OpenSearch for RAG (Exam Favourite)

- **Amazon OpenSearch Service** — supports full-text search, vector search, indexing, similarity scoring
- **Best vector DB for RAG** — fast index lookups and similarity scoring for document retrieval
- **Default for Bedrock Knowledge Bases** — OpenSearch Serverless vector store
- DynamoDB, DocumentDB, Aurora are NOT optimised for similarity search / RAG

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

> Large context window, strong reasoning, multilingual, safety-first design

#### Meta Models (Llama family)

| Model | Strengths |
|-------|----------|
| **Llama 3 8B** | Lightweight; fast inference |
| **Llama 3 70B** | Strong general reasoning |
| **Llama 3.2 (Vision)** | Multimodal (image + text) |

> Open source; flexible fine-tuning; strong code generation

#### Cohere Models

| Model | Strengths |
|-------|----------|
| **Command R** | Optimised for RAG pipelines |
| **Command R+** | Higher quality RAG + complex tasks |
| **Embed v3** | Best-in-class embeddings for semantic search |

#### Stability AI Models

| Model | Strengths |
|-------|----------|
| **Stable Diffusion XL** | High-quality text-to-image |
| **Stable Diffusion 3.5** | State-of-the-art photorealistic image gen |

#### AI21 Labs & Mistral

| Model | Vendor | Strengths |
|-------|--------|----------|
| **Jurassic-2 / Jamba** | AI21 Labs | Multilingual; long documents |
| **Mistral 7B** | Mistral | Cost-effective general text |
| **Mixtral 8x7B** | Mistral | Mixture of Experts; strong reasoning |

### Model Selection Guide

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
| **Amazon Transcribe** | Speech → text | Call analytics, medical transcription, speaker identification, toxic audio detection |
| **Amazon Polly** | Text → speech | Neural voices, SSML support, 20+ languages; use for accessibility, IVR, e-learning |
| **Amazon Lex** | Build chatbots | Intents + slots, multi-channel (web/phone/Slack), same tech as Alexa; design conversational FAQ bots |

### Amazon Polly — Key Details

- Converts text to lifelike speech
- Supports **Neural TTS** (more natural) and **Standard TTS**
- Use **SSML** (Speech Synthesis Markup Language) to control pronunciation, pauses, emphasis
- Use cases: accessibility features, IVR phone systems, e-learning narration, news articles read aloud

### Search & Recommendations

| Service | What it does | Key use cases |
|---------|-------------|--------------|
| **Amazon Kendra** | Intelligent enterprise search | Semantic search over internal docs; FAQ extraction; connects S3, SharePoint, RDS |
| **Amazon Personalize** | Real-time recommendations | Product recs tailored to user profile, behaviour, preferences, and history |
| **Amazon Forecast** | Time-series forecasting | Retail demand planning, supply chain, resource planning (staffing, energy, server capacity) |

> **Exam tip — Forecast use cases:** Predict product demand, vary inventory and pricing across locations; predict staffing, energy, AWS usage, IoT sensor levels.

### ML Platform — SageMaker Deep Dive

| SageMaker Feature | What it does |
|------------------|-------------|
| **Studio** | Web-based IDE for ML development |
| **Autopilot** | AutoML — automatically trains & tunes models; picks best algorithm |
| **Ground Truth** | Data labelling with human labellers + active learning |
| **JumpStart** | Pre-trained models and solution templates; one-click deploy |
| **Clarify** | Detects bias in data & predictions; feature importance via SHAP; Shapley values & PDPs |
| **Model Monitor** | Monitors live models for data drift, model drift, bias drift, explainability |
| **Model Dashboard** | Central view of all deployed models and their monitoring status |
| **Canvas** | No-code ML — business users build models without writing code |
| **Feature Store** | Centralised repository to store, share, and reuse ML features |
| **Data Wrangler** | Visual data preparation — clean, transform, and analyse data without code |
| **Pipelines** | Build and automate end-to-end ML workflows (CI/CD for ML) |
| **Experiments** | Track and compare training runs, parameters, metrics |

### SageMaker Clarify — Explainability Tools

| Tool | What it does |
|------|-------------|
| **Shapley values (SHAP)** | Assigns each feature a contribution score to the model's prediction; based on game theory; positive = pushed prediction up, negative = pushed down |
| **Partial Dependence Plots (PDP)** | Shows how changing one feature affects the model's output while holding others constant; reveals linear vs non-linear relationships |

> **Interpretability:** Linear regression is naturally interpretable (you can read coefficients). Neural networks are black boxes — need tools like SHAP/PDP to explain them.

### Other Key Services

| Service | What it does |
|---------|-------------|
| **Amazon A2I (Augmented AI)** | Human review for low-confidence ML predictions; integrates with Textract & Rekognition |
| **Amazon Fraud Detector** | Detect online fraud using ML; uses your historical data |
| **Amazon DeepRacer** | Reinforcement learning racing car simulation; learn RL by training an autonomous car |
| **Amazon Q Developer** | AI coding assistant (write, debug, explain, test code); formerly CodeWhisperer |
| **Amazon Q Business** | Enterprise GenAI chatbot; connects to company data; does NOT allow FM selection |

### Generative AI Services

| Service | What it does |
|---------|-------------|
| **Amazon Bedrock** | Serverless access to foundation models; RAG, agents, fine-tuning, guardrails; YOU choose the FM |
| **Amazon Q Business** | Enterprise GenAI chatbot connected to your company data; AWS manages the FM |
| **Amazon Q Developer** | AI coding assistant (write, debug, explain, test code) |

---

## Domain 4 — Responsible AI (14%)

### Core Principles

| Principle | Definition | AWS Tool |
|-----------|-----------|----------|
| **Fairness** | No discrimination by race, gender, age, etc. | SageMaker Clarify |
| **Explainability** | Understand why a model made a decision | SageMaker Clarify (SHAP, PDP) |
| **Transparency** | Open about data, methods, and limitations | SageMaker Model Cards |
| **Privacy** | Protect PII; anonymise training data | Bedrock Guardrails, Macie |
| **Robustness** | Handle adversarial inputs and edge cases | Model Monitor |
| **Safety** | Prevent harmful outputs | Bedrock Guardrails, A2I |
| **Accountability** | Clear ownership of AI decisions | AWS Audit Manager |

### AWS Responsible AI Tools

| Tool | Purpose |
|------|---------|
| **SageMaker Clarify** | Detects bias; feature importance via SHAP & PDPs; pre- and post-training analysis |
| **SageMaker Model Monitor** | Monitors deployed models for data drift, model drift, bias drift |
| **SageMaker Model Dashboard** | Central monitoring view of all models and their health metrics |
| **SageMaker Model Cards** | Documents model purpose, training data, evaluation results, risk rating |
| **Bedrock Guardrails** | Content filters, denied topics, PII detection, prompt injection defence, watermarking |
| **Amazon A2I** | Human review loop for low-confidence predictions |

### Model Explainability

| Method | Description | Works best for |
|--------|-------------|----------------|
| **SHAP / Shapley values** | Feature contribution scores per prediction; model-agnostic | Any model; deployed via SageMaker Clarify |
| **Partial Dependence Plots (PDP)** | Shows relationship between one feature and output | Understanding non-linear relationships |
| **LIME** | Local approximation around one prediction | Explaining individual predictions |
| **Linear regression coefficients** | Directly readable weights = inherent interpretability | Linear models only |

> **Exam tip:** Linear regression is interpretable by design. Decision trees are semi-interpretable. Neural networks require post-hoc tools (SHAP, PDP).

### Watermarking in AI

- **What:** Embedding an invisible signal into AI-generated content (images, text, audio)
- **Why:** Detect AI-generated content; prevent misuse; maintain trust
- **Bedrock Guardrails** supports watermarking for images generated by Bedrock models
- Relevant to responsible AI / content provenance

### Types of Bias

| Type | Description |
|------|-------------|
| **Data bias** | Training data doesn't represent all groups fairly |
| **Algorithmic bias** | Model amplifies existing biases in data |
| **Confirmation bias** | Model only learns patterns that match existing beliefs |
| **Sampling bias** | Training sample not representative of real-world population |

> **Regularisation and bias:** Increasing regularisation reduces overfitting. Do NOT increase regularisation if a model is already underfitting — it will make performance worse.

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

### Audit, Monitoring & Compliance Tools

| Service | What it does |
|---------|-------------|
| **AWS CloudTrail** | Logs ALL API calls — who called which AI service, when, from where |
| **AWS Config** | Tracks resource configuration changes; rules to flag non-compliant resources |
| **Amazon EventBridge** | Event bus — trigger actions in response to events (e.g., model drift alert → SNS notification) |
| **AWS Audit Manager** | Continuously audits AWS usage against GDPR, HIPAA, SOC, PCI-DSS, etc. |
| **AWS Artifact** | On-demand AWS compliance reports (ISO, SOC, PCI-DSS) — document repository |
| **Amazon GuardDuty** | Threat detection — monitors for malicious activity using ML |

### CloudTrail vs Config vs EventBridge

| Service | When to use |
|---------|------------|
| **CloudTrail** | Who made what API call and when? (audit trail) |
| **Config** | Is my resource configuration compliant with a rule? (compliance state) |
| **EventBridge** | React to events in real time — trigger Lambda, SNS, Step Functions |

### Bedrock Security Features

| Feature | Protection |
|---------|-----------|
| **Private model copies** | Fine-tuned models stay in your account; not shared with AWS |
| **VPC support** | Keep Bedrock traffic within your private network |
| **Encryption** | Data encrypted in transit (TLS) and at rest (KMS) |
| **Guardrails** | Block prompt injections, PII exposure, harmful content, watermark images |

---

## AutoML — SageMaker Autopilot

- **What:** Automatically trains and tunes ML models with minimal configuration
- Explores multiple algorithms and hyperparameter combinations
- Produces a leaderboard of models ranked by performance
- Provides full visibility into the code it generated (unlike black-box AutoML tools)
- **Use when:** You don't know which algorithm to use or want to benchmark quickly
- **Output:** Best model + explainability report

---

## Service → Use Case Quick Reference (Expanded)

| Use case | AWS Service |
|----------|------------|
| Build a chatbot / voice bot | Amazon Lex |
| Design FAQ bot for HR / tech support | Amazon Lex |
| Detect sentiment in customer reviews | Amazon Comprehend |
| Detect and categorise toxic audio | Amazon Transcribe |
| Transcribe call centre audio | Amazon Transcribe |
| Translate documents (75+ languages) | Amazon Translate |
| Read text aloud (TTS) | Amazon Polly |
| Extract data from scanned invoices | Amazon Textract |
| Detect faces / objects in images | Amazon Rekognition |
| Content moderation in images/video | Amazon Rekognition |
| Generate text/images with GenAI | Amazon Bedrock |
| Q&A over internal company docs | Amazon Kendra or Amazon Q Business |
| Personalised product recs (user profile) | Amazon Personalize |
| Forecast inventory demand across locations | Amazon Forecast |
| Forecast staffing, energy, server capacity | Amazon Forecast |
| Detect payment fraud | Amazon Fraud Detector |
| Build & train a custom ML model | Amazon SageMaker |
| AutoML — auto pick algorithm & tune | SageMaker Autopilot |
| Detect bias in ML model | SageMaker Clarify |
| Explain model predictions (SHAP) | SageMaker Clarify |
| Monitor model after deployment | SageMaker Model Monitor |
| View all models in one dashboard | SageMaker Model Dashboard |
| Human review of AI predictions | Amazon A2I |
| Label training data (human workforce) | SageMaker Ground Truth |
| No-code ML model builder | SageMaker Canvas |
| Prepare and transform data visually | SageMaker Data Wrangler |
| Store and reuse ML features | SageMaker Feature Store |
| Use pre-trained models instantly | SageMaker JumpStart |
| Code assistant / AI pair programming | Amazon Q Developer |
| Enterprise GenAI chatbot (no FM choice) | Amazon Q Business |
| Learn reinforcement learning hands-on | Amazon DeepRacer |
| Compliance reports & audit docs | AWS Artifact |
| Audit all API calls | AWS CloudTrail |
| Check resource compliance | AWS Config |
| React to events in real time | Amazon EventBridge |
| Protect PII in S3 | Amazon Macie |
| Vector search / similarity scoring | Amazon OpenSearch Service |
| Default vector DB for Bedrock KB | Amazon OpenSearch Serverless |

---

## Commonly Confused Services (Exam Traps)

| Pair | Service A | Service B |
|------|-----------|-----------|
| **Transcribe vs Lex** | Speech → text (transcription only) | Speech → intent → chatbot action |
| **Comprehend vs Textract** | Analyse meaning in text (NLP) | Extract text from scanned documents (OCR) |
| **Kendra vs Personalize** | Search internal knowledge bases | Personalised product/content recommendations |
| **Bedrock vs SageMaker** | Use/customise pre-built FMs (GenAI) | Build & train custom ML models from scratch |
| **Bedrock vs Amazon Q** | You pick the FM | AWS manages FM; no FM selection |
| **Fine-tuning vs RAG** | Retrain model with labelled data (permanent) | Inject context at query time (no retraining) |
| **Fine-tuning vs Continued Pre-training** | Labelled data | Unlabelled data |
| **Rekognition vs Textract** | Faces, objects, labels in images | Text, tables, forms in scanned documents |
| **Forecast vs Personalize** | Time-series prediction (demand, inventory) | Real-time individual user recommendations |
| **Q Business vs Q Developer** | Enterprise chatbot on company data | AI coding assistant |
| **CloudTrail vs Config** | Who did what API call (audit) | Is resource config compliant (state) |
| **OpenSearch vs DynamoDB for RAG** | Vector search + similarity scoring = correct | Key-value lookup only = wrong for RAG |
| **On-demand vs Provisioned Throughput** | Pay per token; flexible | Reserve capacity; required for custom models |
| **Temperature vs tokens for cost** | Temperature does NOT reduce cost | Fewer input tokens = lower cost |

---

## Key Definitions Quick-Fire

| Term | One-line definition |
|------|-------------------|
| **Tokens** | Chunks of text a model processes; 1 token ≈ ¾ word; cost is per token |
| **Context window** | Max tokens model can hold in one session; measured in tokens, not characters |
| **Hallucination** | Model generates plausible but incorrect output |
| **RAG** | Retrieve real docs → ground LLM responses in facts; no retraining needed |
| **Embeddings** | Dense vectors representing semantic meaning; similar content = similar vectors |
| **Vector** | Numerical array output of an embedding model; stored in vector DB |
| **Fine-tuning** | Additional training on task-specific labelled data; creates private model copy |
| **Continued pre-training** | Train on unlabelled domain data; extend model vocabulary/knowledge |
| **Zero-shot** | Prompt with no examples |
| **Few-shot** | Prompt with 2–5 input/output examples |
| **Chain-of-thought** | Ask model to reason step by step |
| **Prompt injection** | Malicious text tries to hijack model behaviour |
| **Guardrails** | Bedrock feature to filter/block harmful model outputs and watermark images |
| **Agents** | LLMs that plan, call tools, and complete multi-step tasks autonomously |
| **Temperature** | Controls output randomness (0 = deterministic, 1 = creative); does NOT affect cost |
| **Foundation model** | Large pre-trained model usable for many downstream tasks |
| **Overfitting** | Model memorised training data; fails on new data; fix with regularisation |
| **Underfitting** | Model too simple; fix with more complex model or more data |
| **Data drift** | Input data distribution changes after deployment |
| **Model drift** | Model performance degrades over time |
| **Hyperparameter** | Configuration set before training (learning rate, batch size, dropout); external |
| **Parameter** | Internal model variable learned during training (weights, biases) |
| **BLEU** | Metric for NLP generation quality; measures n-gram overlap with reference text |
| **ROUGE** | Recall-focused NLP metric; used for summarisation evaluation |
| **RMSE** | Root Mean Square Error; penalises large errors; regression metric |
| **MAE** | Mean Absolute Error; average of absolute differences; regression metric |
| **SHAP** | Shapley values — feature importance scores per prediction for model explainability |
| **PDP** | Partial Dependence Plot — shows how one feature affects model output |
| **Watermarking** | Invisible signal embedded in AI-generated content to identify its source |
| **Provisioned Throughput** | Reserved Bedrock capacity; required for custom/fine-tuned models |
| **Diffusion model** | Generates images by learning to reverse a noise-adding process |
| **GAN** | Two-network system (generator vs discriminator) for synthetic data generation |
| **VAE** | Variational Autoencoder; learns latent distribution; smoother generation than GAN |
| **BERT** | Bidirectional transformer encoder; for text understanding (not generation) |
| **Transformer** | Attention-based architecture; backbone of all modern LLMs |
| **Incremental learning** | Model updates continuously from new data without forgetting old data |
| **Transfer learning** | Take pre-trained model; apply to new related task |
| **Domain adaptation** | Adapt model to new domain using domain-specific data |
| **AutoML** | Automatic ML — system selects algorithm and tunes hyperparameters |

---

*AWS AI Practitioner (AIF-C01) Cheat Sheet v2 — Study reference only.*