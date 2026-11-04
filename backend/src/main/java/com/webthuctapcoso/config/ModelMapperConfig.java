package com.webthuctapcoso.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        mapper.getConfiguration()
              .setSkipNullEnabled(true)
              .setAmbiguityIgnored(true); // QUAN TRỌNG

        return mapper;
    }
}
