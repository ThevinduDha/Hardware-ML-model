package com.athukorala.inventory_system.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String phone;
    private String address;
    private String profilePic;
}