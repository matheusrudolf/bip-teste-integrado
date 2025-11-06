package com.example.backend.domain.specification;

import com.example.backend.model.entidades.Beneficio;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class BeneficioSpecification {

    public static Specification<Beneficio> hasNome(String nome) {
        return (root, query, cb) ->
                nome == null || nome.isBlank()
                        ? null
                        : cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
    }

    public static Specification<Beneficio> hasDescricao(String descricao) {
        return (root, query, cb) ->
                descricao == null || descricao.isBlank()
                        ? null
                        : cb.like(cb.lower(root.get("descricao")), "%" + descricao.toLowerCase() + "%");
    }

    public static Specification<Beneficio> hasValor(BigDecimal valor) {
        return (root, query, cb) ->
                valor == null ? null : cb.equal(root.get("valor"), valor);
    }

    public static Specification<Beneficio> isAtivo(Boolean ativo) {
        return (root, query, cb) ->
                ativo == null ? null : cb.equal(root.get("ativo"), ativo);
    }

    public static Specification<Beneficio> globalSearch(String search) {
        if (search == null || search.isBlank()) return null;

        return (root, query, cb) -> {
            String pattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("nome")), pattern),
                    cb.like(cb.lower(root.get("descricao")), pattern)
            );
        };
    }

}
