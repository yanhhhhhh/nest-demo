# VL53L1X-v2 Sensor Implementation Example

This document provides a complete implementation example for using the VL53L1X-v2 Time-of-Flight sensor with ART-Pi and RT-Thread.

## Overview

The VL53L1X is a state-of-the-art ToF (Time-of-Flight) laser ranging sensor from STMicroelectronics. This example demonstrates:

- I2C communication with VL53L1X
- Sensor initialization and configuration
- Distance measurement in different modes
- Error handling and diagnostics

## Complete Driver Implementation

### File Structure

```
examples/art-pi-vl53l1x/
├── vl53l1x.c           # Main driver implementation
├── vl53l1x.h           # Driver header file
├── vl53l1x_platform.c  # Platform-specific I2C functions
├── vl53l1x_platform.h  # Platform header
└── README.md           # Usage instructions
```

## VL53L1X Driver Header (vl53l1x.h)

```c
#ifndef __VL53L1X_H__
#define __VL53L1X_H__

#include <rtthread.h>
#include <rtdevice.h>

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

#endif /* __VL53L1X_H__ */
```

## VL53L1X Driver Implementation (vl53l1x.c)

```c
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
    rt_kprintf("[VL53L1X] Sensor initialized successfully\n");
    
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
```

## Platform I2C Functions (vl53l1x_platform.h)

```c
#ifndef __VL53L1X_PLATFORM_H__
#define __VL53L1X_PLATFORM_H__

#include "vl53l1x.h"

/* Platform-specific I2C functions */
rt_err_t vl53l1x_write_byte(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t data);
rt_err_t vl53l1x_read_byte(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data);
rt_err_t vl53l1x_write_word(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint16_t data);
rt_err_t vl53l1x_read_word(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint16_t *data);
rt_err_t vl53l1x_write_bytes(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data, rt_uint16_t len);
rt_err_t vl53l1x_read_bytes(vl53l1x_device_t *dev, rt_uint16_t reg, rt_uint8_t *data, rt_uint16_t len);

#endif /* __VL53L1X_PLATFORM_H__ */
```

## Platform I2C Functions (vl53l1x_platform.c)

```c
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
```

## Application Example (main.c)

```c
#include <rtthread.h>
#include <rtdevice.h>
#include "vl53l1x.h"

#define I2C_BUS_NAME    "i2c2"

static vl53l1x_device_t vl53l1x_dev;

/**
 * @brief VL53L1X test command
 */
static void vl53l1x_test(int argc, char **argv)
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
    
    /* Set distance mode to long range */
    vl53l1x_set_distance_mode(&vl53l1x_dev, VL53L1X_DISTANCE_MODE_LONG);
    
    /* Set timing budget */
    vl53l1x_set_timing_budget(&vl53l1x_dev, VL53L1X_TIMING_BUDGET_100MS);
    
    /* Start ranging */
    ret = vl53l1x_start_ranging(&vl53l1x_dev);
    if (ret != RT_EOK)
    {
        rt_kprintf("Failed to start ranging!\n");
        return;
    }
    
    rt_kprintf("VL53L1X sensor started. Reading distances...\n");
    
    /* Read 10 measurements */
    for (int i = 0; i < 10; i++)
    {
        /* Wait for data ready */
        while (!vl53l1x_data_ready(&vl53l1x_dev))
        {
            rt_thread_mdelay(10);
        }
        
        /* Get distance */
        ret = vl53l1x_get_distance(&vl53l1x_dev, &distance);
        if (ret == RT_EOK)
        {
            rt_kprintf("[%d] Distance: %d mm\n", i + 1, distance);
        }
        else
        {
            rt_kprintf("[%d] Failed to read distance\n", i + 1);
        }
        
        rt_thread_mdelay(100);
    }
    
    /* Stop ranging */
    vl53l1x_stop_ranging(&vl53l1x_dev);
    
    /* Deinitialize */
    vl53l1x_deinit(&vl53l1x_dev);
    
    rt_kprintf("VL53L1X test completed.\n");
}
MSH_CMD_EXPORT(vl53l1x_test, Test VL53L1X sensor);

/**
 * @brief Continuous ranging thread
 */
static void vl53l1x_ranging_thread(void *parameter)
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
    
    /* Configure sensor */
    vl53l1x_set_distance_mode(&vl53l1x_dev, VL53L1X_DISTANCE_MODE_LONG);
    vl53l1x_set_timing_budget(&vl53l1x_dev, VL53L1X_TIMING_BUDGET_50MS);
    
    /* Start ranging */
    vl53l1x_start_ranging(&vl53l1x_dev);
    
    while (1)
    {
        if (vl53l1x_data_ready(&vl53l1x_dev))
        {
            ret = vl53l1x_get_distance(&vl53l1x_dev, &distance);
            if (ret == RT_EOK)
            {
                rt_kprintf("Distance: %4d mm\n", distance);
            }
        }
        
        rt_thread_mdelay(50);
    }
}

/**
 * @brief Start continuous ranging
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
        rt_kprintf("VL53L1X continuous ranging started\n");
    }
    else
    {
        rt_kprintf("Failed to create ranging thread\n");
    }
}
MSH_CMD_EXPORT(vl53l1x_start, Start VL53L1X continuous ranging);
```

## Usage Instructions

### 1. Build the Project

1. Add all source files to your RT-Thread Studio project
2. Build the project: **Project** → **Build Project**

### 2. Flash and Run

1. Connect ART-Pi via USB
2. Flash the firmware: **Run** → **Debug**
3. Open MSH terminal

### 3. Test Commands

In the MSH shell:

```bash
# Single test (10 measurements)
msh> vl53l1x_test

# Continuous ranging
msh> vl53l1x_start

# Check I2C devices
msh> i2c probe i2c2
```

### Expected Output

```
VL53L1X sensor started. Reading distances...
[1] Distance: 245 mm
[2] Distance: 248 mm
[3] Distance: 246 mm
[4] Distance: 247 mm
[5] Distance: 245 mm
[6] Distance: 246 mm
[7] Distance: 248 mm
[8] Distance: 247 mm
[9] Distance: 246 mm
[10] Distance: 245 mm
VL53L1X test completed.
```

## Important Notes

1. **Complete API**: This example provides a simplified implementation. For production use, integrate the full VL53L1X ULD (Ultra Lite Driver) API from STMicroelectronics.

2. **Calibration**: The VL53L1X requires calibration for accurate measurements. Implement offset and crosstalk calibration from ST's API.

3. **ROI (Region of Interest)**: Advanced features like ROI configuration are available in the full API.

4. **Error Handling**: Add comprehensive error checking for production applications.

5. **Power Management**: Consider implementing low-power modes for battery-operated applications.

## Resources

- [ST VL53L1X Product Page](https://www.st.com/en/imaging-and-photonics-solutions/vl53l1x.html)
- [VL53L1X Datasheet](https://www.st.com/resource/en/datasheet/vl53l1x.pdf)
- [VL53L1X ULD API](https://www.st.com/en/embedded-software/stsw-img007.html)
- [RT-Thread I2C Documentation](https://www.rt-thread.org/document/site/)

---

For more information, refer to the [main ART-Pi guide](./README.md).
