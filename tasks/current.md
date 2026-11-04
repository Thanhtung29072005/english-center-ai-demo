# Current Task

## EXAM-TEST-001 — Automated tests for Exam module

- Status: **PLANNED**
- Priority: P0
- Project: English Center Management System
- Scope: Backend Exam module
- Approved stack: JUnit 5, Mockito, MockMvc and MySQL Testcontainers
- Plan: `docs/EXAM_TEST_PLAN.md`
- Decision record: `docs/DECISIONS.md#adr-001--exam-automated-testing-stack`

## Objective

Implement reliable automated coverage for Exam lifecycle, answer keys, publishing, student attempts, scoring, concurrency and result authorization without accessing production infrastructure.

## Steps

- [x] Analyze existing Exam requirements and acceptance criteria.
- [x] Map API → Service → Repository architecture and testing seams.
- [x] Approve test technologies and high-level test cases.
- [x] Persist the agreed test plan and technology decision.
- [ ] Coding Agent adds test dependencies and test structure.
- [ ] Coding Agent implements unit tests with JUnit 5 and Mockito.
- [ ] Coding Agent implements API contract/security tests with MockMvc.
- [ ] Coding Agent implements repository/concurrency tests with MySQL Testcontainers.
- [ ] Coding Agent implements isolated PDF filesystem tests.
- [ ] Reviewer Agent performs an independent review.
- [ ] Tester Agent executes the complete suite and records real results.
- [ ] Coding Agent fixes confirmed failures, followed by regression testing.

## Constraints

- Do not use production database credentials or data.
- Do not run destructive database commands.
- Do not claim tests pass without actual command output.
- Do not push or merge without owner approval.
- Keep implementation limited to the approved Exam testing task.

## Exit Criteria

See `docs/EXAM_TEST_PLAN.md#completion-criteria`. The task remains **PLANNED** until implementation begins.
