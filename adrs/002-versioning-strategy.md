# ADR-002: Versioning Strategy

**Status**: Accepted  
**Date**: 2026-02-08  
**Deciders**: Platform Architecture Team

## Context

The 5G health platform contracts (APIs and events) will evolve over time as requirements change. Without a clear versioning strategy, we risk:

- Breaking changes that crash downstream services
- Inability to roll out changes incrementally
- Difficulty coordinating deployments across teams
- Loss of backwards compatibility

We need a versioning strategy that:
- Clearly signals breaking vs. non-breaking changes
- Works for both REST APIs (OpenAPI) and events (AsyncAPI)
- Is easy to understand and enforce

## Decision

We adopt **semantic versioning (semver)** for all contracts: `MAJOR.MINOR.PATCH`

### Semantic Version Components

- **MAJOR**: Breaking changes (increment when removing/renaming fields, changing types, removing endpoints)
- **MINOR**: Backwards-compatible additions (new optional fields, new endpoints, new event types)
- **PATCH**: Backwards-compatible fixes (documentation updates, clarifications, non-structural changes)

### REST API Versioning (OpenAPI)

**Version location**: `info.version` field in OpenAPI spec

```yaml
info:
  title: 5G Health Platform Gateway API
  version: 1.0.0  # <-- semantic version here
```

**Breaking change examples**:
- Removing an endpoint
- Removing a required field from a request/response
- Changing a field type (e.g., `string` → `integer`)
- Renaming a field
- Changing a required field to optional is **breaking** (consumers may not send it)

**Non-breaking change examples**:
- Adding a new endpoint
- Adding an optional field to a request/response
- Adding a new enum value (if consumers handle unknown values gracefully)
- Changing an optional field to required is **non-breaking** (but discouraged)

**Version in URL**: We **DO** use path versioning for MAJOR versions only (e.g., `/v1/patients`, `/v2/patients`). Minor and patch versions do not change the URL path. The OpenAPI spec version in `info.version` remains the single source of truth for the complete version. The API gateway routes requests based on the URL path version prefix.

### Event Versioning (AsyncAPI)

**Version location**: `event_version` field in the event payload

```json
{
  "event_name": "vitals.recorded",
  "event_version": "1.0.0",  // <-- semantic version here
  "event_id": "uuid",
  "timestamp": "2026-02-08T12:00:00Z",
  "payload": { ... }
}
```

**Breaking change examples**:
- Removing a required field from the payload
- Changing a field type
- Renaming a field
- Changing the event structure (e.g., flattening nested objects)

**Non-breaking change examples**:
- Adding an optional field to the payload
- Adding a new event type entirely
- Deprecating a field (with backwards compatibility)

**Handling multiple versions**:
- Consumers **MUST** check `event_version` and handle accordingly
- Producers **MAY** publish multiple event versions during migration periods
- Events with unknown versions should be logged and ignored (not crash the consumer)

### Git Tagging

Every contract release **MUST** be tagged in Git:

```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial contracts"
git push origin v1.0.0
```

Consuming services **MUST** pin to a specific tag (not `main`):

```bash
git submodule add -b v1.0.0 https://github.com/your-org/5g-health-platform-contracts.git
```

### Changelog

All version changes **MUST** be documented in `CHANGELOG.md` using the [Keep a Changelog](https://keepachangelog.com/) format.

## Consequences

### Positive

- **Predictability**: Teams know whether a change will break their service
- **Incremental rollout**: Services can upgrade at their own pace
- **Clear communication**: Version numbers convey intent
- **Backwards compatibility**: Non-breaking changes don't require coordination

### Negative

- **Coordination overhead**: Major version bumps require all consumers to upgrade
- **Maintenance burden**: May need to support multiple major versions temporarily
- **Discipline required**: Teams must correctly classify changes as breaking/non-breaking

### Mitigation

- **CI enforcement**: Automated checks to detect breaking changes
- **Design for extensibility**: Use optional fields and feature flags to minimize breaking changes
- **Deprecation policy**: Mark fields as deprecated for at least one minor version before removal
- **Communication**: Announce breaking changes in advance via Slack, email, and CHANGELOG

## Examples

### Example 1: Adding a new optional field (MINOR bump)

**Before** (v1.0.0):
```json
{
  "id": "uuid",
  "patient_id": "uuid",
  "heart_rate": 72
}
```

**After** (v1.1.0):
```json
{
  "id": "uuid",
  "patient_id": "uuid",
  "heart_rate": 72,
  "device_id": "device-123"  // NEW optional field
}
```

### Example 2: Renaming a field (MAJOR bump)

**Before** (v1.0.0):
```json
{
  "patient_id": "uuid",
  "bp": { "systolic": 120, "diastolic": 80 }
}
```

**After** (v2.0.0):
```json
{
  "patient_id": "uuid",
  "blood_pressure": { "systolic": 120, "diastolic": 80 }  // RENAMED
}
```

This is **breaking** because consumers expecting `bp` will fail.

### Example 3: Documentation fix (PATCH bump)

**Before** (v1.0.0):
```yaml
description: Heart rate in bpm
```

**After** (v1.0.1):
```yaml
description: Heart rate in beats per minute (bpm)
```

No structural change, just clarification.

## References

- [Semantic Versioning Specification](https://semver.org/)
- [JSON Schema Versioning Best Practices](https://json-schema.org/understanding-json-schema/reference/schema.html)
- [OpenAPI Versioning](https://swagger.io/specification/#info-object)
