package com.webthuctapcoso.model;

import java.time.LocalDate;
import java.util.*;
import com.webthuctapcoso.repository.valueObjects.GrammarItem;
import com.webthuctapcoso.repository.valueObjects.HomeworkItem;
import com.webthuctapcoso.repository.valueObjects.VocabularyItem;
public class CreateLessonRequestDTO {

    private Integer classId;
    private Integer teacherId;
    private LocalDate lessonDate;
    private Integer lessonNumber;

    private List<VocabularyItem> vocabulary;
    private List<HomeworkItem> homework;
    private List<GrammarItem> grammar;

    private String generalComment;
    private String content;

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public LocalDate getLessonDate() {
        return lessonDate;
    }

    public void setLessonDate(LocalDate lessonDate) {
        this.lessonDate = lessonDate;
    }

    public Integer getLessonNumber() {
        return lessonNumber;
    }

    public void setLessonNumber(Integer lessonNumber) {
        this.lessonNumber = lessonNumber;
    }

    public List<VocabularyItem> getVocabulary() {
        return vocabulary;
    }

    public void setVocabulary(List<VocabularyItem> vocabulary) {
        this.vocabulary = vocabulary;
    }

    public List<HomeworkItem> getHomework() {
        return homework;
    }

    public void setHomework(List<HomeworkItem> homework) {
        this.homework = homework;
    }

    public List<GrammarItem> getGrammar() {
        return grammar;
    }

    public void setGrammar(List<GrammarItem> grammar) {
        this.grammar = grammar;
    }

    public String getGeneralComment() {
        return generalComment;
    }

    public void setGeneralComment(String generalComment) {
        this.generalComment = generalComment;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
