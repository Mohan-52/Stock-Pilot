package com.mohan.stock_pilot.auth.repository;

import com.mohan.stock_pilot.auth.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RolesRepository extends JpaRepository<Roles, UUID> {
}
