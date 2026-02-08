# 5G Health Platform Contracts

This repository is the **single source of truth** for all API and event contracts for the 5G-enabled home healthcare and emergency response platform. It enforces shared schemas and versioning to prevent "project shattering" across microservices.

## Purpose

- **Prevent contract drift**: All services consume contracts from this repo.
- **Versioned schemas**: Semantic versioning for both REST APIs and event schemas.
- **Validation-first**: All contracts are validated on every PR.
- **Developer-friendly**: Clear examples, strict linting, and comprehensive documentation.

## Repository Structure

```
5g-health-platform-contracts/
├── openapi/               # OpenAPI 3.0 REST API specifications
│   └── gateway.yaml       # Main gateway API
├── asyncapi/              # AsyncAPI 2.0 event specifications
│   └── events.yaml        # Real-time event contracts
├── schemas/               # Shared domain schemas
│   ├── domain/            # Business domain models
│   │   ├── patient.json
│   │   ├── vitals.json
│   │   ├── alert.json
│   │   ├── dispatch.json
│   │   └── location.json
│   └── events/            # Event payload schemas
│       ├── vitals-recorded.json
│       ├── patient-alert-raised.json
│       ├── dispatch-created.json
│       └── dispatch-assigned.json
├── examples/              # Request/response examples
│   ├── rest/
│   └── events/
├── adrs/                  # Architecture Decision Records
│   ├── 001-naming-conventions.md
│   └── 002-versioning-strategy.md
├── .github/
│   └── workflows/
│       └── validate.yml   # CI validation workflow
├── package.json           # Validation tooling
├── .spectral.yaml         # OpenAPI linting rules
├── CHANGELOG.md           # Version history
├── LICENSE                # MIT License
└── README.md              # This file
```

## How to Validate Locally

### Prerequisites

- Node.js 18+ and npm

### Install Dependencies

```bash
npm install
```

### Run Validations

```bash
# Validate OpenAPI specs
npm run validate:openapi

# Validate AsyncAPI specs
npm run validate:asyncapi

# Validate JSON schemas
npm run validate:schemas

# Run all validations
npm test
```

## How Other Repos Should Consume Contracts

**Always pin to a specific git tag** to ensure reproducibility and prevent breaking changes from affecting your service.

### Example: Using OpenAPI contracts

```bash
# Clone at a specific tag
git clone --depth 1 --branch v1.0.0 https://github.com/your-org/5g-health-platform-contracts.git contracts

# Or use as a git submodule
git submodule add -b v1.0.0 https://github.com/your-org/5g-health-platform-contracts.git contracts
```

### Example: Using event schemas in your code

```javascript
// Node.js example
const vitalsSchema = require('./contracts/schemas/events/vitals-recorded.json');
const Ajv = require('ajv');
const ajv = new Ajv();
const validate = ajv.compile(vitalsSchema);

// Validate incoming event
if (!validate(event)) {
  console.error('Invalid event:', validate.errors);
}
```

## Contribution Rules

### 1. Branching Strategy

- Create feature branches from `main`
- Name branches: `feature/add-xyz-endpoint` or `fix/update-vitals-schema`

### 2. Making Changes

- **Breaking changes**: Increment major version (e.g., `v1.0.0` → `v2.0.0`)
- **New fields/endpoints**: Increment minor version (e.g., `v1.0.0` → `v1.1.0`)
- **Bug fixes/docs**: Increment patch version (e.g., `v1.0.0` → `v1.0.1`)

### 3. Adding New Contracts

1. Update the appropriate spec file (`openapi/`, `asyncapi/`, or `schemas/`)
2. Add examples in `examples/`
3. Update `CHANGELOG.md`
4. Run `npm test` to validate
5. Create a PR with a clear description

### 4. Pull Request Process

- All PRs require passing CI checks
- At least one approval from a platform architect
- Update version numbers and CHANGELOG before merging
- Tag the release after merging to `main`

### 5. Tagging Releases

```bash
# After merging to main
git tag -a v1.0.0 -m "Release v1.0.0: Initial contract definitions"
git push origin v1.0.0
```

## Versioning Rules

### API Versioning (OpenAPI)

- OpenAPI specs use `version` field in `info` object
- Follow semantic versioning: `MAJOR.MINOR.PATCH`

### Event Versioning (AsyncAPI)

- Each event includes `event_version` field in the payload
- Format: `MAJOR.MINOR.PATCH` (e.g., `"1.0.0"`)
- **Breaking change examples**:
  - Removing a required field
  - Changing field type
  - Renaming a field
- **Non-breaking change examples**:
  - Adding optional fields
  - Deprecating fields (with backwards compatibility)

See [ADR-002: Versioning Strategy](adrs/002-versioning-strategy.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Maintained by**: Platform Architecture Team  
**Questions?**: Contact #platform-contracts on Slack
