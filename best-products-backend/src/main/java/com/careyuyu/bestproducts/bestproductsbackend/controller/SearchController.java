package com.careyuyu.bestproducts.bestproductsbackend.controller;

import com.careyuyu.bestproducts.bestproductsbackend.service.RabbitmqService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SearchController {

    @Autowired
    private RabbitmqService rabbitmqService;
    @GetMapping("/test/{message}")
    public void test(@PathVariable String message) {
        rabbitmqService.sendMessage(message);
    }
}
