# ADR-003: Redpanda over Apache Kafka

**Status:** Accepted
**Date:** 2025-01-11
**Deciders:** Data Platform Team

## Context

Ayvlo requires a high-throughput, low-latency event streaming platform for:
- Ingesting events from webhooks and integrations
- Stream processing with Flink/Materialize
- Real-time anomaly detection pipelines
- Action workflow triggers

We need to choose between Apache Kafka and Redpanda.

## Decision

We will use **Redpanda** as our event streaming platform, with Kafka API compatibility for client libraries.

## Consequences

**Positive:**
- **Performance:** 10x faster than Kafka in benchmarks, lower p99 latency
- **Simpler operations:** No JVM, no Zookeeper (uses Raft)
- **Cost:** 6x lower storage costs with Tiered Storage
- **Developer experience:** Drop-in Kafka replacement, same clients
- **Cloud-native:** Better Kubernetes integration
- **Resource usage:** Lower CPU/memory footprint

**Negative:**
- **Maturity:** Newer than Kafka (founded 2019 vs 2011)
- **Ecosystem:** Fewer third-party integrations (but Kafka API compatible)
- **Community:** Smaller community than Kafka
- **Hiring:** Fewer "Redpanda experts" in job market

## Technical Comparison

| Feature | Kafka | Redpanda | Winner |
|---------|-------|----------|--------|
| Throughput | 1M msg/s | 10M msg/s | Redpanda |
| p99 Latency | ~100ms | ~10ms | Redpanda |
| Ops Complexity | High (ZK) | Low (Raft) | Redpanda |
| Cost | $$$ | $ | Redpanda |
| Maturity | 13 years | 5 years | Kafka |
| Community | Large | Growing | Kafka |

## Migration Path

If we need to migrate to Kafka later:
1. Redpanda is Kafka API compatible
2. Mirror topics to Kafka cluster
3. Gradually switch consumers
4. Switch producers last
5. Decommission Redpanda

## Alternatives Considered

### Apache Kafka
**Rejected:** Higher operational complexity, cost, and latency.

### Apache Pulsar
**Rejected:** Even more complex than Kafka. Different mental model.

### AWS Kinesis
**Rejected:** Vendor lock-in. Not Kafka-compatible. Lower throughput.

### NATS JetStream
**Rejected:** Less mature for large-scale event streaming.

## References

- [Redpanda vs Kafka Benchmark](https://redpanda.com/blog/kafka-vs-redpanda-performance-benchmark)
- [Why Redpanda](https://redpanda.com/blog/why-redpanda)
- [Redpanda Architecture](https://docs.redpanda.com/current/get-started/architecture/)
