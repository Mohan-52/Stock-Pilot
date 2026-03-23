package com.mohan.stock_pilot.auth.repository;

import com.mohan.stock_pilot.auth.entity.Roles;
import com.mohan.stock_pilot.auth.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.management.relation.Role;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RolesRepository extends JpaRepository<Roles, UUID> {
    Optional<Roles> findByName(RoleType name);
}
