# EXAM-TEST-001 Review Report

## Verdict: APPROVED

The first three-test unit slice is acceptable for merge. The added test dependency is minimal, test-scoped, and compatible with the project's Spring Boot 2.7.18 / Java 8 baseline. All three tests match the current `ExamServiceImpl` behavior and the retained Surefire reports confirm that exactly those three tests passed with no failures, errors, or skips.

No BLOCKER or MAJOR findings were identified. Two MINOR findings describe false-positive and maintainability risks; neither invalidates the behaviors currently exercised.

## Scope reviewed

- `backend/pom.xml`
- `backend/src/test/java/com/webthuctapcoso/service/impl/ExamServiceImplTest.java`
- `backend/src/main/java/com/webthuctapcoso/service/impl/ExamServiceImpl.java`
- Relevant request DTO, entity, and repository signatures
- `docs/EXAM_TEST_PLAN.md`
- `tasks/current.md`
- Both retained reports under `evidence/tester/`

## Dependency assessment

`org.springframework.boot:spring-boot-starter-test` is the only added dependency and is correctly limited to test scope (`backend/pom.xml:54-58`). Its version is inherited from `spring-boot-starter-parent` 2.7.18 (`backend/pom.xml:8-12`), avoiding an unnecessary independently pinned JUnit or Mockito version. The project targets Java 8 (`backend/pom.xml:15-17`). The retained XML report confirms execution on Java 8/class version 52 and a Spring Boot 2.7.18 test classpath (`evidence/tester/TEST-com.webthuctapcoso.service.impl.ExamServiceImplTest.xml:6,9,36,47,60`). This is minimal and compatible for this unit-test slice.

Testcontainers dependencies from the broader plan are not needed yet: these three tests are Mockito unit tests and use no database or container (`docs/EXAM_TEST_PLAN.md:32-41,60-69`). Deferring those dependencies is appropriate rather than a defect.

## Test-by-test assessment

### 1. `createExamResolvesAssociationsCopiesFieldsAndForcesDraftStatus`

The test supplies fixed IDs and fixed date/time values, stubs both association lookups, captures the entity passed to `save`, and checks every field assigned by the current implementation (`ExamServiceImplTest.java:59-96`). It specifically proves that client-provided `PUBLISHED` is ignored and the persisted status is `DRAFT` (`ExamServiceImplTest.java:71,83-95`), matching `ExamServiceImpl.createExam` (`ExamServiceImpl.java:72-86`) and the EX-001 intent (`docs/EXAM_TEST_PLAN.md:47`). The test is deterministic and has no external-service, clock, database, or filesystem dependency.

### 2. `addQuestionTrimsAndUppercasesValidAnswer`

The test exercises the new-question path, captures the saved question, and verifies its exam association, question number, and normalized `C` answer (`ExamServiceImplTest.java:98-119`). This matches `addQuestion` and `normalizeAnswer`, which trim, uppercase, and accept only A-D (`ExamServiceImpl.java:182-188,296-300`). Fixed inputs and mocks make the test deterministic.

### 3. `addQuestionRejectsAnswerOutsideAThroughDWithoutSaving`

The test supplies `E`, asserts the exact current error message, and verifies that neither persistence nor DTO conversion occurs (`ExamServiceImplTest.java:121-136`). This matches the rejection in `normalizeAnswer` (`ExamServiceImpl.java:296-300`). Verifying both no `save` and no conversion materially reduces false-positive risk on the failure path.

## Findings

### MINOR-001 — Conversion assertions are not tied to the captured/saved entity

**Files:** `backend/src/test/java/com/webthuctapcoso/service/impl/ExamServiceImplTest.java:78-79,83-95,108-109,113-118`

The two success tests stub converter calls with `any(...)` and return a prebuilt DTO by identity. The entity passed to `save` is well asserted, but the tests would still pass if production code converted a different entity instance or converted before/independently of the repository result. Current production code correctly converts the value returned by `save` (`ExamServiceImpl.java:86,188`), so this is a latent false-positive risk rather than a current behavioral mismatch.

**Required action:** In a future test refinement, bind `save` and converter expectations to the same captured/returned entity, or verify the converter receives the repository return value. This is non-blocking for the initial slice.

### MINOR-002 — The invalid-answer test is coupled to a generic exception type and exact message

**Files:** `backend/src/test/java/com/webthuctapcoso/service/impl/ExamServiceImplTest.java:130-135`; `backend/src/main/java/com/webthuctapcoso/service/impl/ExamServiceImpl.java:296-300`

The assertion accurately reflects current behavior, but `RuntimeException` is broad and the exact string is an unstable service implementation detail. A future unrelated runtime failure with the same message could satisfy the assertion, while harmless message wording changes would break the test. The no-save/no-conversion checks mitigate this risk, and there is no narrower domain exception in the current implementation.

**Required action:** When production validation introduces a specific exception contract, assert that type and its stable semantic fields. Do not weaken the current assertion before such a contract exists. This is non-blocking.

## Intentional first-slice limitations (not defects)

- This slice covers the valid EX-001 create path and two answer-normalization behaviors from EX-004; it does not claim completion of EX-001 through EX-010.
- Missing Class/Teacher cases, duplicate question semantics, null/blank answers, update/delete, publishing, availability, PDF handling, attempts, scoring, authorization, concurrency, MockMvc, and database behavior remain planned work (`docs/EXAM_TEST_PLAN.md:43-69`). Their absence is expected in an explicitly limited first three-test slice.
- The repository API permits finding an existing question by exam and question number (`ExamQuestionRepository.java:13-15`), and current service behavior updates that entity rather than rejecting it (`ExamServiceImpl.java:183-188`). These three tests do not resolve the broader uniqueness contract; that belongs to later unit/API/database coverage.
- `tasks/current.md` and the overall plan remain marked PLANNED/incomplete (`tasks/current.md:3-5,23-30`; `docs/EXAM_TEST_PLAN.md:3-5,79-92`). Approval of this slice must not be represented as completion of EXAM-TEST-001.

## Evidence verification

The plain-text Surefire report records `Tests run: 3, Failures: 0, Errors: 0, Skipped: 0` for `ExamServiceImplTest` (`evidence/tester/com.webthuctapcoso.service.impl.ExamServiceImplTest.txt:2-4`). The XML independently declares the same totals and lists exactly these three testcase names (`evidence/tester/TEST-com.webthuctapcoso.service.impl.ExamServiceImplTest.xml:2,62-64`). It also records a targeted `ExamServiceImplTest` invocation (`...xml:20`), so this evidence supports this class only, not a full-project regression-suite claim.

## Required actions before merge

None for this three-test slice. Track the two MINOR refinements and continue the remaining planned coverage before declaring EXAM-TEST-001 complete.
