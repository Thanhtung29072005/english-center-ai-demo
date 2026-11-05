# Current Task

## EXAM-TEST-001 — Automated tests for Exam module

- Status: **IN_PROGRESS**
- Priority: P0
- Project: English Center Management System
- Scope: Backend Exam module
- Approved stack: JUnit 5, Mockito, MockMvc and MySQL Testcontainers
- Plan: `docs/EXAM_TEST_PLAN.md`
- Decision record: `docs/DECISIONS.md#adr-001--exam-automated-testing-stack`
- Final demo report: `evidence/FINAL_DEMO_REPORT.md`

## Objective

Implement reliable automated coverage for Exam lifecycle, answer keys, publishing, student attempts, scoring, concurrency and result authorization without accessing production infrastructure.

## Accepted Increment

Nhóm ba JUnit 5/Mockito unit tests đầu tiên đã được nghiệm thu:

- [x] Valid create resolve Class/Teacher, copy fields và ép trạng thái `DRAFT`.
- [x] Answer key hợp lệ được trim và chuyển thành chữ hoa.
- [x] Answer key ngoài A–D bị từ chối và không được lưu.
- [x] Maven Surefire evidence: 3 tests run, 0 failures, 0 errors, 0 skipped.
- [x] Reviewer verdict: APPROVED; không có BLOCKER hoặc MAJOR.

Coverage hiện tại: **EX-001 COVERED, EX-004 PARTIAL, 8 test cases NOT COVERED**. Việc nghiệm thu increment này không đồng nghĩa toàn bộ module Exam đã được kiểm thử.

## Steps

- [x] Analyze existing Exam requirements and acceptance criteria.
- [x] Map API → Service → Repository architecture and testing seams.
- [x] Approve test technologies and high-level test cases.
- [x] Persist the agreed test plan and technology decision.
- [x] Add initial test dependency and test structure.
- [x] Implement and accept the first three JUnit 5/Mockito unit tests.
- [ ] Complete remaining unit-test boundaries, including the rest of EX-004.
- [ ] Implement API contract/security tests with MockMvc.
- [ ] Implement repository/concurrency tests with MySQL Testcontainers.
- [ ] Implement isolated PDF filesystem tests.
- [ ] Execute and retain evidence for the complete approved suite.
- [ ] Perform independent review and Tester verification for later increments.
- [ ] Fix confirmed failures and run regression testing.

## Improvement Backlog

- [ ] **MINOR-001:** Bind converter verification to the exact entity returned by repository save instead of broad `any(...)` matching.
- [ ] **MINOR-002:** When a stable validation contract exists, replace generic `RuntimeException` plus exact-message coupling with a specific exception type and semantic assertions.

## Constraints

- Do not use production database credentials or data.
- Do not run destructive database commands.
- Do not claim tests pass without actual command output or retained evidence.
- Do not claim the whole Exam module is tested while EX-002/003/005–010 and part of EX-004 remain uncovered.
- Do not push or merge without owner approval.
- Keep implementation limited to the approved Exam testing task.

## Exit Criteria

See `docs/EXAM_TEST_PLAN.md#completion-criteria`. The task remains **IN_PROGRESS** until all approved cases are implemented and verified, or exclusions are explicitly approved.
