# Technical Decisions

## ADR-001 — Exam automated testing stack

- Status: **Accepted**
- Context: The existing Spring Boot/Maven Exam module requires unit, HTTP contract, persistence and concurrency coverage and currently has no Exam automated test suite.

### Decision

Use:

- **JUnit 5** for the test lifecycle, assertions and parameterized tests.
- **Mockito** for isolated `ExamServiceImpl` unit tests and collaborator interaction verification.
- **Spring MockMvc** for controller mappings, request/response contracts, validation and authorization checks without launching an external web server.
- **MySQL Testcontainers** for JPA queries, transactions, constraints, locking and concurrent start/submit scenarios using disposable MySQL instances.

### Rationale

- These tools integrate with the existing Spring Boot and Maven stack.
- Unit tests remain fast and deterministic.
- MockMvc exercises Spring MVC behavior more accurately than direct controller invocation.
- MySQL Testcontainers avoids H2/MySQL behavioral differences for repository and concurrency tests.
- Disposable containers prevent use of production credentials and persistent shared test data.

### Consequences

- Test-scoped dependencies must be added during the implementation task.
- Docker-compatible container execution is required for database integration tests.
- Unit and MockMvc tests should remain runnable independently from container tests.
- Time and filesystem behavior must be isolated to avoid flaky tests.
- Actual test results may be reported only after executing the relevant Maven commands.

### Deferred Decisions

- Exact publish-readiness rules.
- Final expired-submission behavior; the current approved testing default is rejection without updating results.
- Exact HTTP error response schema.
- Schema constraints or locking changes required to guarantee uniqueness under concurrency.
