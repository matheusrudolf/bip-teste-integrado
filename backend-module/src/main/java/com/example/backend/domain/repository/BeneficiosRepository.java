package com.example.backend.domain.repository;

import com.example.backend.model.entidades.Beneficio;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BeneficiosRepository extends JpaRepository<Beneficio, Long>, JpaSpecificationExecutor<Beneficio> {

    boolean existsByNome(String nome);

    boolean existsByNomeAndIdNotAndAtivoTrue(String nome, Long id);

    Optional<Beneficio> findByIdAndAtivoTrue(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Beneficio b where b.id = :id AND b.ativo = true")
    Optional<Beneficio> findByIdAndAtivoTrueForUpdate(@Param("id") Long id);

}
