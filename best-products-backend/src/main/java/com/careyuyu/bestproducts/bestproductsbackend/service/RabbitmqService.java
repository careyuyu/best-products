package com.careyuyu.bestproducts.bestproductsbackend.service;

import org.springframework.stereotype.Service;

@Service
public interface RabbitmqService {
    public void sendMessage(String message);
}
