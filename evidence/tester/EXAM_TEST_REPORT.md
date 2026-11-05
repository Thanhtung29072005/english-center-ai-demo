# Exam Test Verification Report

## Verdict

**Retained targeted-test result: PASS. Exam-module verification: INCOMPLETE.**

The retained Surefire reports consistently show that exactly three tests from `ExamServiceImplTest` executed: **3 run, 0 failures, 0 errors, 0 skipped, 0.89 s**. The XML testcase names exactly match the three `@Test` methods in the current source. This evidence validates only the targeted Mockito unit-test class and does **not** validate the full Exam module, a Maven regression suite, MockMvc behavior, database behavior, filesystem behavior, concurrency, or authorization.

`BUILD SUCCESS` cannot be independently verified from the retained artifacts: neither retained Surefire file contains the Maven console/build summary. The test result is evidenced; the broader build-result claim is not.

## Evidence and commands reviewed

Files reviewed:

- `docs/EXAM_TEST_PLAN.md`
- `evidence/reviewer/EXAM_REVIEW_REPORT.md`
- `backend/src/test/java/com/webthuctapcoso/service/impl/ExamServiceImplTest.java`
- `backend/src/main/java/com/webthuctapcoso/service/impl/ExamServiceImpl.java`
- `evidence/tester/com.webthuctapcoso.service.impl.ExamServiceImplTest.txt`
- `evidence/tester/TEST-com.webthuctapcoso.service.impl.ExamServiceImplTest.xml`

Tooling probe executed from `backend/`:

```text
$ for tool in mvn java; do ...; done
mvn=UNAVAILABLE
java=UNAVAILABLE
```

Maven and Java are unavailable in this environment. Per task restrictions, nothing was installed and no additional test run is claimed. The retained Surefire artifacts are therefore the execution-evidence source.

Artifact consistency check executed with Python XML/source parsing:

```text
TXT_SUMMARY=Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.89 s - in com.webthuctapcoso.service.impl.ExamServiceImplTest
XML_TOTALS=tests=3,failures=0,errors=0,skipped=0,time=0.89
XML_TESTCASES=createExamResolvesAssociationsCopiesFieldsAndForcesDraftStatus|addQuestionRejectsAnswerOutsideAThroughDWithoutSaving|addQuestionTrimsAndUppercasesValidAnswer
SOURCE_TESTS=createExamResolvesAssociationsCopiesFieldsAndForcesDraftStatus|addQuestionTrimsAndUppercasesValidAnswer|addQuestionRejectsAnswerOutsideAThroughDWithoutSaving
SOURCE_COUNT=3
XML_COUNT=3
NAME_SET_MATCH=True
TARGETED_PROPERTY=ExamServiceImplTest
FAILURE_ERROR_NODES=0
```

The plain-text totals (`...ExamServiceImplTest.txt:2-4`) and XML totals (`TEST-...xml:2`) agree. The XML contains exactly three testcase elements (`TEST-...xml:62-64`), no failure/error nodes, and the `test=ExamServiceImplTest` property (`TEST-...xml:20`) proves this was a targeted class invocation rather than a full suite.

Surefire does not record the number of individual JUnit/Mockito assertions, so an assertion-count total cannot be grounded from these artifacts. The grounded execution statistics are testcase-level only.

## Exactly which tests executed

| Executed test | Retained result | Behavior actually asserted | Plan mapping |
|---|---:|---|---|
| `createExamResolvesAssociationsCopiesFieldsAndForcesDraftStatus` | PASS | Resolves mocked Class ID 11 and Teacher ID 22; copies exam type/date/title/description/duration/start/end; ignores requested `PUBLISHED`; saves `DRAFT`; returns converter result (`ExamServiceImplTest.java:59-96`). This matches `createExam` (`ExamServiceImpl.java:72-86`). | EX-001 |
| `addQuestionTrimsAndUppercasesValidAnswer` | PASS | New-question path for exam 7/question 3; normalizes one representative input, `"  c  "`, to `"C"`; saves association and number; returns converter result (`ExamServiceImplTest.java:98-119`). This matches `addQuestion`/`normalizeAnswer` (`ExamServiceImpl.java:182-188,296-300`). | EX-004 |
| `addQuestionRejectsAnswerOutsideAThroughDWithoutSaving` | PASS | Rejects one representative invalid value, `"E"`, with the current generic exception/message; verifies no question save and no conversion (`ExamServiceImplTest.java:121-136`). | EX-004 |

