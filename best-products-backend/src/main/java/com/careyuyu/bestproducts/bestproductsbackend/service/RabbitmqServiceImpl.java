package com.careyuyu.bestproducts.bestproductsbackend.service;


import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

@Service
public class RabbitmqServiceImpl implements RabbitmqService{
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Override
    public void sendMessage(String message) {
        rabbitTemplate.convertAndSend("testExchange", "testRouting", message);
    }
}
