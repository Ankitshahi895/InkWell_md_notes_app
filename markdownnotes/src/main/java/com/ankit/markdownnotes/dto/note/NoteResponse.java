package com.ankit.markdownnotes.dto.note;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NoteResponse {

    private Long id;
    private String fileName;
    private String markdownContent;
    private LocalDateTime createdAt;
}