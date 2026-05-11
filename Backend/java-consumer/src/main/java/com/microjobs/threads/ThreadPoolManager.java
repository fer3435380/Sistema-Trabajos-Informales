package com.microjobs.threads;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.github.cdimascio.dotenv.Dotenv;

public class ThreadPoolManager {

    private static final Logger logger = LoggerFactory.getLogger(ThreadPoolManager.class);

    private final ExecutorService executorService;
    private final AtomicInteger activeTaskCount = new AtomicInteger(0);
    private final Semaphore semaphore;

    public ThreadPoolManager() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        int poolSize = Integer.parseInt(dotenv.get("THREAD_POOL_SIZE", "10"));

        this.executorService = Executors.newVirtualThreadPerTaskExecutor();
        this.semaphore = new Semaphore(poolSize);

        logger.info(
                "ThreadPoolManager iniciado con Virtual Threads (Java 21) | concurrencia_maxima={}",
                poolSize
        );
    }

    public void submit(Runnable task) {
        executorService.submit(() -> {
            boolean acquired = false;
            try {
                semaphore.acquire();
                acquired = true;

                int activeTasks = activeTaskCount.incrementAndGet();
                String threadName = Thread.currentThread().getName();

                logger.info(
                        "Hilo [{}] inicio tarea | tareas_activas={}",
                        threadName,
                        activeTasks
                );

                task.run();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                logger.error("Hilo interrumpido esperando cupo en el pool: {}", e.getMessage(), e);
            } catch (Exception e) {
                logger.error("Error ejecutando tarea: {}", e.getMessage(), e);
            } finally {
                if (acquired) {
                    int remainingTasks = activeTaskCount.decrementAndGet();
                    semaphore.release();

                    logger.info(
                            "Hilo [{}] finalizo tarea | tareas_activas={}",
                            Thread.currentThread().getName(),
                            remainingTasks
                    );
                }
            }
        });
    }

    public int getActiveTasks() {
        return activeTaskCount.get();
    }

    public boolean isActive() {
        return !executorService.isShutdown();
    }

    public void shutdown() {
        logger.info("Deteniendo ThreadPoolManager | tareas_activas={}", activeTaskCount.get());
        executorService.shutdown();

        try {
            if (!executorService.awaitTermination(30, TimeUnit.SECONDS)) {
                logger.warn("Algunas tareas no terminaron en 30s. Se forzara el apagado.");
                executorService.shutdownNow();

                if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                    logger.error("El pool no pudo detenerse por completo.");
                }
            } else {
                logger.info("ThreadPoolManager detenido correctamente.");
            }
        } catch (InterruptedException e) {
            logger.error("Apagado interrumpido: {}", e.getMessage(), e);
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
