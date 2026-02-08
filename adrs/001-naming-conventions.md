# ADR-001: Naming Conventions

**Status**: Accepted  
**Date**: 2026-02-08  
**Deciders**: Platform Architecture Team

## Context

The 5G health platform consists of multiple microservices that need to communicate via REST APIs and asynchronous events. Without consistent naming conventions, we risk:

- Misunderstandings between teams
- Integration errors due to field name mismatches
- Difficulty onboarding new developers
- Increased maintenance burden

## Decision

We adopt the following naming conventions across all contracts:

### 1. Event Naming

**Format**: `<domain>.<entity>.<action>`

- Use lowercase with dots as separators
- Domain: business domain (e.g., `patient`, `dispatch`, `vitals`)
- Entity: the subject of the event (may be omitted if same as domain)
- Action: past tense verb (e.g., `recorded`, `raised`, `created`, `assigned`)

**Examples**:
- ✅ `vitals.recorded`
- ✅ `patient.alert.raised`
- ✅ `dispatch.created`
- ✅ `dispatch.assigned`
- ❌ `VitalsRecorded` (not camelCase)
- ❌ `vitals_recorded` (not snake_case)
- ❌ `create-dispatch` (not present tense or kebab-case)

### 2. Field Naming

**Format**: `snake_case`

- Use lowercase with underscores
- Be explicit and descriptive
- Avoid abbreviations unless universally understood
- Use consistent suffixes:
  - `_id` for identifiers
  - `_at` for timestamps
  - `_url` for URLs

**Examples**:
- ✅ `patient_id`, `created_at`, `heart_rate`, `blood_pressure`
- ❌ `patientId` (not camelCase)
- ❌ `pt_id` (avoid abbreviations)
- ❌ `created` (use `created_at` for clarity)

### 3. Enum Value Naming

**Format**: `snake_case`

- Use lowercase with underscores
- Be descriptive and unambiguous

**Examples**:
- ✅ `critical`, `high`, `medium`, `low`
- ✅ `vitals_abnormal`, `fall_detected`, `sos_triggered`
- ❌ `Critical` (not PascalCase)
- ❌ `CRITICAL` (not UPPER_CASE)

### 4. Resource Naming (REST API paths)

**Format**: `kebab-case` for multi-word resources, plural nouns

- Use lowercase
- Plural nouns for collections
- Singular for specific resource operations
- Use hyphens for multi-word resources

**Examples**:
- ✅ `/patients`
- ✅ `/patients/{id}`
- ✅ `/patients/{id}/vitals`
- ✅ `/emergency-responders` (if we had such a resource)
- ❌ `/patient` (use plural)
- ❌ `/Patients` (not capitalized)

## Consequences

### Positive

- **Consistency**: All teams use the same naming patterns
- **Clarity**: Names are self-documenting and unambiguous
- **Interoperability**: Easier integration between services
- **Developer experience**: Less cognitive load when working across services

### Negative

- **Migration cost**: Existing services may need refactoring
- **Enforcement burden**: Requires code review diligence and automated linting

### Mitigation

- Use automated linting (Spectral for OpenAPI, custom validators for events)
- Document conventions in this ADR and README
- Provide examples in the `examples/` directory
- Include naming checks in CI pipeline

## References

- [Google JSON Style Guide](https://google.github.io/styleguide/jsoncstyleguide.xml)
- [RESTful API Design Best Practices](https://restfulapi.net/)
