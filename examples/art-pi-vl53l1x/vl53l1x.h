/*
 * Copyright (c) 2024, VL53L1X Driver for RT-Thread
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Change Logs:
 * Date           Author       Notes
 * 2024-02-10     Developer    First version
 */

#ifndef __VL53L1X_H__
#define __VL53L1X_H__

#include <rtthread.h>
#include <rtdevice.h>

#ifdef __cplusplus
extern "C" {
#endif

/* VL53L1X I2C Address (7-bit) */
#define VL53L1X_I2C_ADDR            0x29

/* VL53L1X Register Addresses */
#define VL53L1X_REG_SOFT_RESET              0x0000
#define VL53L1X_REG_I2C_SLAVE_DEVICE_ADDR   0x0001
#define VL53L1X_REG_VHV_CONFIG_TIMEOUT      0x0008
#define VL53L1X_REG_SYSTEM_START            0x0087
#define VL53L1X_REG_RESULT_RANGE_STATUS     0x0089
#define VL53L1X_REG_RESULT_DISTANCE         0x0096
#define VL53L1X_REG_SYSTEM_STATUS           0x00E5

/* Distance Modes */
#define VL53L1X_DISTANCE_MODE_SHORT         1   /* Up to 1.3m */
#define VL53L1X_DISTANCE_MODE_LONG          2   /* Up to 4m */

/* Timing Budget (ms) */
#define VL53L1X_TIMING_BUDGET_15MS          15
#define VL53L1X_TIMING_BUDGET_20MS          20
#define VL53L1X_TIMING_BUDGET_33MS          33
#define VL53L1X_TIMING_BUDGET_50MS          50
#define VL53L1X_TIMING_BUDGET_100MS         100
#define VL53L1X_TIMING_BUDGET_200MS         200
#define VL53L1X_TIMING_BUDGET_500MS         500

/* VL53L1X Device Structure */
typedef struct {
    struct rt_i2c_bus_device *i2c_bus;
    rt_uint8_t i2c_addr;
    rt_bool_t initialized;
} vl53l1x_device_t;

/* Function Prototypes */
rt_err_t vl53l1x_init(vl53l1x_device_t *dev, const char *i2c_bus_name);
rt_err_t vl53l1x_deinit(vl53l1x_device_t *dev);
rt_err_t vl53l1x_start_ranging(vl53l1x_device_t *dev);
rt_err_t vl53l1x_stop_ranging(vl53l1x_device_t *dev);
rt_err_t vl53l1x_get_distance(vl53l1x_device_t *dev, rt_uint16_t *distance);
rt_err_t vl53l1x_set_distance_mode(vl53l1x_device_t *dev, rt_uint8_t mode);
rt_err_t vl53l1x_set_timing_budget(vl53l1x_device_t *dev, rt_uint16_t budget_ms);
rt_bool_t vl53l1x_data_ready(vl53l1x_device_t *dev);

#ifdef __cplusplus
}
#endif

#endif /* __VL53L1X_H__ */
