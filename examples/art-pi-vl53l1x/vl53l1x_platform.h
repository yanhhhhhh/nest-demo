/*
 * Copyright (c) 2024, VL53L1X Platform I2C for RT-Thread
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Change Logs:
 * Date           Author       Notes
 * 2024-02-10     Developer    First version
 */

#ifndef __VL53L1X_PLATFORM_H__
#define __VL53L1X_PLATFORM_H__

#include "vl53l1x.h"

#ifdef __cplusplus
extern "C" {
#endif

/* Platform-specific I2C functions */
rt_err_t vl53l1x_write_byte(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t data);
rt_err_t vl53l1x_read_byte(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data);
rt_err_t vl53l1x_write_word(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint16_t data);
rt_err_t vl53l1x_read_word(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint16_t *data);
rt_err_t vl53l1x_write_bytes(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data, rt_uint16_t len);
rt_err_t vl53l1x_read_bytes(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data, rt_uint16_t len);

#ifdef __cplusplus
}
#endif

#endif /* __VL53L1X_PLATFORM_H__ */
