/*
 * Copyright (c) 2024, VL53L1X Application Example for RT-Thread
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Change Logs:
 * Date           Author       Notes
 * 2024-02-10     Developer    First version
 */

#include <rtthread.h>
#include <rtdevice.h>
#include "vl53l1x.h"

#define I2C_BUS_NAME    "i2c2"

static vl53l1x_device_t vl53l1x_dev;

/**
 * @brief VL53L1X test command - performs 10 distance measurements
 * 
 * Usage: vl53l1x_test
 */
static void vl53l1x_test(int argc, char **argv)
{
    rt_err_t ret;
    rt_uint16_t distance;
    
    rt_kprintf("\n========== VL53L1X Sensor Test ==========\n");
    
    /* Initialize sensor */
    ret = vl53l1x_init(&vl53l1x_dev, I2C_BUS_NAME);
    if (ret != RT_EOK)
    {
        rt_kprintf("[ERROR] VL53L1X initialization failed!\n");
        rt_kprintf("Please check:\n");
        rt_kprintf("  1. Hardware connections (VDD, GND, SCL, SDA)\n");
        rt_kprintf("  2. I2C2 is enabled in RT-Thread configuration\n");
        rt_kprintf("  3. Sensor power supply (3.3V)\n");
        return;
    }
    
    /* Set distance mode to long range */
    vl53l1x_set_distance_mode(&vl53l1x_dev, VL53L1X_DISTANCE_MODE_LONG);
    
    /* Set timing budget to 100ms for balanced performance */
    vl53l1x_set_timing_budget(&vl53l1x_dev, VL53L1X_TIMING_BUDGET_100MS);
    
    /* Start ranging */
    ret = vl53l1x_start_ranging(&vl53l1x_dev);
    if (ret != RT_EOK)
    {
        rt_kprintf("[ERROR] Failed to start ranging!\n");
        vl53l1x_deinit(&vl53l1x_dev);
        return;
    }
    
    rt_kprintf("\nPerforming 10 distance measurements...\n");
    rt_kprintf("----------------------------------------\n");
    
    /* Read 10 measurements */
    for (int i = 0; i < 10; i++)
    {
        /* Wait for data ready */
        rt_uint32_t timeout = 200; /* 200ms timeout */
        while (!vl53l1x_data_ready(&vl53l1x_dev) && timeout > 0)
        {
            rt_thread_mdelay(10);
            timeout -= 10;
        }
        
        if (timeout == 0)
        {
            rt_kprintf("[%2d] Measurement timeout\n", i + 1);
            continue;
        }
        
        /* Get distance */
        ret = vl53l1x_get_distance(&vl53l1x_dev, &distance);
        if (ret == RT_EOK)
        {
            rt_kprintf("[%2d] Distance: %4d mm (%6.2f cm)\n", 
                       i + 1, distance, distance / 10.0);
        }
        else
        {
            rt_kprintf("[%2d] Failed to read distance\n", i + 1);
        }
        
        rt_thread_mdelay(100);
    }
    
    /* Stop ranging */
    vl53l1x_stop_ranging(&vl53l1x_dev);
    
    /* Deinitialize */
    vl53l1x_deinit(&vl53l1x_dev);
    
    rt_kprintf("----------------------------------------\n");
    rt_kprintf("VL53L1X test completed.\n\n");
}
MSH_CMD_EXPORT(vl53l1x_test, Test VL53L1X sensor with 10 measurements);

/**
 * @brief Continuous ranging thread
 */
static void vl53l1x_ranging_thread(void *parameter)
{
    rt_err_t ret;
    rt_uint16_t distance;
    rt_uint32_t count = 0;
    
    rt_kprintf("\n========== VL53L1X Continuous Ranging ==========\n");
    
    /* Initialize sensor */
    ret = vl53l1x_init(&vl53l1x_dev, I2C_BUS_NAME);
    if (ret != RT_EOK)
    {
        rt_kprintf("[ERROR] VL53L1X initialization failed!\n");
        return;
    }
    
    /* Configure sensor for continuous operation */
    vl53l1x_set_distance_mode(&vl53l1x_dev, VL53L1X_DISTANCE_MODE_LONG);
    vl53l1x_set_timing_budget(&vl53l1x_dev, VL53L1X_TIMING_BUDGET_50MS);
    
    /* Start ranging */
    ret = vl53l1x_start_ranging(&vl53l1x_dev);
    if (ret != RT_EOK)
    {
        rt_kprintf("[ERROR] Failed to start ranging!\n");
        vl53l1x_deinit(&vl53l1x_dev);
        return;
    }
    
    rt_kprintf("Started continuous ranging...\n");
    rt_kprintf("(Press Ctrl+C to stop)\n");
    rt_kprintf("----------------------------------------\n");
    
    while (1)
    {
        if (vl53l1x_data_ready(&vl53l1x_dev))
        {
            ret = vl53l1x_get_distance(&vl53l1x_dev, &distance);
            if (ret == RT_EOK)
            {
                count++;
                rt_kprintf("[%4d] Distance: %4d mm\n", count, distance);
            }
        }
        
        rt_thread_mdelay(50);
    }
}

/**
 * @brief Start continuous ranging
 * 
 * Usage: vl53l1x_start
 */
static void vl53l1x_start(int argc, char **argv)
{
    rt_thread_t tid;
    
    tid = rt_thread_create("vl53l1x",
                          vl53l1x_ranging_thread,
                          RT_NULL,
                          2048,
                          RT_THREAD_PRIORITY_MAX / 2,
                          20);
    
    if (tid != RT_NULL)
    {
        rt_thread_startup(tid);
        rt_kprintf("VL53L1X continuous ranging thread started\n");
    }
    else
    {
        rt_kprintf("Failed to create ranging thread\n");
    }
}
MSH_CMD_EXPORT(vl53l1x_start, Start VL53L1X continuous ranging);

/**
 * @brief Quick distance check command
 * 
 * Usage: vl53l1x_quick
 */
static void vl53l1x_quick(int argc, char **argv)
{
    rt_err_t ret;
    rt_uint16_t distance;
    
    /* Initialize sensor */
    ret = vl53l1x_init(&vl53l1x_dev, I2C_BUS_NAME);
    if (ret != RT_EOK)
    {
        rt_kprintf("VL53L1X initialization failed!\n");
        return;
    }
    
    /* Quick configuration */
    vl53l1x_set_distance_mode(&vl53l1x_dev, VL53L1X_DISTANCE_MODE_LONG);
    vl53l1x_set_timing_budget(&vl53l1x_dev, VL53L1X_TIMING_BUDGET_50MS);
    
    /* Start ranging */
    vl53l1x_start_ranging(&vl53l1x_dev);
    
    /* Wait for data */
    rt_thread_mdelay(100);
    
    /* Read distance */
    if (vl53l1x_data_ready(&vl53l1x_dev))
    {
        ret = vl53l1x_get_distance(&vl53l1x_dev, &distance);
        if (ret == RT_EOK)
        {
            rt_kprintf("Current distance: %d mm (%.2f cm)\n", 
                       distance, distance / 10.0);
        }
        else
        {
            rt_kprintf("Failed to read distance\n");
        }
    }
    else
    {
        rt_kprintf("Data not ready\n");
    }
    
    /* Cleanup */
    vl53l1x_stop_ranging(&vl53l1x_dev);
    vl53l1x_deinit(&vl53l1x_dev);
}
MSH_CMD_EXPORT(vl53l1x_quick, Quick distance measurement);
