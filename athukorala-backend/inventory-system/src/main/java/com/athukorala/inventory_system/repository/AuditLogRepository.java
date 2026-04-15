package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // 🔥 Default (latest first)
    List<AuditLog> findAllByOrderByTimestampDesc();

    // 🔥 Date filter
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime start,
            LocalDateTime end
    );

    // 🔥 Type filter (based on action name)
    List<AuditLog> findByActionContainingIgnoreCaseOrderByTimestampDesc(
            String action
    );

    // 🔥 Combined filter (date + type)
    List<AuditLog> findByActionContainingIgnoreCaseAndTimestampBetweenOrderByTimestampDesc(
            String action,
            LocalDateTime start,
            LocalDateTime end
    );
}