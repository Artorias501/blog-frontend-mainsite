import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface BlogPost {
  id: number
  title: string
  summary: string
  content: string
  tags: string[]
  createdAt: string
  readTime: number
  aiSummary?: string
}

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([
    {
      id: 1,
      title: 'Building High-Performance Microservices with Go',
      summary:
        'Explore the principles and patterns for building scalable microservices using Go, including service discovery, load balancing, and distributed tracing.',
      content: `
# Building High-Performance Microservices with Go

## Introduction
Microservices architecture has become the de facto standard for building scalable, maintainable systems. Go, with its lightweight goroutines and excellent concurrency support, is ideal for microservices.

## Key Principles

### 1. Single Responsibility
Each service should do one thing well. This makes services easier to understand, test, and deploy.

### 2. Decentralized Data Management
Each service owns its data. This prevents tight coupling and allows independent scaling.

### 3. Fail Fast, Recover Fast
Services should handle failures gracefully. Use circuit breakers and timeouts.

## Code Example

\`\`\`go
func main() {
    r := gin.Default()
    
    r.GET("/posts", getPosts)
    r.GET("/posts/:id", getPost)
    r.POST("/posts", createPost)
    
    r.Run(":8080")
}
\`\`\`

## Conclusion
Go provides excellent tools for building microservices. Focus on simplicity and reliability.
            `,
      tags: ['Go', 'Microservices', 'Architecture'],
      createdAt: '2024-01-15',
      readTime: 8,
      aiSummary:
        'This article covers Go microservices fundamentals: single responsibility, decentralized data, and fault tolerance patterns. Includes practical Gin framework examples.',
    },
    {
      id: 2,
      title: 'Redis Caching Strategies for High Traffic Systems',
      summary:
        'Deep dive into Redis caching patterns including cache-aside, write-through, and write-behind, with practical implementation examples.',
      content: `
# Redis Caching Strategies for High Traffic Systems

## Why Cache?
Caching reduces database load and improves response times. Redis is the go-to solution for distributed caching.

## Caching Patterns

### Cache-Aside (Lazy Loading)
The application checks cache first, if miss, loads from DB and populates cache.

### Write-Through
Data is written to cache and DB simultaneously. Ensures consistency but adds latency.

### Write-Behind
Data is written to cache first, then asynchronously to DB. Better write performance.

## Implementation

\`\`\`go
func GetPost(ctx context.Context, id int) (*Post, error) {
    key := fmt.Sprintf("post:%d", id)
    
    // Check cache
    cached, err := redis.Get(ctx, key).Result()
    if err == nil {
        return deserialize(cached), nil
    }
    
    // Load from DB
    post, err := db.GetPost(id)
    if err != nil {
        return nil, err
    }
    
    // Populate cache
    redis.Set(ctx, key, serialize(post), time.Hour)
    return post, nil
}
\`\`\`

## Best Practices
1. Set appropriate TTLs
2. Use cache invalidation
3. Prevent cache stampede with singleflight
            `,
      tags: ['Redis', 'Caching', 'Performance'],
      createdAt: '2024-01-20',
      readTime: 6,
      aiSummary:
        'Covers Redis caching patterns: cache-aside, write-through, write-behind. Includes Go implementation examples and best practices for TTL and cache invalidation.',
    },
    {
      id: 3,
      title: 'Implementing Rate Limiting with Token Bucket Algorithm',
      summary:
        'Learn how to implement effective rate limiting using the token bucket algorithm, with Go code examples and Redis integration.',
      content: `
# Implementing Rate Limiting with Token Bucket Algorithm

## Introduction
Rate limiting protects your API from abuse and ensures fair resource allocation.

## Token Bucket Algorithm
- Bucket holds tokens (max capacity)
- Tokens are added at fixed rate
- Each request consumes one token
- If no tokens available, request is denied

## Implementation

\`\`\`go
type TokenBucket struct {
    rate       int
    capacity   int
    tokens     int
    lastUpdate time.Time
    mu         sync.Mutex
}

func (tb *TokenBucket) Allow() bool {
    tb.mu.Lock()
    defer tb.mu.Unlock()
    
    now := time.Now()
    elapsed := now.Sub(tb.lastUpdate).Seconds()
    tb.tokens = min(tb.capacity, tb.tokens + int(elapsed * float64(tb.rate)))
    tb.lastUpdate = now
    
    if tb.tokens > 0 {
        tb.tokens--
        return true
    }
    return false
}
\`\`\`

## Redis Integration
For distributed systems, use Redis to share rate limit state across instances.

## Conclusion
Token bucket provides smooth rate limiting with burst allowance.
            `,
      tags: ['Rate Limiting', 'Go', 'Security'],
      createdAt: '2024-02-01',
      readTime: 5,
      aiSummary:
        'Explains token bucket algorithm with Go implementation. Covers Redis integration for distributed rate limiting across multiple service instances.',
    },
    {
      id: 4,
      title: 'Message Queue Architecture for Async Processing',
      summary:
        'Design patterns for using message queues to decouple services and handle async tasks, featuring Kafka and RabbitMQ examples.',
      content: `
# Message Queue Architecture for Async Processing

## Why Message Queues?
- Decouple services
- Handle traffic spikes
- Enable async processing
- Improve reliability

## Kafka vs RabbitMQ

### Kafka
- High throughput
- Event streaming
- Durability

### RabbitMQ
- Flexible routing
- Priority queues
- Dead letter exchanges

## Architecture Pattern

\`\`\`
Producer → Queue → Consumer
           ↓
       Dead Letter Queue
\`\`\`

## Go Implementation

\`\`\`go
// Producer
func PublishEvent(event Event) error {
    return kafka.Produce(&kafka.Message{
        Topic: "blog.events",
        Value: serialize(event),
    })
}

// Consumer
func ConsumeEvents() {
    for msg := range kafka.Consume("blog.events") {
        processEvent(msg.Value)
        msg.Ack()
    }
}
\`\`\`

## Best Practices
1. Idempotent consumers
2. Retry with exponential backoff
3. Dead letter queue for failures
            `,
      tags: ['MQ', 'Kafka', 'Architecture'],
      createdAt: '2024-02-10',
      readTime: 7,
      aiSummary:
        'Compares Kafka and RabbitMQ for async processing. Shows producer/consumer patterns in Go and best practices: idempotency, retry, dead letter queues.',
    },
    {
      id: 5,
      title: 'AI-Powered Content Summarization Pipeline',
      summary:
        'Building an end-to-end pipeline for automatic content summarization using modern LLM APIs and async processing.',
      content: `
# AI-Powered Content Summarization Pipeline

## Overview
Automate blog post summarization using LLM APIs with a robust async pipeline.

## Architecture

\`\`\`
Blog Service → MQ → Worker → AI API
                          ↓
                      Database
\`\`\`

## Implementation

### Message Schema
\`\`\`go
type SummaryTask struct {
    PostID    int    \`json:"post_id"\`
    Content   string \`json:"content"\`
    Timestamp int64  \`json:"timestamp"\`
}
\`\`\`

### Worker Implementation
\`\`\`go
func ProcessSummary(task SummaryTask) error {
    summary, err := aiClient.Summarize(task.Content)
    if err != nil {
        return err
    }
    
    return db.UpdatePostSummary(task.PostID, summary)
}
\`\`\`

## Cost Optimization
- Batch requests
- Cache common patterns
- Use smaller models for simple tasks

## Quality Control
- Validate summary length
- Check for hallucinations
- Human review queue
            `,
      tags: ['AI', 'LLM', 'Pipeline'],
      createdAt: '2024-02-20',
      readTime: 6,
      aiSummary:
        'Designs async AI summarization pipeline. Covers message schema, worker implementation, cost optimization strategies, and quality control measures.',
    },
    {
      id: 6,
      title: 'Docker Deployment Best Practices',
      summary:
        'Optimize your Docker images and deployment workflow with multi-stage builds, health checks, and proper security configurations.',
      content: `
# Docker Deployment Best Practices

## Multi-Stage Builds

\`\`\`dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o main .

# Runtime stage
FROM alpine:3.18
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/main /main
EXPOSE 8080
CMD ["/main"]
\`\`\`

## Security
- Run as non-root user
- Use minimal base images
- Scan for vulnerabilities

## Health Checks
\`\`\`yaml
healthcheck:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
\`\`\`

## Optimization Tips
1. Layer caching
2. .dockerignore
3. Alpine for smaller images
            `,
      tags: ['Docker', 'DevOps', 'Deployment'],
      createdAt: '2024-03-01',
      readTime: 5,
      aiSummary:
        'Covers Docker best practices: multi-stage builds for Go apps, security (non-root, minimal images), health checks, and optimization tips for layer caching.',
    },
  ])

  const currentPost = ref<BlogPost | null>(null)

  const recentPosts = computed(() => posts.value.slice(0, 3))

  function getPostById(id: number): BlogPost | undefined {
    return posts.value.find((p) => p.id === id)
  }

  function setCurrentPost(post: BlogPost | null) {
    currentPost.value = post
  }

  return {
    posts,
    currentPost,
    recentPosts,
    getPostById,
    setCurrentPost,
  }
})
