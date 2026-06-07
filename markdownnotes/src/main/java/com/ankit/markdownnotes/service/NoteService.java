package com.ankit.markdownnotes.service;

import com.ankit.markdownnotes.dto.note.NoteResponse;
import com.ankit.markdownnotes.entity.User;
import com.ankit.markdownnotes.dto.note.NoteRequest;
import com.ankit.markdownnotes.entity.Note;
import com.ankit.markdownnotes.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserService userService;

    public Note saveNote(NoteRequest request) {

        User currentUser =
                userService.getCurrentUser();

        Note note = new Note();
        note.setFileName(request.getFileName());
        note.setMarkdownContent(
                request.getMarkdownContent());
        note.setCreatedAt(LocalDateTime.now());
        note.setUser(currentUser);
        return noteRepository.save(note);
    }

    public List<NoteResponse> getMyNotes() {

        User currentUser = userService.getCurrentUser();

        return noteRepository.findByUser(currentUser)
                .stream()
                .map(note -> new NoteResponse(
                        note.getId(),
                        note.getFileName(),
                        note.getMarkdownContent(),
                        note.getCreatedAt()
                ))
                .toList();
    }
    public NoteResponse getNote(Long id) {
        User currentUser =
                userService.getCurrentUser();
        Note note =
                noteRepository
                        .findByIdAndUser(
                                id,
                                currentUser
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Note not found"));

        return new NoteResponse(
                note.getId(),
                note.getFileName(),
                note.getMarkdownContent(),
                note.getCreatedAt()
        );
    }

    public NoteResponse updateNote(
            Long id,
            NoteRequest request) {

        User currentUser =
                userService.getCurrentUser();

        Note note =
                noteRepository
                        .findByIdAndUser(
                                id,
                                currentUser
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Note not found"));

        note.setFileName(
                request.getFileName());

        note.setMarkdownContent(
                request.getMarkdownContent());

        noteRepository.save(note);

        return new NoteResponse(
                note.getId(),
                note.getFileName(),
                note.getMarkdownContent(),
                note.getCreatedAt()
        );
    }
    public void deleteNote(Long id) {

        User currentUser =
                userService.getCurrentUser();

        Note note =
                noteRepository
                        .findByIdAndUser(
                                id,
                                currentUser
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Note not found"));

        noteRepository.delete(note);
    }
}