# ART-Pi RT-Thread Studio Guide

This guide provides comprehensive documentation for using the ART-Pi development board with RT-Thread Studio, focusing on I2C interface configuration and VL53L1X-v2 Time-of-Flight (ToF) distance sensor integration.

> 📖 **New to this guide?** Check out the [INDEX](./INDEX.md) for a complete overview of all available documentation and quick-start paths.

## Table of Contents

1. [ART-Pi Board Overview](#art-pi-board-overview)
2. [RT-Thread Studio Setup](#rt-thread-studio-setup)
3. [I2C Configuration](#i2c-configuration)
4. [VL53L1X-v2 Sensor Integration](#vl53l1x-v2-sensor-integration)
5. [Example Code](#example-code)
6. [Troubleshooting](#troubleshooting)

## ART-Pi Board Overview

The ART-Pi (ART-π) is a development board based on the STM32H750XBH6 microcontroller, featuring:
- STM32H750XBH6 MCU (Cortex-M7 core, 480MHz)
- Multiple I2C interfaces (I2C1, I2C2, I2C3, I2C4)
- Rich peripheral interfaces
- RT-Thread RTOS support

### I2C Pin Mapping on ART-Pi

The ART-Pi board exposes several I2C interfaces. For VL53L1X-v2 sensor integration, we typically use **I2C2**:

| I2C Bus | SCL Pin | SDA Pin | Board Label |
|---------|---------|---------|-------------|
| I2C1    | PB6     | PB7     | I2C1        |
| I2C2    | PB10    | PB11    | I2C2        |
| I2C3    | PH7     | PH8     | I2C3        |
| I2C4    | PD12    | PD13    | I2C4        |

**Recommended**: Use **I2C2 (PB10/PB11)** as it's commonly exposed on expansion headers.

## RT-Thread Studio Setup

### 1. Install RT-Thread Studio

1. Download RT-Thread Studio from [RT-Thread official website](https://www.rt-thread.io/studio.html)
2. Install RT-Thread Studio following the installation wizard
3. Launch RT-Thread Studio

### 2. Create New Project for ART-Pi

1. **File** → **New** → **RT-Thread Project**
2. Select Board: **ART-Pi**
3. Project name: `art-pi-vl53l1x-demo`
4. Click **Finish**

### 3. Configure RT-Thread Components

Open **RT-Thread Settings** in your project to enable required components.

## I2C Configuration

### Step 1: Enable I2C Device in RT-Thread Settings

1. Open RT-Thread Settings (double-click `RT-Thread Settings` in project explorer)
2. Navigate to: **Hardware** → **On-Chip Peripheral Drivers**
3. Enable **Enable I2C BUS**
4. Under I2C options, enable **Enable I2C2**

### Step 2: Configure I2C Pins in board.h

Edit `board/board.h` to configure I2C2 pins:

```c
/* I2C2 configuration */
#define BSP_USING_I2C2
#define BSP_I2C2_SCL_PIN    GET_PIN(B, 10)
#define BSP_I2C2_SDA_PIN    GET_PIN(B, 11)
```

### Step 3: Enable I2C in rtconfig.h (if not auto-generated)

Edit `rtconfig.h` to ensure I2C is enabled:

```c
#define BSP_USING_I2C
#define BSP_USING_I2C2
```

### Step 4: Verify I2C Configuration

After configuration, rebuild the project. The I2C bus should be automatically registered as `i2c2`.

## VL53L1X-v2 Sensor Integration

The VL53L1X-v2 is a Time-of-Flight (ToF) distance ranging sensor with I2C interface.

### VL53L1X-v2 Specifications

- **Interface**: I2C (default address: 0x52 >> 1 = 0x29)
- **Operating Voltage**: 2.6V - 3.5V
- **Range**: Up to 4 meters
- **I2C Speed**: Standard (100 kHz) or Fast (400 kHz)

### Hardware Connections

Connect VL53L1X-v2 to ART-Pi:

| VL53L1X-v2 Pin | ART-Pi Pin | Description |
|----------------|------------|-------------|
| VDD            | 3.3V       | Power supply |
| GND            | GND        | Ground |
| SCL            | PB10       | I2C2 Clock |
| SDA            | PB11       | I2C2 Data |
| XSHUT          | Any GPIO*  | Shutdown (optional, pull high) |
| GPIO1          | Any GPIO*  | Interrupt (optional) |

*Optional pins can be connected if you need shutdown control or interrupt functionality.

### Step 5: Add VL53L1X Driver Package

RT-Thread provides a package manager (Env tool) to add sensor drivers.

#### Option A: Using RT-Thread Package Manager

1. Right-click project → **RT-Thread Settings**
2. Navigate to **Software packages** → **peripheral libraries and drivers**
3. Search for `vl53l1x` or `vl53l0x` package
4. If not available, use manual driver integration (Option B)

#### Option B: Manual Driver Integration

Download the VL53L1X driver from ST or community repositories and integrate manually. See [VL53L1X Example Code](./vl53l1x-example.md) for implementation details.

### Step 6: Configure VL53L1X Package (if using package)

After enabling the package, configure it:

```c
#define PKG_USING_VL53L1X
#define VL53L1X_I2C_BUS_NAME    "i2c2"
#define VL53L1X_I2C_ADDRESS     0x29
```

## Example Code

See the following resources for complete example implementations:

- [VL53L1X Basic Usage Example](./vl53l1x-example.md)
- [VL53L1X Driver Implementation](../../examples/art-pi-vl53l1x/)

### Quick Start Example

Here's a minimal example to read distance from VL53L1X-v2:

```c
#include <rtthread.h>
#include <rtdevice.h>

#define I2C_BUS_NAME    "i2c2"
#define VL53L1X_ADDR    0x29

static struct rt_i2c_bus_device *i2c_bus = RT_NULL;

int vl53l1x_init(void)
{
    /* Find I2C bus */
    i2c_bus = (struct rt_i2c_bus_device *)rt_device_find(I2C_BUS_NAME);
    if (i2c_bus == RT_NULL)
    {
        rt_kprintf("Cannot find I2C bus: %s\n", I2C_BUS_NAME);
        return -RT_ERROR;
    }
    
    rt_kprintf("VL53L1X initialized on %s\n", I2C_BUS_NAME);
    return RT_EOK;
}

void vl53l1x_test(void)
{
    if (vl53l1x_init() != RT_EOK)
    {
        return;
    }
    
    rt_kprintf("VL53L1X sensor test successful\n");
    /* Add sensor reading code here */
}

MSH_CMD_EXPORT(vl53l1x_test, VL53L1X sensor test);
```

## Troubleshooting

### I2C Bus Not Found

**Issue**: `Cannot find I2C bus: i2c2`

**Solutions**:
1. Verify I2C2 is enabled in RT-Thread Settings
2. Check pin configuration in `board.h`
3. Rebuild the project completely
4. Verify hardware connections

### I2C Device Not Responding

**Issue**: No ACK from VL53L1X sensor

**Solutions**:
1. Check hardware connections (SCL, SDA, VDD, GND)
2. Verify sensor power supply (3.3V)
3. Check I2C address (VL53L1X default: 0x29)
4. Use `i2c probe i2c2` command in MSH to scan for devices
5. Verify pull-up resistors on I2C lines (typically 4.7kΩ)

### Compilation Errors

**Issue**: Undefined references to I2C functions

**Solutions**:
1. Enable I2C device framework in RT-Thread Settings
2. Add `#include <rtdevice.h>` in your source files
3. Rebuild project

### Reading Incorrect Distance Values

**Issue**: VL53L1X returns 0 or incorrect values

**Solutions**:
1. Ensure sensor is properly initialized
2. Wait for sensor calibration to complete
3. Check distance measurement mode configuration
4. Verify sensor is in ranging mode

## Additional Resources

- [RT-Thread I2C Device Driver Documentation](https://www.rt-thread.org/document/site/)
- [STM32H7 I2C Configuration Guide](https://www.st.com/en/microcontrollers-microprocessors/stm32h7-series.html)
- [VL53L1X Datasheet](https://www.st.com/en/imaging-and-photonics-solutions/vl53l1x.html)
- [ART-Pi Official Documentation](https://art-pi.gitee.io/website/)

## Next Steps

1. Follow the [VL53L1X Example Implementation](./vl53l1x-example.md) for detailed sensor usage
2. Review the [complete driver code](../../examples/art-pi-vl53l1x/) in the examples directory
3. Experiment with different ranging modes and configurations

---

For questions or issues, please refer to the RT-Thread community forum or open an issue in this repository.
