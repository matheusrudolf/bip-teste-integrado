package com.example.backend.service;

import com.example.backend.domain.specification.BeneficioSpecification;
import com.example.backend.exception.DuplicateException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.dto.BeneficioDTO;
import com.example.backend.model.entidades.Beneficio;
import com.example.backend.domain.repository.BeneficiosRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BeneficioService {

    private final BeneficiosRepository repository;

    public BeneficioService(BeneficiosRepository repository) {
        this.repository = repository;
    }

    public List<BeneficioDTO> listarTodos() {
        List<Beneficio> beneficio = repository.findAll();
        return beneficio.stream().map(this::convertToDTO).toList();
    }

    public Page<Beneficio> listarPaginado(
            String nome,
            String descricao,
            BigDecimal valor,
            Boolean ativo,
            String search,
            int page,
            int size
    ) {
        Specification<Beneficio> spec = Specification
                .where(BeneficioSpecification.hasNome(nome))
                .and(BeneficioSpecification.hasDescricao(descricao))
                .and(BeneficioSpecification.hasValor(valor))
                .and(BeneficioSpecification.isAtivo(ativo))
                .and(BeneficioSpecification.globalSearch(search));

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return repository.findAll(spec, pageable);
    }

    @Transactional
    public BeneficioDTO inserirBeneficio(BeneficioDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new DuplicateException("Já existe um benefício cadastrado com esse nome.");
        }

        Beneficio beneficio = convertToEntity(dto);
        beneficio = repository.save(beneficio);

        return convertToDTO(beneficio);
    }

    @Transactional
    public BeneficioDTO atualizarBeneficio(Long id, BeneficioDTO dto) {
        Beneficio existente = repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio não encontrado ou inativo."));

        if (repository.existsByNomeAndIdNotAndAtivoTrue(dto.getNome(), id)) {
            throw new DuplicateException("Já existe um beneficio cadastrado com esse nome.");
        }

        existente.setNome(dto.getNome());
        existente.setDescricao(dto.getDescricao());
        existente.setValor(dto.getValor());
        existente.setAtivo(dto.getAtivo());

        Beneficio beneficioAtualizado = repository.save(existente);
        return convertToDTO(beneficioAtualizado);
    }

    @Transactional
    public void excluirBeneficio(Long id) {
        Beneficio beneficio = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefício não encontrado!"));;

        repository.delete(beneficio);
    }

    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("Não é possível transferir par o mesmo benefício.");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da transferência deve ser maior que zero.");
        }

        Beneficio from = repository.findByIdAndAtivoTrueForUpdate(fromId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio de origem não encontrada ou inativo."));

        Beneficio to = repository.findByIdAndAtivoTrueForUpdate(toId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio de destino não encontrada ou inativo."));

        if (from.getValor().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente no benefício de origem.");
        }

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        repository.save(from);
        repository.save(to);
    }

    private BeneficioDTO convertToDTO(Beneficio beneficio) {
        BeneficioDTO dto = new BeneficioDTO();

        dto.setId(beneficio.getId());
        dto.setNome(beneficio.getNome());
        dto.setDescricao(beneficio.getDescricao());
        dto.setValor(beneficio.getValor());
        dto.setAtivo(beneficio.getAtivo());
        dto.setVersion(beneficio.getVersion());

        return dto;
    }

    private Beneficio convertToEntity(BeneficioDTO dto) {
        Beneficio beneficio = new Beneficio();

        beneficio.setId(dto.getId());
        beneficio.setNome(dto.getNome());
        beneficio.setDescricao(dto.getDescricao());
        beneficio.setValor(dto.getValor());
        beneficio.setAtivo(dto.getAtivo());

        return beneficio;
    }
}
