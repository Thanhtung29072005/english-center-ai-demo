package com.webthuctapcoso.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.webthuctapcoso.converter.ExamConverter;
import com.webthuctapcoso.model.CreateExamQuestionDTO;
import com.webthuctapcoso.model.CreateExamRequestDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamQuestionDTO;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.ExamAnswerRepository;
import com.webthuctapcoso.repository.ExamAttemptRepository;
import com.webthuctapcoso.repository.ExamQuestionRepository;
import com.webthuctapcoso.repository.ExamRepository;
import com.webthuctapcoso.repository.ExamResultRepository;
import com.webthuctapcoso.repository.StudentRepository;
import com.webthuctapcoso.repository.TeacherRepository;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.ExamEntity;
import com.webthuctapcoso.repository.entity.ExamQuestionEntity;
import com.webthuctapcoso.repository.entity.TeacherEntity;

@ExtendWith(MockitoExtension.class)
class ExamServiceImplTest {

    @Mock private ExamRepository examRepository;
    @Mock private ExamResultRepository examResultRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private ExamQuestionRepository examQuestionRepository;
    @Mock private ExamAttemptRepository examAttemptRepository;
    @Mock private ExamAnswerRepository examAnswerRepository;
    @Mock private ExamConverter examConverter;
    @Mock private ClassRepository classRepository;
    @Mock private TeacherRepository teacherRepository;

    @InjectMocks private ExamServiceImpl examService;

    @Captor private ArgumentCaptor<ExamEntity> examCaptor;
    @Captor private ArgumentCaptor<ExamQuestionEntity> questionCaptor;

    @Test
    void createExamResolvesAssociationsCopiesFieldsAndForcesDraftStatus() {
        CreateExamRequestDTO request = new CreateExamRequestDTO();
        request.setClassId(11);
        request.setTeacherId(22);
        request.setExamType("MIDTERM");
        request.setExamDate(LocalDate.of(2026, 5, 20));
        request.setTitle("Grammar midterm");
        request.setDescription("Units 1-5");
        request.setDurationMinutes(75);
        request.setStartTime(LocalDateTime.of(2026, 5, 20, 9, 0));
        request.setEndTime(LocalDateTime.of(2026, 5, 20, 10, 15));
        request.setStatus("PUBLISHED");
        ClassEntity classEntity = new ClassEntity();
        TeacherEntity teacherEntity = new TeacherEntity();
        ExamDTO expected = new ExamDTO();

        when(classRepository.findById(11)).thenReturn(Optional.of(classEntity));
        when(teacherRepository.findById(22)).thenReturn(Optional.of(teacherEntity));
        when(examRepository.save(any(ExamEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(examConverter.toDTO(any(ExamEntity.class))).thenReturn(expected);

        ExamDTO actual = examService.createExam(request);

        verify(examRepository).save(examCaptor.capture());
        ExamEntity persisted = examCaptor.getValue();
        assertSame(classEntity, persisted.getClassEntity());
        assertSame(teacherEntity, persisted.getTeacherEntity());
        assertEquals(request.getExamType(), persisted.getExamType());
        assertEquals(request.getExamDate(), persisted.getExamDate());
        assertEquals(request.getTitle(), persisted.getTitle());
        assertEquals(request.getDescription(), persisted.getDescription());
        assertEquals(request.getDurationMinutes(), persisted.getDurationMinutes());
        assertEquals(request.getStartTime(), persisted.getStartTime());
        assertEquals(request.getEndTime(), persisted.getEndTime());
        assertEquals("DRAFT", persisted.getStatus());
        assertSame(expected, actual);
    }

    @Test
    void addQuestionTrimsAndUppercasesValidAnswer() {
        CreateExamQuestionDTO request = new CreateExamQuestionDTO();
        request.setQuestionNumber(3);
        request.setCorrectAnswer("  c  ");
        ExamEntity exam = new ExamEntity();
        ExamQuestionDTO expected = new ExamQuestionDTO();

        when(examRepository.findById(7)).thenReturn(Optional.of(exam));
        when(examQuestionRepository.findByExamEntity_IdAndQuestionNumber(7, 3)).thenReturn(Optional.empty());
        when(examQuestionRepository.save(any(ExamQuestionEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(examConverter.toQuestionDTO(any(ExamQuestionEntity.class))).thenReturn(expected);

        ExamQuestionDTO actual = examService.addQuestion(7, request);

        verify(examQuestionRepository).save(questionCaptor.capture());
        ExamQuestionEntity persisted = questionCaptor.getValue();
        assertSame(exam, persisted.getExamEntity());
        assertEquals(Integer.valueOf(3), persisted.getQuestionNumber());
        assertEquals("C", persisted.getCorrectAnswer());
        assertSame(expected, actual);
    }

    @Test
    void addQuestionRejectsAnswerOutsideAThroughDWithoutSaving() {
        CreateExamQuestionDTO request = new CreateExamQuestionDTO();
        request.setQuestionNumber(4);
        request.setCorrectAnswer("E");

        when(examRepository.findById(7)).thenReturn(Optional.of(new ExamEntity()));
        when(examQuestionRepository.findByExamEntity_IdAndQuestionNumber(7, 4)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> examService.addQuestion(7, request));

        assertEquals("Answer must be A, B, C or D", exception.getMessage());
        verify(examQuestionRepository, never()).save(any(ExamQuestionEntity.class));
        verify(examConverter, never()).toQuestionDTO(any(ExamQuestionEntity.class));
    }
}