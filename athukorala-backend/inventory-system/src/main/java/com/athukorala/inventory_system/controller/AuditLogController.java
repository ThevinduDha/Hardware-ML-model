package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.AuditLog;
import com.athukorala.inventory_system.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/logs")
    public List<AuditLog> getLogs(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String range
    ) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = null;

        // 🔥 DATE FILTER LOGIC
        if (range != null) {
            switch (range) {

                case "THIS_MONTH":
                    start = now.withDayOfMonth(1)
                            .withHour(0)
                            .withMinute(0)
                            .withSecond(0);
                    break;

                case "LAST_MONTH":
                    LocalDateTime lastMonthStart = now.minusMonths(1)
                            .withDayOfMonth(1)
                            .withHour(0)
                            .withMinute(0)
                            .withSecond(0);

                    LocalDateTime lastMonthEnd = lastMonthStart
                            .withDayOfMonth(lastMonthStart.toLocalDate().lengthOfMonth())
                            .withHour(23)
                            .withMinute(59)
                            .withSecond(59);

                    start = lastMonthStart;
                    now = lastMonthEnd;
                    break;

                case "LAST_7_DAYS":
                    start = now.minusDays(7);
                    break;
            }
        }

        // 🔥 TYPE + DATE FILTER
        if (type != null && start != null) {
            return auditLogRepository
                    .findByActionContainingIgnoreCaseAndTimestampBetweenOrderByTimestampDesc(
                            type, start, now
                    );
        }

        // 🔥 TYPE ONLY
        if (type != null) {
            return auditLogRepository
                    .findByActionContainingIgnoreCaseOrderByTimestampDesc(type);
        }

        // 🔥 DATE ONLY
        if (start != null) {
            return auditLogRepository
                    .findByTimestampBetweenOrderByTimestampDesc(start, now);
        }

        // 🔥 DEFAULT (ALL)
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}