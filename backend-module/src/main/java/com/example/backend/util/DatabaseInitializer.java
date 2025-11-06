package com.example.backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
public class DatabaseInitializer implements ApplicationRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Map<String, TableData> TABLE_INITIALIZERS = new HashMap<>();

    static {
        TABLE_INITIALIZERS.put("beneficio", new TableData(2 , "sql/seed.sql"));
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        TABLE_INITIALIZERS.forEach((table, data) -> {
            try {
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
                System.out.println("Tabela '" + table + "' - registros encontrados: " + count);
                if (count == null || count < data.getExpectedCount()) {
                    Resource resource = new ClassPathResource(data.getScriptPath());
                    String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
                    jdbcTemplate.execute(sql);
                    System.out.println("Dados inseridos na tabela '" + table + "'.");
                } else {
                    System.out.println("Tabela '" + table + "' já contém os dados esperados.");
                }
            } catch (Exception e) {
                System.err.println("Erro na inicialização da tabela " + table + ": " + e.getMessage());
            }
        });
    }

    private static class TableData {
        private final int expectedCount;
        private final String scriptPath;

        public TableData(int expectedCount, String scriptPath) {
            this.expectedCount = expectedCount;
            this.scriptPath = scriptPath;
        }

        public int getExpectedCount() {
            return expectedCount;
        }

        public String getScriptPath() {
            return scriptPath;
        }
    }
}
