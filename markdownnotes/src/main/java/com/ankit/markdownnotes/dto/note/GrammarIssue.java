package com.ankit.markdownnotes.dto.note;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GrammarIssue {

    private String message;
    private List<String> suggestions;
}