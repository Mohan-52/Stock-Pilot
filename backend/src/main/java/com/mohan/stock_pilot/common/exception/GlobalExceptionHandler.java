package com.mohan.stock_pilot.common.exception;

import com.mohan.stock_pilot.common.dto.ErrorResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    public ResponseEntity<ErrorResponseDto> buildErrorResponse(String path, HttpStatus status, Exception ex){
        return  ResponseEntity.status(status).body(new ErrorResponseDto(LocalDateTime.now(),status.getReasonPhrase(), path,ex.getMessage(),status.value())) ;
    }

    @ExceptionHandler(ResourceAlreadyExistsEx.class)
    public ResponseEntity<ErrorResponseDto> handleResourceAlreadyExistEx(Exception ex, HttpServletRequest request){
        return buildErrorResponse(request.getRequestURI(),HttpStatus.CONFLICT,ex);
    }

    @ExceptionHandler(ResourceNotFoundEx.class)
    public ResponseEntity<ErrorResponseDto> handleResourceNotFoundExistEx(Exception ex, HttpServletRequest request){
        return buildErrorResponse(request.getRequestURI(),HttpStatus.NOT_FOUND,ex);
    }

    @ExceptionHandler(InvalidCredentialsEx.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidCredentialsEx(Exception ex, HttpServletRequest request){
        return buildErrorResponse(request.getRequestURI(),HttpStatus.UNAUTHORIZED,ex);
    }




}
