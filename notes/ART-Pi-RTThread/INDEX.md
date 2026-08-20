# ART-Pi RT-Thread VL53L1X-v2 Integration - Complete Guide Index

Welcome! This is the complete documentation package for integrating the VL53L1X-v2 Time-of-Flight sensor with ART-Pi using RT-Thread Studio.

## 📚 Documentation Structure

### Getting Started (Read in Order)

1. **[Main Guide](./README.md)** ⭐ **START HERE**
   - Overview of ART-Pi board
   - RT-Thread Studio setup
   - Complete integration workflow
   - Troubleshooting guide

2. **[Hardware Setup Guide](./hardware-setup.md)**
   - Physical wiring diagrams
   - Pin connections
   - Power supply requirements
   - Safety notes

3. **[I2C Quick Reference](./i2c-quick-reference.md)**
   - I2C configuration steps
   - Pin mapping table
   - Code examples
   - Common issues

4. **[VL53L1X Example Code](./vl53l1x-example.md)**
   - Complete driver implementation
   - Platform I2C functions
   - Application examples
   - API reference

### Example Code

- **[Example Project Directory](../../examples/art-pi-vl53l1x/)**
  - Ready-to-use source files
  - Build instructions
  - Test commands

## 🎯 Quick Start Path

### For Complete Beginners

1. Read: [Main Guide](./README.md) - Sections 1-2
2. Setup Hardware: [Hardware Setup Guide](./hardware-setup.md)
3. Configure RT-Thread: [I2C Quick Reference](./i2c-quick-reference.md) - Steps 1-4
4. Add Example Code: Copy files from [examples/art-pi-vl53l1x](../../examples/art-pi-vl53l1x/)
5. Build and Test: [Example Project README](../../examples/art-pi-vl53l1x/README.md)

### For Experienced Developers

1. Quick skim: [Main Guide](./README.md)
2. Copy example code: [examples/art-pi-vl53l1x](../../examples/art-pi-vl53l1x/)
3. Reference: [I2C Quick Reference](./i2c-quick-reference.md)
4. Customize as needed

## 📋 Checklist: Before You Start

- [ ] ART-Pi development board (STM32H750XBH6)
- [ ] VL53L1X-v2 ToF sensor module
- [ ] RT-Thread Studio installed
- [ ] USB Type-C cable
- [ ] Jumper wires (4 minimum)
- [ ] Basic understanding of embedded systems

## 🗂️ File Organization

```
nest-demo/
├── notes/ART-Pi-RTThread/
│   ├── INDEX.md                    ← You are here
│   ├── README.md                   ← Main guide
│   ├── hardware-setup.md           ← Wiring guide
│   ├── i2c-quick-reference.md      ← I2C config
│   └── vl53l1x-example.md          ← Driver details
│
└── examples/art-pi-vl53l1x/
    ├── README.md                   ← Example usage
    ├── vl53l1x.h                   ← Driver header
    ├── vl53l1x.c                   ← Driver implementation
    ├── vl53l1x_platform.h          ← Platform header
    ├── vl53l1x_platform.c          ← I2C functions
    └── application.c               ← Example application
```

## 🔧 Common Use Cases

### "I want to test the sensor quickly"

1. Wire up hardware: [Hardware Setup](./hardware-setup.md)
2. Enable I2C2: [Quick Reference](./i2c-quick-reference.md) - Step 2
3. Add example files: [Example Project](../../examples/art-pi-vl53l1x/)
4. Run: `vl53l1x_test`

### "I want to understand how it works"

1. Read: [Main Guide](./README.md) - Full document
2. Study: [VL53L1X Example Code](./vl53l1x-example.md)
3. Review: Source files in [examples/](../../examples/art-pi-vl53l1x/)

### "I want to integrate into my project"

1. Copy driver files (vl53l1x.h, vl53l1x.c, vl53l1x_platform.*)
2. Configure I2C: [Quick Reference](./i2c-quick-reference.md)
3. Initialize and use: See [application.c](../../examples/art-pi-vl53l1x/application.c)

