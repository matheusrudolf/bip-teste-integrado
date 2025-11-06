package com.example.backend.controller;

import com.example.backend.exception.DuplicateException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.dto.BeneficioDTO;
import com.example.backend.model.entidades.Beneficio;
import com.example.backend.service.BeneficioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BeneficioController.class)
@ActiveProfiles("test")
@WithMockUser
class BeneficioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BeneficioService service;

    @Autowired
    private ObjectMapper objectMapper;

    private BeneficioDTO dto;

    @BeforeEach
    void setup() {
        dto = new BeneficioDTO(1L, "Beneficio Teste", "Descricao Teste", BigDecimal.valueOf(100.00), true, 0L);
    }

    @Test
    @DisplayName("Deve listar todos os benefícios com sucesso")
    void deveListarTodosOsBeneficios() throws Exception {
        when(service.listarTodos()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/beneficios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sucesso").value(true))
                .andExpect(jsonPath("$.dados[0].nome").value("Beneficio Teste"))
                .andExpect(jsonPath("$.dados[0].ativo").value(true));
    }

    @Test
    @DisplayName("Deve listar benefícios paginados")
    void deveListarPaginado() throws Exception {
        Beneficio b = new Beneficio();
        b.setId(1L);
        b.setNome("Teste A");
        b.setDescricao("Desc A");
        b.setValor(BigDecimal.valueOf(10));
        b.setAtivo(true);

        Page<Beneficio> page = new PageImpl<>(List.of(b), PageRequest.of(0, 10), 1);

        when(service.listarPaginado(any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(page);

        mockMvc.perform(get("/api/v1/beneficios/pageable"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].nome").value("Teste A"))
                .andExpect(jsonPath("$.content[0].ativo").value(true));
    }

    @Test
    @DisplayName("Deve inserir benefício com sucesso")
    void deveInserirBeneficio() throws Exception {
        when(service.inserirBeneficio(any(BeneficioDTO.class))).thenReturn(dto);

        mockMvc.perform(post("/api/v1/beneficios")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sucesso").value(true))
                .andExpect(jsonPath("$.dados.nome").value("Beneficio Teste"))
                .andExpect(jsonPath("$.dados.ativo").value(true));
    }

    @Test
    @DisplayName("Deve retornar 400 ao tentar inserir benefício duplicado")
    void deveFalharAoInserirDuplicado() throws Exception {
        when(service.inserirBeneficio(any())).thenThrow(new DuplicateException("Benefício já existe!"));

        mockMvc.perform(post("/api/v1/beneficios")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem").value("Benefício já existe!"));
    }

    @Test
    @DisplayName("Deve retornar 500 ao tentar inserir benefício com erro inesperado")
    void deveRetornar500AoInserirErroInterno() throws Exception {
        when(service.inserirBeneficio(any())).thenThrow(new RuntimeException("Erro inesperado no serviço"));

        mockMvc.perform(post("/api/v1/beneficios")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem")
                        .value("Erro interno ao tentar inserir um beneficio."));
    }

    @Test
    @DisplayName("Deve atualizar benefício com sucesso")
    void deveAtualizarBeneficio() throws Exception {
        when(service.atualizarBeneficio(eq(1L), any())).thenReturn(dto);

        mockMvc.perform(put("/api/v1/beneficios/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sucesso").value(true))
                .andExpect(jsonPath("$.dados.nome").value("Beneficio Teste"))
                .andExpect(jsonPath("$.dados.ativo").value(true));
    }

    @Test
    @DisplayName("Deve retornar 404 ao atualizar benefício inexistente")
    void deveFalharAoAtualizarInexistente() throws Exception {
        when(service.atualizarBeneficio(eq(99L), any()))
                .thenThrow(new ResourceNotFoundException("Benefício não encontrado!"));

        mockMvc.perform(put("/api/v1/beneficios/99")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem").value("Benefício não encontrado!"))
                .andExpect(jsonPath("$.dados").isEmpty());
    }

    @Test
    @DisplayName("Deve retornar 500 ao atualizar benefício com erro inesperado")
    void deveRetornar500AoAtualizarErroInterno() throws Exception {
        when(service.atualizarBeneficio(eq(1L), any()))
                .thenThrow(new RuntimeException("Erro inesperado no serviço"));

        mockMvc.perform(put("/api/v1/beneficios/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem")
                        .value("Erro interno ao tentar alterar um beneficio."))
                .andExpect(jsonPath("$.dados").isEmpty());
    }

    @Test
    @DisplayName("Deve excluir benefício com sucesso")
    void deveExcluirBeneficio() throws Exception {
        doNothing().when(service).excluirBeneficio(1L);

        mockMvc.perform(delete("/api/v1/beneficios/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sucesso").value(true))
                .andExpect(jsonPath("$.mensagem").value("Beneficio excluido com sucesso!"));
    }

    @Test
    @DisplayName("Deve retornar 404 ao excluir benefício inexistente")
    void deveFalharAoExcluirInexistente() throws Exception {
        doThrow(new ResourceNotFoundException("Benefício não encontrado!"))
                .when(service).excluirBeneficio(99L);

        mockMvc.perform(delete("/api/v1/beneficios/99")
                        .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem").value("Benefício não encontrado!"))
                .andExpect(jsonPath("$.dados").isEmpty());
    }

    @Test
    @DisplayName("Deve retornar 500 ao tentar excluir benefício com erro inesperado")
    void deveRetornar500AoExcluirErroInterno() throws Exception {
        doThrow(new RuntimeException("Erro inesperado"))
                .when(service).excluirBeneficio(1L);

        mockMvc.perform(delete("/api/v1/beneficios/1")
                        .with(csrf()))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem")
                        .value("Erro interno ao tentar excluir um beneficio."))
                .andExpect(jsonPath("$.dados").isEmpty());
    }

    @Test
    @DisplayName("Deve transferir valor entre benefícios com sucesso")
    void deveTransferirBeneficio() throws Exception {
        mockMvc.perform(put("/api/v1/beneficios/transfer")
                        .with(csrf())
                        .param("fromId", "1")
                        .param("toId", "2")
                        .param("amount", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sucesso").value(true))
                .andExpect(jsonPath("$.mensagem").value("Transferência executada com sucesso!"));
    }

    @Test
    @DisplayName("Deve retornar 404 ao tentar transferir para benefício inexistente")
    void deveFalharAoTransferirInexistente() throws Exception {
        Mockito.doThrow(new ResourceNotFoundException("Benefício não encontrado!"))
                .when(service).transfer(1L, 99L, BigDecimal.valueOf(100));

        mockMvc.perform(put("/api/v1/beneficios/transfer")
                        .with(csrf())
                        .param("fromId", "1")
                        .param("toId", "99")
                        .param("amount", "100"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem").value("Benefício não encontrado!"))
                .andExpect(jsonPath("$.dados").isEmpty());
    }

    @Test
    @DisplayName("Deve retornar 500 ao tentar transferir benefício com erro inesperado")
    void deveRetornar500AoTransferirErroInterno() throws Exception {
        Mockito.doThrow(new RuntimeException("Erro inesperado"))
                .when(service).transfer(1L, 2L, BigDecimal.valueOf(100));

        mockMvc.perform(put("/api/v1/beneficios/transfer")
                        .with(csrf())
                        .param("fromId", "1")
                        .param("toId", "2")
                        .param("amount", "100"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.sucesso").value(false))
                .andExpect(jsonPath("$.mensagem")
                        .value("Erro interno ao tentar transferir saldo de um beneficio."))
                .andExpect(jsonPath("$.dados").isEmpty());
    }
}