## Coverage against EX-001 through EX-010

Statuses describe implemented, evidenced coverage—not production correctness outside the exercised path.

| ID | Status | Grounded assessment |
|---|---|---|
| EX-001 | **COVERED** (planned unit path only) | The single planned valid-create unit behavior is directly exercised: associations, all fields assigned by the implementation, persistence, and forced `DRAFT`. This does not cover invalid create requests or HTTP/DB contracts; those belong primarily to EX-002. |
| EX-002 | **NOT COVERED** | No MockMvc tests, stable 4xx assertions, missing Exam/Class/Teacher cases, or transaction/no-partial-change checks. |
| EX-003 | **NOT COVERED** | No PDF upload/filesystem test for valid, empty, extension, MIME, unsafe filename, metadata, or I/O failure. |
| EX-004 | **PARTIAL** | One trim/uppercase case and one out-of-range letter are covered. All A-D values, null/blank/malformed inputs, question-number uniqueness semantics, DB/API uniqueness, and student answer-key confidentiality are untested. |
| EX-005 | **NOT COVERED** | No publish-readiness or class/status/time-filtered availability test. |
| EX-006 | **NOT COVERED** | No authenticated-student, class-membership, open-window, published-state, or anti-impersonation API test. |
| EX-007 | **NOT COVERED** | No resume/deadline preservation, duplicate-start, persisted row-count, or concurrent-start test. |
| EX-008 | **NOT COVERED** | No submit normalization, score/rounding, missing-answer, or Answer/Attempt/Result persistence test. |
| EX-009 | **NOT COVERED** | No duplicate, expired, exactly-at-deadline, transactional, or concurrent-submission test. |
| EX-010 | **NOT COVERED** | No Student/Teacher/Parent ownership, class relationship, read isolation, or mutation authorization test. |

Plan-case status summary: **1 COVERED, 1 PARTIAL, 8 NOT COVERED**. This is not equivalent to 10 passing acceptance cases.

## Business scenarios and boundary/invalid-input gaps

### CRUD and validation

- Create: missing/nonexistent Class or Teacher, null IDs, null request, required-field omissions, empty title/type, zero/negative duration, invalid or reversed start/end times, and verification that rejected calls do not save.
- Read/update/delete: missing Exam; Class/Teacher reassociation; update status rules; invalid updates; delete behavior and related-record constraints; transaction rollback/no partial changes.
- API contracts: validation serialization, exact stable 4xx/404 status and response schema. No controller/MockMvc path was exercised.

### Questions and answer keys

- Valid boundary/equivalence set: `A`, `B`, `C`, `D`, lowercase forms, and surrounding whitespace; only padded lowercase `c` is tested.
- Invalid set: null, empty, whitespace-only, multiple characters, digits, punctuation, non-ASCII/case edge cases. Current source returns `null` for a null answer (`ExamServiceImpl.java:296-300`), but no test establishes whether that meets the plan's “invalid answers are rejected” requirement.
- Question-number boundaries: null, zero, negative, very large values, duplicate numbers, and concurrent duplicates.
- Duplicate semantics remain unresolved: current source retrieves an existing exam/question number and updates it (`ExamServiceImpl.java:183-188`), while EX-004 requires uniqueness. No test proves API or DB uniqueness behavior.
- Missing Exam and persistence/conversion failure paths are untested.
- Student DTO/start response must not expose `correctAnswer`; no confidentiality assertion exists.

### PDF, publishing, and availability

