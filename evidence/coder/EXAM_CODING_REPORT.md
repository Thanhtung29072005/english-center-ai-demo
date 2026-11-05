# EXAM Coding Report

## Task

- ID: `EXAM-TEST-001`
- Project: `/workspace/english-center-ai-demo`
- Agent: Coding Agent (single delegated agent)
- Scope: First JUnit unit-test slice for the Exam module

## Status

**BLOCKED — implementation files were created, but test execution is unavailable because Java and Maven are not installed/on PATH and no Maven Wrapper exists.**

No test-pass claim is made.

## Implemented Changes

### `backend/pom.xml`

Added the Spring Boot managed test dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

The dependency inherits versions compatible with the existing Spring Boot parent `2.7.18`.

### `backend/src/test/java/com/webthuctapcoso/service/impl/ExamServiceImplTest.java`

Added exactly three JUnit 5 tests using Mockito:

1. `createExamResolvesAssociationsCopiesFieldsAndForcesDraftStatus`
   - Resolves Class and Teacher.
   - Captures the persisted Exam.
   - Verifies copied fields and forced `DRAFT` status.

2. `addQuestionTrimsAndUppercasesValidAnswer`
   - Supplies an answer with spaces and lowercase text.
   - Verifies normalization to `C` before persistence.

3. `addQuestionRejectsAnswerOutsideAThroughDWithoutSaving`
   - Supplies invalid answer `E`.
   - Verifies the current validation exception and message.
   - Verifies no question save or DTO conversion occurs.

No file under `backend/src/main/java` was changed and no business logic was modified.

## ExamServiceImpl Dependency Analysis

`ExamServiceImpl` uses field injection and has nine collaborators:

- `ExamRepository`
- `ExamResultRepository`
- `StudentRepository`
- `ExamQuestionRepository`
- `ExamAttemptRepository`
- `ExamAnswerRepository`
- `ExamConverter`
- `ClassRepository`
- `TeacherRepository`

The unit test uses Mockito `@Mock`, `@InjectMocks`, `@Captor` and interaction verification to isolate these dependencies.

## File Verification

Observed repository status from `backend/`:

```text
 M pom.xml
?? src/test/
```

Additional static checks:

```text
pom_xml=valid
test_methods=3
test_file_exists=true
```

`git diff --check` also reported CRLF lines in the added dependency block as trailing whitespace. The existing `pom.xml` uses CRLF line endings; this is a formatting observation, not a test-execution result.

## Test Execution

Intended targeted command:

```bash
cd /workspace/english-center-ai-demo/backend
mvn -Dtest=ExamServiceImplTest test
```

Environment probe output:

```text
/usr/bin/bash: line 7: java: command not found
/usr/bin/bash: line 7: mvn: command not found
java_exit=127
mvn_exit=127
```

No `mvnw` file was found in the project.

### Actual Results

- Tests discovered statically: **3**
- Tests actually executed: **0**
- Passed: **0**
- Failed: **0**
- Execution status: **BLOCKED**

## Limitations and Handoff

- Java and Maven, or a working Maven Wrapper, are required before compilation and execution can be verified.
- Current `addQuestion` behavior permits a null answer through normalization; this slice does not test or modify that behavior.
- Invalid non-null answers currently throw a generic `RuntimeException`; this was characterized without changing production logic.
- After the environment is available, run only `mvn -Dtest=ExamServiceImplTest test` first and retain the complete Maven output.
- Independent Reviewer and Tester agents were intentionally not called in this run.
