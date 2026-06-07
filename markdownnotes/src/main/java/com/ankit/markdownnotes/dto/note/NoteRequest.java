package com.ankit.markdownnotes.dto.note;

import lombok.Data;

@Data
public class NoteRequest {

    private String fileName;
    private String markdownContent;
}