### "Something isn't working"

1. Check: [Hardware Setup](./hardware-setup.md) - Troubleshooting section
2. Check: [Main Guide](./README.md) - Troubleshooting section
3. Check: [Quick Reference](./i2c-quick-reference.md) - Troubleshooting section

## 📖 Documentation Features

### 🔌 Hardware Setup Guide
- ✅ Pin connection diagrams
- ✅ Power supply requirements
- ✅ Pull-up resistor information
- ✅ Breadboard layout suggestions
- ✅ Safety warnings

### ⚙️ I2C Configuration
- ✅ RT-Thread Studio steps
- ✅ Code examples (read/write)
- ✅ Common device addresses
- ✅ Speed configuration
- ✅ Debugging commands

### 💻 Driver Implementation
- ✅ Complete C source code
- ✅ Platform abstraction layer
- ✅ Multiple ranging modes
- ✅ Configurable timing budgets
- ✅ MSH shell commands

### 🧪 Example Applications
- ✅ Single measurement test
- ✅ Continuous ranging
- ✅ Quick distance check
- ✅ Thread-based operation

## 🎓 Learning Resources

### Embedded in Documentation
- I2C protocol basics
- RT-Thread device driver model
- STM32H7 I2C configuration
- VL53L1X sensor operation

### External References
- [RT-Thread Official Documentation](https://www.rt-thread.org/document/site/)
- [STM32H7 Reference Manual](https://www.st.com/resource/en/reference_manual/rm0433-stm32h742-stm32h743753-and-stm32h750-value-line-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
- [VL53L1X Datasheet](https://www.st.com/resource/en/datasheet/vl53l1x.pdf)
- [ART-Pi Official Site](https://art-pi.gitee.io/website/)

## 🐛 Troubleshooting Quick Links

| Problem | See Document | Section |
|---------|--------------|---------|
| I2C bus not found | [Main Guide](./README.md) | Troubleshooting |
| Sensor not detected | [Hardware Setup](./hardware-setup.md) | Troubleshooting |
| Wrong readings | [Main Guide](./README.md) | Troubleshooting |
| Compilation errors | [Quick Reference](./i2c-quick-reference.md) | Troubleshooting |
| Connection issues | [Hardware Setup](./hardware-setup.md) | Step-by-Step |

## 💡 Tips for Success

1. **Follow the order**: Start with hardware, then software
2. **Test incrementally**: Verify each step before moving on
3. **Use MSH commands**: `i2c probe i2c2` is your friend
4. **Check connections twice**: Most issues are wiring problems
5. **Read error messages**: They usually tell you what's wrong

## 🚀 Next Steps After Success

Once you have VL53L1X working:

1. **Experiment with settings**:
   - Try different distance modes (SHORT vs LONG)
   - Test various timing budgets
   - Measure different objects and surfaces

2. **Extend functionality**:
   - Add offset calibration
   - Implement cross-talk compensation
   - Use interrupt-driven operation
   - Add data logging

3. **Integrate into project**:
   - Combine with other sensors
   - Build a ranging application
   - Create a distance-based control system

4. **Optimize performance**:
   - Tune timing budgets for your use case
   - Implement power-saving modes
   - Add error handling and recovery

## 📞 Support

If you encounter issues not covered in the documentation:

1. Review all troubleshooting sections
2. Check the RT-Thread community forum
3. Consult the VL53L1X datasheet
4. Open an issue in this repository

## 📄 License

This documentation and example code are provided for educational and development purposes.

## ✅ Documentation Completeness

This package includes:
- [x] Hardware wiring guide
- [x] RT-Thread Studio setup
- [x] I2C configuration steps
- [x] VL53L1X driver implementation
- [x] Platform I2C abstraction
- [x] Example applications
- [x] MSH shell commands
- [x] Troubleshooting guides
- [x] API reference
- [x] Quick reference cards

---

**Ready to get started?** Go to the [Main Guide](./README.md) now! 🎯
