package com.example.backend.domain.repository;

import com.example.backend.model.entidades.Beneficio;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class BeneficioRepositoryTest {

    @Autowired
    private BeneficiosRepository repository;

    /**
     * Cria um objeto Beneficio (não salva automaticamente no banco)
     */
    private Beneficio criarBeneficio(String nome, String descricao, boolean ativo) {
        Beneficio b = new Beneficio();
        b.setNome(nome);
        b.setDescricao(descricao);
        b.setValor(BigDecimal.valueOf(150.00));
        b.setAtivo(ativo);
        b.setVersion(0L);
        return b;
    }

    @Test
    @DisplayName("Deve salvar um beneficio com sucesso")
    void deveSalvarBeneficio() {
        Beneficio b = criarBeneficio("Beneficio Teste B", "Descricao Teste B", true);
        Beneficio salvo = repository.save(b);

        assertNotNull(salvo.getId());
        assertEquals("Beneficio Teste B", salvo.getNome());
    }

    @Test
    @DisplayName("Deve verificar existência de beneficio pelo nome")
    void deveVerificarExistenciaPorNome() {
        Beneficio b = criarBeneficio("Beneficio Teste C", "Descricao Teste C", true);
        repository.save(b);

        boolean existe = repository.existsByNome("Beneficio Teste C");

        assertTrue(existe);
    }

    @Test
    @DisplayName("Deve retornar falso para nome inexistente")
    void deveRetornarFalsoParaNomeInexistente() {
        boolean existe = repository.existsByNome("Inexistente");
        assertFalse(existe);
    }

    @Test
    @DisplayName("Deve buscar beneficio ativo por ID")
    void deveBuscarBeneficioAtivoPorId() {
        Beneficio b = criarBeneficio("Beneficio Teste D", "Descricao Teste D", true);
        Beneficio salvo = repository.save(b);

        Optional<Beneficio> resultado = repository.findByIdAndAtivoTrue(salvo.getId());

        assertTrue(resultado.isPresent());
        resultado.ifPresent(ben -> assertEquals("Beneficio Teste D", ben.getNome()));
    }

    @Test
    @DisplayName("Deve verificar existência por nome, ID diferente e ativo = true")
    void deveVerificarExistenciaPorNomeAndIdNotAndAtivoTrue() {
        Beneficio b1 = criarBeneficio("Beneficio Teste E", "Descricao Teste E", true);
        Beneficio b2 = criarBeneficio("Beneficio Teste F", "Descricao Teste F", true);

        repository.save(b1);
        Beneficio salvoB2 = repository.save(b2);

        boolean existe = repository.existsByNomeAndIdNotAndAtivoTrue("Beneficio Teste E", salvoB2.getId());

        assertTrue(existe);
    }

    @Test
    @DisplayName("Deve aplicar lock pessimista na busca por ID ativo")
    void deveAplicarLockPesimista() {
        Beneficio b = criarBeneficio("Beneficio Teste G", "Descricao Teste G", true);
        Beneficio salvo = repository.save(b);

        Optional<Beneficio> bloqueado = repository.findByIdAndAtivoTrueForUpdate(salvo.getId());

        assertTrue(bloqueado.isPresent());
        bloqueado.ifPresent(ben -> assertEquals("Beneficio Teste G", ben.getNome()));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar salvar nome nulo (violação de integridade)")
    void deveLancarExcecaoQuandoNomeForNulo() {
        Beneficio b = new Beneficio();
        b.setDescricao("Sem nome");
        b.setValor(BigDecimal.valueOf(50.00));
        b.setAtivo(true);

        assertThrows(DataIntegrityViolationException.class, () -> repository.saveAndFlush(b));
    }

}
