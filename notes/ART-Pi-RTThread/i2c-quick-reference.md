# ART-Pi I2C Configuration Quick Reference

This is a quick reference guide for configuring I2C on the ART-Pi board with RT-Thread Studio.

## I2C Pin Mapping

| I2C Bus | SCL Pin | SDA Pin | Availability |
|---------|---------|---------|--------------|
| I2C1    | PB6     | PB7     | ✓ Available  |
| I2C2    | PB10    | PB11    | ✓ Recommended |
| I2C3    | PH7     | PH8     | ✓ Available  |
| I2C4    | PD12    | PD13    | ✓ Available  |

**Recommended**: Use I2C2 (PB10/PB11) for most applications.

## Enable I2C in RT-Thread Studio

### Step 1: Open RT-Thread Settings
1. In Project Explorer, double-click **RT-Thread Settings**
2. Wait for the configuration panel to load

### Step 2: Enable I2C Device
1. Navigate to: **Hardware** → **On-Chip Peripheral Drivers**
2. Check ☑ **Enable I2C BUS**
3. Under I2C options, check ☑ **Enable I2C2** (or desired bus)

### Step 3: Configure Pins (if needed)
Most pin configurations are automatic, but you can verify in `board/board.h`:

```c
#define BSP_USING_I2C2
#define BSP_I2C2_SCL_PIN    GET_PIN(B, 10)
#define BSP_I2C2_SDA_PIN    GET_PIN(B, 11)
```

### Step 4: Save and Build
1. Save RT-Thread Settings (Ctrl+S)
2. Build project: **Project** → **Build Project**

## Verify I2C Configuration

After flashing, use MSH commands to verify:

```bash
# List all devices (should see i2c2)
msh> list_device

# Probe I2C bus for devices
msh> i2c probe i2c2
```

## I2C Usage in Code

### Include Headers
```c
#include <rtthread.h>
#include <rtdevice.h>
```

### Find I2C Bus Device
```c
struct rt_i2c_bus_device *i2c_bus;

i2c_bus = (struct rt_i2c_bus_device *)rt_device_find("i2c2");
if (i2c_bus == RT_NULL) {
    rt_kprintf("Cannot find I2C bus\n");
    return -RT_ERROR;
}
```

### Write Data to I2C Device
```c
struct rt_i2c_msg msgs[1];
rt_uint8_t buf[3];

buf[0] = reg_addr;
buf[1] = data1;
buf[2] = data2;

msgs[0].addr  = device_addr;  // 7-bit address
msgs[0].flags = RT_I2C_WR;
msgs[0].buf   = buf;
msgs[0].len   = 3;

if (rt_i2c_transfer(i2c_bus, msgs, 1) != 1) {
    rt_kprintf("I2C write failed\n");
    return -RT_ERROR;
}
```

### Read Data from I2C Device
```c
struct rt_i2c_msg msgs[2];
rt_uint8_t reg = reg_addr;
rt_uint8_t data[2];

// Write register address
msgs[0].addr  = device_addr;
msgs[0].flags = RT_I2C_WR;
msgs[0].buf   = &reg;
msgs[0].len   = 1;

// Read data
msgs[1].addr  = device_addr;
msgs[1].flags = RT_I2C_RD;
msgs[1].buf   = data;
msgs[1].len   = 2;

if (rt_i2c_transfer(i2c_bus, msgs, 2) != 2) {
    rt_kprintf("I2C read failed\n");
    return -RT_ERROR;
}
```

## Common I2C Devices and Addresses

| Device Type | Example | Typical Address |
|-------------|---------|-----------------|
| VL53L1X ToF | Distance sensor | 0x29 |
| MPU6050 | IMU sensor | 0x68 or 0x69 |
| BMP280 | Pressure sensor | 0x76 or 0x77 |
| SSD1306 | OLED display | 0x3C or 0x3D |
| AT24C02 | EEPROM | 0x50 |
| PCF8574 | I/O expander | 0x20-0x27 |

## Troubleshooting

### Problem: I2C device not found
**Solution**:
- Check RT-Thread Settings: I2C must be enabled
- Rebuild project completely
- Verify pin configuration in board.h

### Problem: No ACK from device
**Solution**:
- Verify hardware connections (SCL, SDA, VDD, GND)
- Check device I2C address (7-bit vs 8-bit)
- Ensure pull-up resistors present (typically 4.7kΩ)
- Verify device power supply voltage

### Problem: Data corruption
**Solution**:
- Check I2C bus speed (100kHz standard, 400kHz fast)
- Reduce cable length
- Improve grounding
- Check for electrical noise

## I2C Bus Speed Configuration

Default I2C speed is typically 100kHz (standard mode). To change:

In `board/board.h` or driver initialization:
```c
// For 400kHz (fast mode)
#define BSP_I2C2_TIMING    0x40912732

// Note: Specific timing values depend on STM32H7 clock configuration
```

## Hardware Tips

1. **Pull-up Resistors**: Required on SCL and SDA lines (typically 4.7kΩ)
2. **Wire Length**: Keep I2C wires short (<30cm for reliability)
3. **Power Supply**: Ensure stable 3.3V supply for sensors
4. **Common Ground**: Connect all device grounds together
5. **Decoupling**: Add 100nF capacitor near each device VDD pin

## Additional Resources

- [RT-Thread I2C Device Documentation](https://www.rt-thread.org/document/site/programming-manual/device/i2c/i2c/)
- [STM32H7 I2C Reference Manual](https://www.st.com/resource/en/reference_manual/rm0433-stm32h742-stm32h743753-and-stm32h750-value-line-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
- [I2C Specification](https://www.nxp.com/docs/en/user-guide/UM10204.pdf)

---

For complete VL53L1X sensor integration, see [VL53L1X Example](./vl53l1x-example.md).
