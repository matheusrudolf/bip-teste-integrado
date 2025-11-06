package com.example.backend.domain.specification;

import com.example.backend.domain.repository.BeneficiosRepository;
import com.example.backend.model.entidades.Beneficio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class BeneficioSpecificationTest {

    @Autowired
    private BeneficiosRepository repository;

    @BeforeEach
    void setup() {
        repository.deleteAll();

        Beneficio b1 = new Beneficio();
        b1.setNome("Beneficio Teste A");
        b1.setDescricao("Descricao Teste A");
        b1.setValor(BigDecimal.valueOf(500.00));
        b1.setAtivo(true);
        repository.save(b1);

        Beneficio b2 = new Beneficio();
        b2.setNome("Beneficio Teste B");
        b2.setDescricao("Descricao Teste B");
        b2.setValor(BigDecimal.valueOf(200.00));
        b2.setAtivo(true);
        repository.save(b2);

        Beneficio b3 = new Beneficio();
        b3.setNome("Beneficio Teste C");
        b3.setDescricao("Descricao Teste C");
        b3.setValor(BigDecimal.valueOf(300.00));
        b3.setAtivo(false);
        repository.save(b3);
    }

    @Test
    @DisplayName("Deve filtrar por nome contendo parte do texto (case-insensitive)")
    void deveFiltrarPorNome() {
        Specification<Beneficio> spec = BeneficioSpecification.hasNome("A");
        List<Beneficio> result = repository.findAll(spec);

        assertEquals(1, result.size());
        assertEquals("Beneficio Teste A", result.get(0).getNome());
    }

    @Test
    @DisplayName("Deve retornar todos quando o nome é nulo")
    void deveRetornarTodosQuandoNomeNulo() {
        Specification<Beneficio> spec = BeneficioSpecification.hasNome(null);
        List<Beneficio> result = repository.findAll(spec);

        assertEquals(3, result.size());
    }

    @Test
    @DisplayName("Deve filtrar por descrição")
    void deveFiltrarPorDescricao() {
        Specification<Beneficio> spec = BeneficioSpecification.hasDescricao("Descricao Teste B");
        List<Beneficio> result = repository.findAll(spec);

        assertEquals(1, result.size());
        assertEquals("Beneficio Teste B", result.get(0).getNome());
    }

    @Test
    @DisplayName("Deve filtrar por valor exato")
    void deveFiltrarPorValor() {
        Specification<Beneficio> spec = BeneficioSpecification.hasValor(BigDecimal.valueOf(300.00));
        List<Beneficio> result = repository.findAll(spec);

        assertEquals(1, result.size());
        assertEquals("Beneficio Teste C", result.get(0).getNome());
    }

    @Test
    @DisplayName("Deve filtrar apenas benefícios ativos")
    void deveFiltrarPorAtivo() {
        Specification<Beneficio> spec = BeneficioSpecification.isAtivo(true);
        List<Beneficio> result = repository.findAll(spec);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(Beneficio::getAtivo));
    }

    @Test
    @DisplayName("Deve fazer busca global em nome e descrição")
    void deveBuscarPorGlobalSearch() {
        Specification<Beneficio> spec = BeneficioSpecification.globalSearch("Descricao Teste B");
        List<Beneficio> result = repository.findAll(spec);

        assertEquals(1, result.size());
        assertEquals("Beneficio Teste B", result.get(0).getNome());
    }

    @Test
    @DisplayName("Deve retornar todos quando globalSearch é nulo")
    void deveRetornarTodosQuandoGlobalSearchNulo() {
        Specification<Beneficio> spec = BeneficioSpecification.globalSearch(null);
        List<Beneficio> result = repository.findAll(spec);

        assertEquals(3, result.size());
    }
}
