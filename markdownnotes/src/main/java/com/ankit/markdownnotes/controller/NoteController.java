package com.ankit.markdownnotes.controller;

import com.ankit.markdownnotes.dto.note.*;
import com.ankit.markdownnotes.entity.Note;
import com.ankit.markdownnotes.service.GrammarService;
import com.ankit.markdownnotes.service.MarkdownService;
import com.ankit.markdownnotes.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;
    private final GrammarService grammarService;
    private final MarkdownService markdownService;

    @PostMapping
    public Note createNote(
            @RequestBody NoteRequest request) {

        return noteService.saveNote(request);
    }

    @PostMapping("/upload")
    public UploadResponse uploadMarkdown(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        String content = new String(
                file.getBytes(),
                StandardCharsets.UTF_8
        );

        return new UploadResponse(
                file.getOriginalFilename(),
                content
        );
    }
    @PostMapping("/grammar")
    public List<GrammarIssue> checkGrammar(
            @RequestBody GrammarRequest request)
            throws IOException {

        return grammarService.checkGrammar(
                request.getText()
        );
    }

    @PostMapping("/render")
    public String renderMarkdown(
            @RequestBody String markdown) {

        return markdownService
                .renderMarkdown(markdown);
    }
    @GetMapping("/test-user")
    public String testUser() {

        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }
    @GetMapping
    public List<NoteResponse> getMyNotes() {
        return noteService.getMyNotes();
    }
    @GetMapping("/{id}")
    public NoteResponse getNote(
            @PathVariable Long id) {

        return noteService.getNote(id);
    }
    @PutMapping("/{id}")
    public NoteResponse updateNote(
            @PathVariable Long id,
            @RequestBody NoteRequest request) {

        return noteService.updateNote(
                id,
                request
        );
    }
    @DeleteMapping("/{id}")
    public String deleteNote(
            @PathVariable Long id) {

        noteService.deleteNote(id);

        return "Note Deleted Successfully";
    }
}