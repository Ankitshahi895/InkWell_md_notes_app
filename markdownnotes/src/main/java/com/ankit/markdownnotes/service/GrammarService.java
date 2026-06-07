package com.ankit.markdownnotes.service;

import com.ankit.markdownnotes.dto.note.GrammarIssue;
import org.languagetool.JLanguageTool;
import org.languagetool.language.AmericanEnglish;
import org.languagetool.rules.RuleMatch;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class GrammarService {

    public List<GrammarIssue> checkGrammar(String text)
            throws IOException {

        JLanguageTool tool =
                new JLanguageTool(
                        new AmericanEnglish());

        List<RuleMatch> matches =
                tool.check(text);

        return matches.stream()
                .map(match ->
                        new GrammarIssue(
                                match.getMessage(),
                                match.getSuggestedReplacements()
                        ))
                .toList();
    }
}