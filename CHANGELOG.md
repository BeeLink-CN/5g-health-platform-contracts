# Changelog

All notable changes to the 5G Health Platform Contracts will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

---

## [1.0.0] - 2026-02-08

### Added
- Initial release of contract definitions
- **OpenAPI specification** (`openapi/gateway.yaml`):
  - `GET /patients` - List all patients
  - `GET /patients/{id}` - Get patient by ID
  - `GET /patients/{id}/vitals/latest` - Get latest vitals for patient
  - `GET /patients/{id}/vitals` - Get vitals history with time range filter
  - `GET /alerts` - List alerts with optional patient filter
  - `POST /dispatch` - Create emergency dispatch
  - `POST /dispatch/{id}/assign` - Assign dispatch to responder
- **Domain schemas** (JSON Schema Draft 2020-12):
  - `Patient` - Patient entity with location and emergency contact
  - `Vitals` - Vital signs measurements (heart rate, blood pressure, temperature, oxygen saturation)
  - `Alert` - Patient alert notifications with severity and status tracking
  - `Dispatch` - Emergency dispatch requests with priority and workflow
  - `Location` - Geographic coordinates (WGS84)
- **AsyncAPI specification** (`asyncapi/events.yaml`):
  - Event channels for vitals, alerts, and dispatch
- **Event schemas** with standardized envelope (event_name, event_version, event_id, timestamp, payload):
  - `vitals.recorded` - Published when patient vitals are recorded
  - `patient.alert.raised` - Published when patient alert is triggered
  - `dispatch.created` - Published when emergency dispatch is created
  - `dispatch.assigned` - Published when dispatch is assigned to responder
- **Architecture Decision Records (ADRs)**:
  - ADR-001: Naming conventions for events, fields, enums, and REST resources
  - ADR-002: Semantic versioning strategy for APIs and events
- **Developer tooling**:
  - `package.json` with validation scripts
  - Spectral configuration for OpenAPI linting
  - AJV-based JSON schema validation script
- **CI/CD**:
  - GitHub Actions workflow for automated validation on PR and push to main
- **Documentation**:
  - Comprehensive README with usage instructions and contribution guidelines
  - MIT License
  - This CHANGELOG

[Unreleased]: https://github.com/your-org/5g-health-platform-contracts/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/5g-health-platform-contracts/releases/tag/v1.0.0
