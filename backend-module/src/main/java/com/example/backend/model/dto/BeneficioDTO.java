package com.example.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO para tabela de Beneficio")
public class BeneficioDTO {

    private Long id;

    @NotBlank(message = "Campo nome é obrigatório")
    @Schema(description = "Nome do beneficio", example = "Beneficio Teste")
    private String nome;

    @NotBlank(message = "Campo descrição é obrigatório")
    @Schema(description = "Descrição do beneficio", example = "Descrição Teste")
    private String descricao;

    @NotNull(message = "O campo valor é obrigatório")
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
    @Schema(description = "Valor do beneficio", example = "100")
    private BigDecimal valor;

    private Boolean ativo;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long version;
}