- Valid PDF content and metadata; null/empty file; case variants; wrong extension; wrong MIME; null MIME; disguised/non-PDF bytes; traversal/unsafe/original names; duplicate uploads; I/O failure and cleanup.
- Publish readiness (PDF/questions/answer keys/required metadata as ultimately specified), missing Exam, repeated publish, and invalid status transitions.
- Availability must include only active `PUBLISHED` exams for the requested class. `DRAFT`, other status strings, wrong class, before-start, at start/end boundaries, after end, and null timing fields are untested.

### Start/resume/submit and persistence

- Identity source, class membership, impersonation, unpublished Exam, missing Exam/Student, before opening, exactly at opening, exactly at closing, after closing, and null/zero/negative duration.
- Repeated start should resume the same active attempt without changing `startedAt`/deadline; submitted and expired attempts; concurrent starts and actual persisted row count.
- Submit with null/empty answers, omitted questions, duplicate answer entries, unknown question numbers, invalid selected answers, empty question set, and all-correct/all-wrong/mixed scores.
- Score rounding boundaries (including half-up cases), persisted score string, answer correctness, result upsert, and atomic rollback across Answer/Attempt/Result writes.
- Expiration immediately before, exactly at, and immediately after deadline. Current `isExpired` uses `now.isAfter(deadline)` (`ExamServiceImpl.java:302-304`), so equality is a material boundary requiring a test.
- Duplicate and concurrent submissions must not overwrite accepted answers/results or create inconsistent data.

### Authorization and result isolation

- Student ownership, Teacher class relationship, Parent-child relationship, unrelated-user denial, cross-class access, direct-ID enumeration, and read versus mutation permissions are all untested.

## Completion-criteria assessment

| Test-plan completion criterion (`EXAM_TEST_PLAN.md:79-92`) | Status |
|---|---|
| All ten cases implemented or exclusions approved | **NOT MET** — only EX-001 is covered; EX-004 is partial. |
| Unit and MockMvc tests deterministic without external services | **PARTIAL** — these three Mockito unit tests are deterministic; no MockMvc evidence exists. |
| DB tests use disposable MySQL Testcontainers | **NOT COVERED / NOT EVALUATED** — no DB tests ran. |
| Time/filesystem tests use deterministic isolated boundaries | **NOT COVERED**. |
| Student/Teacher/Parent authorization and isolation | **NOT COVERED**. |
| Concurrent start/submit persisted-row consistency | **NOT COVERED**. |
| Complete Maven test command retained with no unreported failures | **NOT MET** — retained evidence records only `test=ExamServiceImplTest`; no full command/console log or full-suite report exists. |
| Independent review | **MET for this three-test slice** — reviewer verdict is APPROVED, with two non-blocking MINOR risks (`EXAM_REVIEW_REPORT.md:3-7,39-55`). |
| Tester metrics and failure reproduction | **MET for retained slice reporting only** — this report grounds testcase metrics and gaps; no new run was possible. |
| No production credentials, migrations, or production data | **SUPPORTED for this mocked unit slice only** — the three source tests use Mockito and no DB/filesystem. |

Reviewer MINOR risks remain applicable: success-path converter stubs use `any(...)` rather than tying conversion to the saved entity, and the invalid-answer test is coupled to broad `RuntimeException` plus an exact message (`EXAM_REVIEW_REPORT.md:41-55`).

## Failures, reproduction, and next steps

No testcase failure trace exists in the retained reports; all three retained testcases passed. There is therefore no failing executed scenario to reproduce.

To close the verification gaps:

1. Implement and execute the remaining planned unit, MockMvc, isolated PDF, MySQL Testcontainers, transaction, authorization, and concurrency tests for EX-002 through EX-010; expand EX-004 boundaries and uniqueness/confidentiality checks.
2. Retain the full Maven console output and all Surefire/Failsafe reports from a complete suite run. This is required to substantiate `BUILD SUCCESS` and regression status.
3. Re-run the targeted class where Maven/Java are available with `mvn -Dtest=ExamServiceImplTest test`, then run the complete approved Maven suite separately. The targeted command alone must never be reported as full Exam-module verification.
4. For any future failure, retain the command, full stack trace, request/fixture, relevant persisted row counts, and deterministic reproduction steps.
