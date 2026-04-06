package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Notice;
import com.athukorala.inventory_system.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    @Autowired
    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 🔹 GET ALL (ADMIN)
    @GetMapping("/all")
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // 🔹 STAFF NOTICE
    @PostMapping("/staff")
    public Notice postStaffNotice(@RequestBody Notice notice) {
        notice.setTargetRole("STAFF");
        notice.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    @GetMapping("/staff")
    public List<Notice> getStaffNotices() {
        return noticeRepository.findAll().stream()
                .filter(n -> "STAFF".equals(n.getTargetRole()))
                .collect(Collectors.toList());
    }

    // 🔥 CUSTOMER PROMOTION
    @PostMapping("/publish")
    public Notice publishPromotion(@RequestBody Notice notice) {
        notice.setTargetRole("CUSTOMER");
        notice.setCreatedAt(LocalDateTime.now());
        notice.setActive(true);
        return noticeRepository.save(notice);
    }

    @GetMapping("/customer")
    public List<Notice> getCustomerNotices() {
        return noticeRepository.findAll().stream()
                .filter(n -> "CUSTOMER".equals(n.getTargetRole()) && n.isActive())
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public void deleteNotice(@PathVariable Long id) {
        noticeRepository.deleteById(id);
    }

    // 🔹 UPDATE
    @PutMapping("/{id}")
    public Notice updateNotice(@PathVariable Long id, @RequestBody Notice updatedNotice) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        notice.setTitle(updatedNotice.getTitle());
        notice.setMessage(updatedNotice.getMessage());
        notice.setStartDate(updatedNotice.getStartDate());
        notice.setExpiryDate(updatedNotice.getExpiryDate());
        notice.setUrgent(updatedNotice.isUrgent());
        notice.setActive(updatedNotice.isActive());
        notice.setImageUrl(updatedNotice.getImageUrl());

        return noticeRepository.save(notice);
    }
}