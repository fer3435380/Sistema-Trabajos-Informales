package com.microjobs.threads;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.github.cdimascio.dotenv.Dotenv;

public class ThreadPoolManager 
{
    private static final Logger logger = LoggerFactory.getLogger(ThreadPoolManager.class);
    private final ExecutorService executorService;
    private final AtomicInteger tareasActivas = new AtomicInteger(0);
    private static final String POOL_NAME = "microjobs-worker";   

    public ThreadPoolManager() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        int poolSize = Integer.parseInt(dotenv.get("THREAD_POOL_SIZE", "10"));
        this.executorService = Executors.newVirtualThreadPerTaskExecutor();

        logger.info("ThreadPoolManager iniciado con Virtual Threads (Java 21) | " + 
            "Concurrencia configurada: {} tareas", poolSize);
    }

    public void submit(Runnable tarea) {
        tareasActivas.incrementAndGet();

        executorService.submit(() -> {
            String threadName = Thread.currentThread().getName();
            logger.debug("Hilo [{}] iniciando tarea\nTareas activas: {}",
                    threadName, tareasActivas.get());
            try {
                tarea.run();
            } catch (Exception e) {
                logger.error("Error en hilo [{}]: {}", threadName, e.getMessage(), e);
            } finally {
                int restantes = tareasActivas.decrementAndGet();
                logger.debug("Hilo [{}] terminó tarea\nTareas activas: {}",
                        threadName, restantes);
            }
        });
    }

    public int getTareasActivas() {
        return tareasActivas.get();
    }

    public boolean isActivo() {
        return !executorService.isShutdown();
    }

     public void shutdown() {
        logger.info("Apagando ThreadPoolManager...\nTareas activas: {}", tareasActivas.get());
        executorService.shutdown();

         try {
            if (!executorService.awaitTermination(30, TimeUnit.SECONDS)) {
                logger.warn("Algunas tareas no terminaron en 30s, forzando apagado...");
                executorService.shutdownNow();

                if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                    logger.error("El pool no pudo apagarse completamente.");
                }
            } else {
                logger.info("ThreadPoolManager apagado correctamente.");
            }
        } catch (InterruptedException e) {
            logger.error("Apagado interrumpido: {}", e.getMessage());
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
