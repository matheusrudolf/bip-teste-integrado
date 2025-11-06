package com.example.backend.service;

import com.example.backend.domain.repository.BeneficiosRepository;
import com.example.backend.exception.DuplicateException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.dto.BeneficioDTO;
import com.example.backend.model.entidades.Beneficio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class BeneficioServiceTest {

    @Mock
    private BeneficiosRepository repository;

    @InjectMocks
    private BeneficioService service;

    private Beneficio beneficioBase1;
    private Beneficio beneficioBase2;
    private BeneficioDTO beneficioDTOBase;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        beneficioBase1 = new Beneficio(1L, "Beneficio Teste A", "Descricao Teste A", BigDecimal.valueOf(100.00), true, 0L);
        beneficioBase2 = new Beneficio(2L, "Beneficio Teste B", "Descricao Teste B", BigDecimal.valueOf(200.00), true, 0L);

        beneficioDTOBase = new BeneficioDTO();
        beneficioDTOBase.setId(1L);
        beneficioDTOBase.setNome("Beneficio Teste A");
        beneficioDTOBase.setDescricao("Descricao Teste A");
        beneficioDTOBase.setValor(BigDecimal.valueOf(100.00));
        beneficioDTOBase.setAtivo(true);
        beneficioDTOBase.setVersion(0L);
    }

    @Test
    void deveListarTodosOsBeneficios() {
        when(repository.findAll()).thenReturn(List.of(beneficioBase1, beneficioBase2));

        var result = service.listarTodos();

        assertEquals(2, result.size());
        assertEquals("Beneficio Teste A", result.get(0).getNome());
        assertEquals("Beneficio Teste B", result.get(1).getNome());
        verify(repository, times(1)).findAll();
    }

    @Test
    void deveListarBeneficiosPaginados() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
        Page<Beneficio> pageMock = new PageImpl<>(List.of(beneficioBase1, beneficioBase2));

        when(repository.findAll(any(Specification.class), eq(pageable))).thenReturn(pageMock);

        var result = service.listarPaginado(null, null, null, null, null, 0, 10);

        assertEquals(2, result.getTotalElements());
        verify(repository, times(1)).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    void deveInserirBeneficioComSucesso() {
        when(repository.existsByNome(anyString())).thenReturn(false);
        when(repository.save(any(Beneficio.class))).thenReturn(beneficioBase1);

        var result = service.inserirBeneficio(beneficioDTOBase);

        assertEquals("Beneficio Teste A", result.getNome());
        verify(repository, times(1)).save(any(Beneficio.class));
    }

    @Test
    void deveLancarExcecaoAoInserirBeneficioDuplicado() {
        when(repository.existsByNome(anyString())).thenReturn(true);

        assertThrows(DuplicateException.class, () -> service.inserirBeneficio(beneficioDTOBase));
        verify(repository, never()).save(any());
    }

    @Test
    void deveAtualizarBeneficioComSucesso() {
        when(repository.findByIdAndAtivoTrue(1L)).thenReturn(Optional.of(beneficioBase1));
        when(repository.existsByNomeAndIdNotAndAtivoTrue(anyString(), anyLong())).thenReturn(false);
        when(repository.save(any(Beneficio.class))).thenReturn(beneficioBase1);

        var result = service.atualizarBeneficio(1L, beneficioDTOBase);

        assertEquals("Beneficio Teste A", result.getNome());
        verify(repository).save(any(Beneficio.class));
    }

    @Test
    void deveLancarExcecaoAoAtualizarBeneficioInexistente() {
        when(repository.findByIdAndAtivoTrue(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.atualizarBeneficio(1L, beneficioDTOBase));
    }

    @Test
    void deveLancarExcecaoAtualizarComNomeDuplicado() {
        when(repository.findByIdAndAtivoTrue(1L)).thenReturn(Optional.of(beneficioBase1));
        when(repository.existsByNomeAndIdNotAndAtivoTrue(anyString(), anyLong())).thenReturn(true);

        assertThrows(DuplicateException.class, () -> service.atualizarBeneficio(1L, beneficioDTOBase));
    }

    @Test
    void deveLancarExcecaoAoExcluirBeneficioInexistente() {
        when(repository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.excluirBeneficio(1L));
        verify(repository, never()).delete(any(Beneficio.class));
    }

    @Test
    void deveTransferirComSucesso() {
        Beneficio origem = new Beneficio(1L, "Origem", "Teste", BigDecimal.valueOf(200.00), true, 0L);
        Beneficio destino = new Beneficio(2L, "Destino", "Teste", BigDecimal.valueOf(100.00), true, 0L);

        when(repository.findByIdAndAtivoTrueForUpdate(1L)).thenReturn(Optional.of(origem));
        when(repository.findByIdAndAtivoTrueForUpdate(2L)).thenReturn(Optional.of(destino));

        service.transfer(1L, 2L, BigDecimal.valueOf(50.00));

        assertEquals(BigDecimal.valueOf(150.00), origem.getValor());
        assertEquals(BigDecimal.valueOf(150.00), destino.getValor());
        verify(repository, times(2)).save(any(Beneficio.class));
    }

    @Test
    void deveLancarErroAoTransferirParaMesmoBeneficio() {
        assertThrows(IllegalArgumentException.class,
                () -> service.transfer(1L, 1L, BigDecimal.valueOf(50)));
    }

    @Test
    void deveLancarErroSeValorTransferenciaInvalido() {
        assertThrows(IllegalArgumentException.class,
                () -> service.transfer(1L, 2L, BigDecimal.ZERO));
    }

    @Test
    void deveLancarErroSeBeneficioOrigemNaoEncontrado() {
        when(repository.findByIdAndAtivoTrueForUpdate(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.transfer(1L, 2L, BigDecimal.valueOf(10.00)));
    }

    @Test
    void deveLancarErroSeSaldoInsuficiente() {
        Beneficio origem = new Beneficio(1L, "Origem", "Teste", BigDecimal.valueOf(10.00), true, 0L);
        Beneficio destino = new Beneficio(2L, "Destino", "Teste", BigDecimal.valueOf(100.00), true, 0L);

        when(repository.findByIdAndAtivoTrueForUpdate(1L)).thenReturn(Optional.of(origem));
        when(repository.findByIdAndAtivoTrueForUpdate(2L)).thenReturn(Optional.of(destino));

        assertThrows(IllegalArgumentException.class,
                () -> service.transfer(1L, 2L, BigDecimal.valueOf(50)));
    }
}
