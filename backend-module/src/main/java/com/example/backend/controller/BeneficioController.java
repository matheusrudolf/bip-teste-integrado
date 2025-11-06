package com.example.backend.controller;

import com.example.backend.exception.DuplicateException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.dto.BeneficioDTO;
import com.example.backend.model.entidades.Beneficio;
import com.example.backend.service.BeneficioService;
import com.example.backend.util.ApiGenericResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/beneficios")
@AllArgsConstructor
public class BeneficioController {

    private final BeneficioService service;

    @GetMapping
    @Operation(summary = "Obter todos Beneficios",
            description = "Retorna sem paginação")
    public ResponseEntity<ApiGenericResponse<List<BeneficioDTO>>> listarTodos() {
        List<BeneficioDTO> lista = service.listarTodos();
        return ResponseEntity.ok(new ApiGenericResponse<>(true,
                "Beneficios consultados com sucesso!",
                lista));
    }

    @Operation(summary = "Obter Beneficios paginados",
            description = "Obter Beneficios paginados")
    @ApiResponse(responseCode = "200",
            description = "Beneficios recuperados com paginação",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Page.class)))
    @GetMapping("/pageable")
    public ResponseEntity<Page<Beneficio>> listarPaginado(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String descricao,
            @RequestParam(required = false) BigDecimal valor,
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Beneficio> listaPaginada = service.listarPaginado(nome, descricao, valor, ativo, search, page, size);
        return ResponseEntity.ok(listaPaginada);
    }

    @Operation(summary = "Criar novo Beneficio",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Beneficio criado com sucesso",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Beneficio já existe ou dados inválidos",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Erro interno no servidor",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class)))
            })
    @PostMapping
    public ResponseEntity<ApiGenericResponse<BeneficioDTO>> insereBeneficio(
            @RequestBody @Valid BeneficioDTO beneficioDTO) {
        try {
            BeneficioDTO beneficioInserido = service.inserirBeneficio(beneficioDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiGenericResponse<>(true, "Beneficio inserido com sucesso!", beneficioInserido));
        } catch (DuplicateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiGenericResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiGenericResponse<>(false, "Erro interno ao tentar inserir um beneficio.", null));
        }
    }

    @Operation(summary = "Alterar beneficios existente",
            parameters = {
                    @Parameter(name = "id", description = "ID do beneficio a ser atualizado", required = true)
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Beneficio atualizado com sucesso",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos ou duplicidade",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Beneficio não encontrado",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Erro interno no servidor",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class)))
            })
    @PutMapping("/{id}")
    public ResponseEntity<ApiGenericResponse<BeneficioDTO>> alteraBeneficio(
            @PathVariable Long id,
            @RequestBody @Valid BeneficioDTO beneficioDTO) {
        try {
            BeneficioDTO beneficioAtualizado = service.atualizarBeneficio(id, beneficioDTO);
            return ResponseEntity.ok(new ApiGenericResponse<>(true, "Beneficio alterado com sucesso!", beneficioAtualizado));
        } catch (EntityNotFoundException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiGenericResponse<>(false, e.getMessage(), null));
        } catch (DuplicateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiGenericResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiGenericResponse<>(false, "Erro interno ao tentar alterar um beneficio.", null));
        }
    }

    @Operation(summary = "Excluir beneficio por ID",
            parameters = {
                    @Parameter(name = "id", description = "ID do beneficio a ser excluído", required = true)
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Beneficio deletado com sucesso",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "400", description = "O beneficio não pode ser excluído",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Beneficio não encontrado",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Erro interno no servidor",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class)))
            })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiGenericResponse<Void>> excluirBeneficio(@PathVariable Long id) {
        try {
            service.excluirBeneficio(id);
            return ResponseEntity.ok(new ApiGenericResponse<>(true, "Beneficio excluido com sucesso!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiGenericResponse<>(false, e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiGenericResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiGenericResponse<>(false, "Erro interno ao tentar excluir um beneficio.", null));
        }
    }

    @Operation(summary = "Transferência de saldos entre beneficios",
            parameters = {
                    @Parameter(name = "fromId", description = "ID do beneficio origem", required = true),
                    @Parameter(name = "toId", description = "ID do beneficio destino", required = true),
                    @Parameter(name = "amount", description = "Valor para transferência", required = true),
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Transferência executada com sucesso",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Transferência não pode ser executada",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Beneficio de origem ou destino não encontrada ou inativo",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Erro interno no servidor",
                            content = @Content(schema = @Schema(implementation = ApiGenericResponse.class)))
            })
    @PutMapping("/transfer")
    public ResponseEntity<ApiGenericResponse<Void>> transferBeneficio(
            @RequestParam Long fromId,
            @RequestParam Long toId,
            @RequestParam BigDecimal amount) {
        try {
            service.transfer(fromId, toId, amount);
            return ResponseEntity.ok(new ApiGenericResponse<>(true, "Transferência executada com sucesso!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiGenericResponse<>(false, e.getMessage(), null));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiGenericResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiGenericResponse<>(false, "Erro interno ao tentar transferir saldo de um beneficio.", null));
        }
    }
}
