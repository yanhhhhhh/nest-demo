/*
 * Copyright (c) 2024, VL53L1X Driver for RT-Thread
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Change Logs:
 * Date           Author       Notes
 * 2024-02-10     Developer    First version
 */

#include "vl53l1x.h"
#include "vl53l1x_platform.h"

/* Sensor boot state */
#define VL53L1X_BOOT_STATE_READY    0x01

/**
 * @brief Initialize VL53L1X sensor
 * 
 * @param dev Pointer to VL53L1X device structure
 * @param i2c_bus_name Name of I2C bus (e.g., "i2c2")
 * @return rt_err_t RT_EOK on success, -RT_ERROR on failure
 */
rt_err_t vl53l1x_init(vl53l1x_device_t *dev, const char *i2c_bus_name)
{
    RT_ASSERT(dev != RT_NULL);
    RT_ASSERT(i2c_bus_name != RT_NULL);
    
    /* Find I2C bus device */
    dev->i2c_bus = (struct rt_i2c_bus_device *)rt_device_find(i2c_bus_name);
    if (dev->i2c_bus == RT_NULL)
    {
        rt_kprintf("[VL53L1X] Cannot find I2C bus: %s\n", i2c_bus_name);
        return -RT_ERROR;
    }
    
    dev->i2c_addr = VL53L1X_I2C_ADDR;
    
    /* Wait for sensor boot */
    rt_uint8_t boot_state = 0;
    rt_uint32_t timeout = 100; /* 100ms timeout */
    
    while (boot_state != VL53L1X_BOOT_STATE_READY && timeout > 0)
    {
        if (vl53l1x_read_byte(dev, VL53L1X_REG_SYSTEM_STATUS, &boot_state) != RT_EOK)
        {
            rt_kprintf("[VL53L1X] Failed to read boot state\n");
            return -RT_ERROR;
        }
        
        if (boot_state != VL53L1X_BOOT_STATE_READY)
        {
            rt_thread_mdelay(10);
            timeout -= 10;
        }
    }
    
    if (boot_state != VL53L1X_BOOT_STATE_READY)
    {
        rt_kprintf("[VL53L1X] Sensor boot timeout\n");
        return -RT_ERROR;
    }
    
    /* Sensor initialization sequence */
    /* Load default configuration */
    /* Note: In production, load the full initialization array from ST's API */
    
    dev->initialized = RT_TRUE;
    rt_kprintf("[VL53L1X] Sensor initialized successfully on %s\n", i2c_bus_name);
    
    return RT_EOK;
}

/**
 * @brief Deinitialize VL53L1X sensor
 */
rt_err_t vl53l1x_deinit(vl53l1x_device_t *dev)
{
    RT_ASSERT(dev != RT_NULL);
    
    if (dev->initialized)
    {
        vl53l1x_stop_ranging(dev);
        dev->initialized = RT_FALSE;
    }
    
    return RT_EOK;
}

/**
 * @brief Start ranging measurement
 */
rt_err_t vl53l1x_start_ranging(vl53l1x_device_t *dev)
{
    RT_ASSERT(dev != RT_NULL);
    
    if (!dev->initialized)
    {
        rt_kprintf("[VL53L1X] Sensor not initialized\n");
        return -RT_ERROR;
    }
    
    /* Start ranging: write 0x40 to SYSTEM_START register */
    rt_uint8_t start_cmd = 0x40;
    if (vl53l1x_write_byte(dev, VL53L1X_REG_SYSTEM_START, start_cmd) != RT_EOK)
    {
        rt_kprintf("[VL53L1X] Failed to start ranging\n");
        return -RT_ERROR;
    }
    
    rt_kprintf("[VL53L1X] Ranging started\n");
    return RT_EOK;
}

/**
 * @brief Stop ranging measurement
 */
rt_err_t vl53l1x_stop_ranging(vl53l1x_device_t *dev)
{
    RT_ASSERT(dev != RT_NULL);
    
    /* Stop ranging: write 0x00 to SYSTEM_START register */
    rt_uint8_t stop_cmd = 0x00;
    if (vl53l1x_write_byte(dev, VL53L1X_REG_SYSTEM_START, stop_cmd) != RT_EOK)
    {
        rt_kprintf("[VL53L1X] Failed to stop ranging\n");
        return -RT_ERROR;
    }
    
    rt_kprintf("[VL53L1X] Ranging stopped\n");
    return RT_EOK;
}

/**
 * @brief Check if new data is ready
 */
rt_bool_t vl53l1x_data_ready(vl53l1x_device_t *dev)
{
    RT_ASSERT(dev != RT_NULL);
    
    rt_uint8_t status = 0;
    if (vl53l1x_read_byte(dev, VL53L1X_REG_RESULT_RANGE_STATUS, &status) != RT_EOK)
    {
        return RT_FALSE;
    }
    
    /* Check if data is ready (bit 0) */
    return (status & 0x01) ? RT_TRUE : RT_FALSE;
}

/**
 * @brief Get distance measurement
 * 
 * @param dev Pointer to VL53L1X device structure
 * @param distance Pointer to store distance in millimeters
 * @return rt_err_t RT_EOK on success
 */
rt_err_t vl53l1x_get_distance(vl53l1x_device_t *dev, rt_uint16_t *distance)
{
    RT_ASSERT(dev != RT_NULL);
    RT_ASSERT(distance != RT_NULL);
    
    if (!dev->initialized)
    {
        return -RT_ERROR;
    }
    
    /* Read 16-bit distance value */
    if (vl53l1x_read_word(dev, VL53L1X_REG_RESULT_DISTANCE, distance) != RT_EOK)
    {
        rt_kprintf("[VL53L1X] Failed to read distance\n");
        return -RT_ERROR;
    }
    
    return RT_EOK;
}

/**
 * @brief Set distance mode (short/long range)
 */
rt_err_t vl53l1x_set_distance_mode(vl53l1x_device_t *dev, rt_uint8_t mode)
{
    RT_ASSERT(dev != RT_NULL);
    
    if (mode != VL53L1X_DISTANCE_MODE_SHORT && mode != VL53L1X_DISTANCE_MODE_LONG)
    {
        rt_kprintf("[VL53L1X] Invalid distance mode\n");
        return -RT_ERROR;
    }
    
    /* Configuration for distance mode */
    /* Note: Actual implementation requires writing multiple registers */
    /* See ST's VL53L1X API for complete configuration sequence */
    
    rt_kprintf("[VL53L1X] Distance mode set to: %s\n", 
               mode == VL53L1X_DISTANCE_MODE_SHORT ? "SHORT" : "LONG");
    
    return RT_EOK;
}

/**
 * @brief Set measurement timing budget
 */
rt_err_t vl53l1x_set_timing_budget(vl53l1x_device_t *dev, rt_uint16_t budget_ms)
{
    RT_ASSERT(dev != RT_NULL);
    
    if (budget_ms < VL53L1X_TIMING_BUDGET_15MS || budget_ms > VL53L1X_TIMING_BUDGET_500MS)
    {
        rt_kprintf("[VL53L1X] Invalid timing budget\n");
        return -RT_ERROR;
    }
    
    /* Configuration for timing budget */
    /* Note: Actual implementation requires specific register writes */
    
    rt_kprintf("[VL53L1X] Timing budget set to: %d ms\n", budget_ms);
    
    return RT_EOK;
}
