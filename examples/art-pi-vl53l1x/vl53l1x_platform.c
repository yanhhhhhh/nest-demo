/*
 * Copyright (c) 2024, VL53L1X Platform I2C for RT-Thread
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Change Logs:
 * Date           Author       Notes
 * 2024-02-10     Developer    First version
 */

#include "vl53l1x_platform.h"

/**
 * @brief Write a single byte to VL53L1X register
 */
rt_err_t vl53l1x_write_byte(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t data)
{
    struct rt_i2c_msg msgs[1];
    rt_uint8_t buf[3];
    
    /* VL53L1X uses 16-bit register addresses (big-endian) */
    buf[0] = (reg >> 8) & 0xFF;   /* Register address high byte */
    buf[1] = reg & 0xFF;           /* Register address low byte */
    buf[2] = data;                 /* Data byte */
    
    msgs[0].addr  = dev->i2c_addr;
    msgs[0].flags = RT_I2C_WR;
    msgs[0].buf   = buf;
    msgs[0].len   = 3;
    
    if (rt_i2c_transfer(dev->i2c_bus, msgs, 1) != 1)
    {
        return -RT_ERROR;
    }
    
    return RT_EOK;
}

/**
 * @brief Read a single byte from VL53L1X register
 */
rt_err_t vl53l1x_read_byte(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data)
{
    struct rt_i2c_msg msgs[2];
    rt_uint8_t reg_buf[2];
    
    /* Write register address */
    reg_buf[0] = (reg >> 8) & 0xFF;
    reg_buf[1] = reg & 0xFF;
    
    msgs[0].addr  = dev->i2c_addr;
    msgs[0].flags = RT_I2C_WR;
    msgs[0].buf   = reg_buf;
    msgs[0].len   = 2;
    
    /* Read data */
    msgs[1].addr  = dev->i2c_addr;
    msgs[1].flags = RT_I2C_RD;
    msgs[1].buf   = data;
    msgs[1].len   = 1;
    
    if (rt_i2c_transfer(dev->i2c_bus, msgs, 2) != 2)
    {
        return -RT_ERROR;
    }
    
    return RT_EOK;
}

/**
 * @brief Write a 16-bit word to VL53L1X register
 */
rt_err_t vl53l1x_write_word(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint16_t data)
{
    struct rt_i2c_msg msgs[1];
    rt_uint8_t buf[4];
    
    buf[0] = (reg >> 8) & 0xFF;    /* Register address high byte */
    buf[1] = reg & 0xFF;            /* Register address low byte */
    buf[2] = (data >> 8) & 0xFF;   /* Data high byte */
    buf[3] = data & 0xFF;           /* Data low byte */
    
    msgs[0].addr  = dev->i2c_addr;
    msgs[0].flags = RT_I2C_WR;
    msgs[0].buf   = buf;
    msgs[0].len   = 4;
    
    if (rt_i2c_transfer(dev->i2c_bus, msgs, 1) != 1)
    {
        return -RT_ERROR;
    }
    
    return RT_EOK;
}

/**
 * @brief Read a 16-bit word from VL53L1X register
 */
rt_err_t vl53l1x_read_word(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint16_t *data)
{
    struct rt_i2c_msg msgs[2];
    rt_uint8_t reg_buf[2];
    rt_uint8_t data_buf[2];
    
    /* Write register address */
    reg_buf[0] = (reg >> 8) & 0xFF;
    reg_buf[1] = reg & 0xFF;
    
    msgs[0].addr  = dev->i2c_addr;
    msgs[0].flags = RT_I2C_WR;
    msgs[0].buf   = reg_buf;
    msgs[0].len   = 2;
    
    /* Read data */
    msgs[1].addr  = dev->i2c_addr;
    msgs[1].flags = RT_I2C_RD;
    msgs[1].buf   = data_buf;
    msgs[1].len   = 2;
    
    if (rt_i2c_transfer(dev->i2c_bus, msgs, 2) != 2)
    {
        return -RT_ERROR;
    }
    
    /* Combine bytes (big-endian) */
    *data = (data_buf[0] << 8) | data_buf[1];
    
    return RT_EOK;
}

/**
 * @brief Write multiple bytes to VL53L1X
 */
rt_err_t vl53l1x_write_bytes(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data, rt_uint16_t len)
{
    struct rt_i2c_msg msgs[1];
    rt_uint8_t *buf;
    
    buf = rt_malloc(len + 2);
    if (buf == RT_NULL)
    {
        return -RT_ENOMEM;
    }
    
    buf[0] = (reg >> 8) & 0xFF;
    buf[1] = reg & 0xFF;
    rt_memcpy(&buf[2], data, len);
    
    msgs[0].addr  = dev->i2c_addr;
    msgs[0].flags = RT_I2C_WR;
    msgs[0].buf   = buf;
    msgs[0].len   = len + 2;
    
    if (rt_i2c_transfer(dev->i2c_bus, msgs, 1) != 1)
    {
        rt_free(buf);
        return -RT_ERROR;
    }
    
    rt_free(buf);
    return RT_EOK;
}

/**
 * @brief Read multiple bytes from VL53L1X
 */
rt_err_t vl53l1x_read_bytes(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data, rt_uint16_t len)
{
    struct rt_i2c_msg msgs[2];
    rt_uint8_t reg_buf[2];
    
    reg_buf[0] = (reg >> 8) & 0xFF;
    reg_buf[1] = reg & 0xFF;
    
    msgs[0].addr  = dev->i2c_addr;
    msgs[0].flags = RT_I2C_WR;
    msgs[0].buf   = reg_buf;
    msgs[0].len   = 2;
    
    msgs[1].addr  = dev->i2c_addr;
    msgs[1].flags = RT_I2C_RD;
    msgs[1].buf   = data;
    msgs[1].len   = len;
    
    if (rt_i2c_transfer(dev->i2c_bus, msgs, 2) != 2)
    {
        return -RT_ERROR;
    }
    
    return RT_EOK;
}
