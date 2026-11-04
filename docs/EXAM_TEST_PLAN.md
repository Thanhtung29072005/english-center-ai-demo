# Exam Module Automated Test Plan

## Status

- State: **PLANNED**
- Scope: Backend Exam module only
- Project: English Center Management System

## Scope

Automated coverage for:

- Exam creation, update, deletion, validation, status and availability.
- PDF upload and metadata handling.
- Answer-key normalization, uniqueness and confidentiality.
- Publish readiness rules.
- Student start, resume and submit flows, including class membership and ownership.
- Scoring, rounding and persistence of attempts, answers and results.
- Duplicate/concurrent requests and expired attempts.
- Result access isolation for students, teachers and parents.

Out of scope: production database access, migration execution, unrelated modules and frontend E2E tests.

## Approved Technology

- **JUnit 5** for the test lifecycle, assertions and parameterized tests.
- **Mockito** for unit-test mocks and interaction verification.
- **Spring MockMvc** for HTTP contracts, serialization, validation and authorization tests.
- **MySQL Testcontainers** for repository, transaction, constraint and concurrency integration tests against an isolated MySQL instance.
- **Maven Surefire/Failsafe** as appropriate for unit and integration test execution.

## Planned Dependencies

Add during the implementation task, not during planning:

- `org.springframework.boot:spring-boot-starter-test` with test scope.
- `org.testcontainers:junit-jupiter` with test scope.
- `org.testcontainers:mysql` with test scope.
- The existing MySQL JDBC driver available to the test runtime.

No production credentials may be used. Test containers must be isolated and disposable.

## Test Cases

| ID | Priority | Level | Expected coverage |
|---|---|---|---|
| EX-001 | P0 | Unit | A valid create request resolves Class/Teacher, persists required fields and always creates the Exam as `DRAFT`. |
| EX-002 | P0 | MockMvc | Invalid CRUD payloads return stable 4xx responses; missing Exam/Class/Teacher returns 404; rejected requests persist no partial changes. |
| EX-003 | P1 | Integration | PDF upload accepts a valid PDF and safely rejects empty, wrong-extension, wrong-MIME and unsafe-name inputs. |
| EX-004 | P0 | Unit + API/DB | Answers are normalized to A-D, invalid answers are rejected, question numbers are unique per Exam and student responses do not expose answer keys. |
| EX-005 | P0 | Integration | Only a ready Exam can be published; availability contains only active `PUBLISHED` Exams for the correct class. |
| EX-006 | P0 | MockMvc integration | Only the authenticated student in the Exam class can start an open, published Exam; client input cannot impersonate another student. |
| EX-007 | P0 | DB concurrency | Repeated start resumes the same active attempt without extending its deadline; concurrent starts create at most one attempt. |
| EX-008 | P0 | Unit + DB | Submit normalizes answers, calculates and rounds the score correctly, then consistently persists Answer, Attempt and Result. |
| EX-009 | P0 | DB concurrency | Duplicate, expired and concurrent submissions cannot overwrite accepted data or produce inconsistent scores/results. |
| EX-010 | P0 | MockMvc security | Students, teachers and parents can access or mutate only results within their authorized ownership/class relationship. |

All cases are currently **PROPOSED / NOT RUN**.

## Implementation Sequence

1. Add the approved test dependencies and test directory structure.
2. Create reusable fixtures/builders for Exam-related entities.
3. Implement service unit tests with JUnit 5 and Mockito.
4. Implement MockMvc contract, validation and authorization tests.
5. Implement MySQL Testcontainers repository, transaction and concurrency tests.
6. Implement isolated PDF filesystem tests.
7. Execute the full suite, retain raw logs and classify failures.
8. Obtain independent review and rerun regression after fixes.

## Contracts to Confirm During Implementation

- Exact publish-readiness conditions.
- HTTP status and response schema for validation and business-rule failures.
- Expired-submission policy; approved testing default is rejection without updating `ExamResult`.
- Authentication principal is the authoritative student identity; request parameters must not override it.
- Required uniqueness or locking behavior for question, attempt and result records.

## Completion Criteria

The Exam testing task is complete only when:

- All ten planned cases are implemented, or any exclusion is documented and approved.
- Unit and MockMvc tests run deterministically without external services.
- Database tests run only against disposable MySQL Testcontainers instances.
- Time and filesystem-dependent tests use deterministic, isolated boundaries.
- Authorization and data-isolation assertions cover Student, Teacher and Parent access.
- Concurrent start and submit tests verify actual persisted row counts and consistency.
- The complete Maven test command is executed with retained output and no unreported failures.
- An independent Reviewer reviews the changes.
- Tester verification reports commands, pass/fail counts and reproduction details for failures.
- No production credentials, migrations or production data are used.
