const { createApp, ref, computed, onMounted, watch, onBeforeUnmount } = Vue;
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

function formatCurrency(value) {
  return formatter.format(value);
}
// Cấu hình các mốc và góc
const minRpmAngle = -100;
const maxRpmAngle = 100;

// Độ dài cung path fill (bạn đo thực tế path SVG, hoặc tạm để 472)
const arcLengthRPM = 627.9769287109375;
const arcLength = 627.9769287109375;
// Main App
const app = createApp({
  setup() {
    // Player Stats
    const health = ref(100);
    const armor = ref(100);
    const hunger = ref(80);
    const thirst = ref(75);
    const stress = ref(20);
    const oxygen = ref(100);
    const voice = ref(0);
    const talking = ref(false);
    const playerDead = ref(false);
    const radio = ref(0);
    const radioActive = ref(false);
    const nos = ref(0);
    const nitroActive = ref(false);
    const cruise = ref(false);
    const harness = ref(false);
    const armed = ref(false);
    const parachute = ref(false);
    const engine = ref(0);
    const dev = ref(false);
    const hp = ref(0);
    const cinematic = ref(false);

    // Màu sắc
    const talkingColor = ref("#FFFFFF");
    const nosColor = ref("#FFFFFF");
    const engineColor = ref("#3FA554");

    // Dynamic show/hide
    const showHealth = ref(true);
    const showArmor = ref(true);
    const showHunger = ref(true);
    const showThirst = ref(true);
    const showStress = ref(true);
    const showOxygen = ref(false);
    const showNos = ref(true);
    const showEngine = ref(false);
    const showCruise = ref(false);
    const showHarness = ref(false);
    const showParachute = ref(false);
    const showDev = ref(false);
    const showArmed = ref(true);
    const show = ref(true);

    // Vehicle Stats
    const speed = ref(0);
    const rpm = ref(0);
    const fuel = ref(100);
    const maxSpeed = ref(240);
    const maxRpm = ref(10000);
    const inVehicle = ref(false);
    const rpmAngle = ref(0);
    const vehicleName = ref('');
    const gear = ref('P');
    const gaugeArcRpm = ref(null);
    const gaugeArcSpeed = ref(null);
    const arcLengthRPM = ref(0);
    const arcLengthSpeed = ref(0);
    const isSeabelt = ref(false);
    //Money
    const cash = ref(0);
    const bank = ref(0);
    const amount = ref(0);
    const plus = ref(false);
    const showCash = ref(false);
    const showBank = ref(false);


    // Colors
    const healthColor = computed(() => {
      if (health.value < 30) return '#ef4444'; // red
      if (health.value < 70) return '#f59e0b'; // yellow
      return '#10b981'; // green
    });

    const armorColor = computed(() => {
      if (armor.value < 30) return '#ef4444';
      if (armor.value < 70) return '#3b82f6'; // blue
      return '#3b82f6';
    });

    const hungerColor = computed(() => {
      if (hunger.value < 30) return '#ef4444';
      if (hunger.value < 70) return '#f59e0b';
      return '#f59e0b';
    });

    const thirstColor = computed(() => {
      if (thirst.value < 30) return '#ef4444';
      if (thirst.value < 70) return '#3b82f6';
      return '#3b82f6';
    });

    const stressColor = computed(() => {
      if (stress.value < 30) return '#a855f7'; // purple
      if (stress.value < 70) return '#8b5cf6';
      return '#7e22ce';
    });

    const oxygenColor = computed(() => {
      if (oxygen.value < 30) return '#ef4444';
      if (oxygen.value < 70) return '#3b82f6';
      return '#3b82f6';
    });

    const voiceIcon = computed(() => talking.value ? 'fas fa-microphone-alt' : 'fas fa-microphone');


    // Circle path for progress circles
    const circlePath = "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831";
    const minAngle = -125;
    const maxAngle = 125;
    function angleForSpeed(val) {
      const speedToAngle = [
        { speed: 0, angle: -125 },
        { speed: 40, angle: -90 },
        { speed: 80, angle: -50 },
        { speed: 120, angle: 0 },
        { speed: 160, angle: 50 },
        { speed: 200, angle: 90 },
        { speed: 240, angle: 125 }
      ];

      // Tìm 2 mốc gần nhất
      let i = 0;
      while (i < speedToAngle.length - 1 && val > speedToAngle[i + 1].speed) i++;
      const left = speedToAngle[i];
      const right = speedToAngle[i + 1] || left;
      if (left.speed === right.speed) return left.angle;

      // Nội suy
      const t = (val - left.speed) / (right.speed - left.speed);
      return left.angle + t * (right.angle - left.angle);
    }
    function getColorForSpeed(val) {
      if (val <= 120) {
        let t = val / 120;
        let r = Math.round(0 + t * (255 - 0));
        let g = Math.round(255 + t * (230 - 255));
        let b = Math.round(130 + t * (0 - 130));
        return `rgb(${r},${g},${b})`;
      } else {
        let t = (val - 120) / 120;
        let r = 255;
        let g = Math.round(230 - t * 230);
        let b = 0;
        return `rgb(${r},${g},${b})`;
      }
    }


    const needleSpeedAngle = computed(() => {
      return angleForSpeed(speed.value);
    });
    const arcDashForSpeed = computed(() => {
      return (arcLength * speed.value / maxSpeed.value).toFixed(1);
    });

    const arcDashForRPM = computed(() => {
      const clamped = Math.max(0, Math.min(rpm.value, maxRpm.value));
      return ((arcLengthRPM * clamped / maxRpm.value).toFixed(1));
    });
    const getColorForRPM = (rpmVal) => {
      const max = maxRpm.value;
      let t = Math.max(0, Math.min(rpmVal / max, 1));
      let r = Math.round(0 + t * (183 - 0));
      let g = Math.round(255 - t * (255 - 0));
      let b = Math.round(130 + t * (255 - 130));
      return `rgb(${r},${g},${b})`;
    };

    const needleRpmAngle = computed(() => {
      const clamped = Math.max(0, Math.min(rpm.value, maxRpm.value));
      return minRpmAngle + ((clamped / maxRpm.value) * (maxRpmAngle - minRpmAngle));
    }
    );
    const colorSpeed = computed(() => getColorForSpeed(speed.value));
    const colorRpm = computed(() => getColorForRPM(rpm.value));

    const fuelPoint = () => {
      const fuelLevel = [
        { level: 95, x2: 40 },
        { level: 90, x2: 36 },
        { level: 80, x2: 33 },
        { level: 70, x2: 32 },
        { level: 60, x2: 29 },
        { level: 50, x2: 27 },
        { level: 40, x2: 25 },
        { level: 20, x2: 20 }
      ];

      let x2 = 20;
      for (let i = 0; i < fuelLevel.length; i++) {
        if (fuel.value >= fuelLevel[i].level) {
          x2 = fuelLevel[i].x2;
          break;
        }
      }

      let color = "#ff3535";
      if (fuel.value > 80) color = "#25ffd7";
      else if (fuel.value > 50) color = "#fff200";
      else if (fuel.value > 30) color = "#ff9b00";

      let y = Math.max(0, Math.min(78, 100 - fuel.value));
      return `10,${y} ${x2},${y} 20,80 10,80`;
    }

    const fuelColor = () => {
      if (fuel.value > 80) return "#25ffd7";
      else if (fuel.value > 50) return "#fff200";
      else if (fuel.value > 30) return "#ff9b00";
      return "#ff3535";
    };
    const gearColor = computed(() => {
      const colors = {
        'P': '#00ff82', // Xanh lá
        'R': '#ff3e3e', // Đỏ
        'N': '#3b82f6', // Xanh dương
        'D': '#ffffff', // Trắng
        '1': '#f59e0b', // Vàng
        '2': '#f59e0b',
        '3': '#f59e0b',
        '4': '#f59e0b',
        '5': '#f59e0b'
      };
      return colors[gear.value] || '#ffffff';
    });
    const seabeltColor = computed(() => {
      return isSeabelt.value ? "#00ff00" : "#ff3535"; // Xanh khi đã thắt, đỏ khi chưa thắt
    });
    // Handle messages from server
    const handleMessage = (event) => {
      if (gaugeArcRpm.value) {
        arcLengthRPM.value = gaugeArcRpm.value.getTotalLength();
        console.log('RPM Arc Length:', arcLengthRPM.value);
      }

      // Lấy độ dài path Speed
      if (gaugeArcSpeed.value) {
        arcLengthSpeed.value = gaugeArcSpeed.value.getTotalLength();
        console.log('Speed Arc Length:', arcLengthSpeed.value);
      }
      const data = event.data;
      if (!data || !data.action) return;
      // Vehicle actions
      if (data.action === 'car') {
        inVehicle.value = data.show;       // ẩn/hiện HUD xe
        speed.value = data.speed || 0;
        fuel.value = data.fuel || 0;
        rpm.value = Math.round(data.rpm * 10000, 0) || 0;
        maxRpm.value = data.maxRpm || 10000; // Giả sử maxRpm mặc định là 10000
        gear.value = data.gear;
        vehicleName.value = data.vehicleName;
        isSeabelt.value = data.seatbelt;

      }
      // Money actions
      if (data.action == "showconstant") {
        this.showCash = true;
        this.showBank = true;
        this.cash = data.cash;
        this.bank = data.bank;
      } else if (data.action == "updatemoney") {
        this.showUpdate = true;
        this.amount = data.amount;
        this.bank = data.bank;
        this.cash = data.cash;
        this.minus = data.minus;
        this.plus = data.plus;
        if (data.type === "cash") {
          if (data.minus) {
            this.showCash = true;
            this.minus = true;
            setTimeout(() => (this.showUpdate = false), 1000);
            setTimeout(() => (this.showCash = false), 2000);
          } else {
            this.showCash = true;
            this.plus = true;
            setTimeout(() => (this.showUpdate = false), 1000);
            setTimeout(() => (this.showCash = false), 2000);
          }
        }
        if (data.type === "bank") {
          if (data.minus) {
            this.showBank = true;
            this.minus = true;
            setTimeout(() => (this.showUpdate = false), 1000);
            setTimeout(() => (this.showBank = false), 2000);
          } else {
            this.showBank = true;
            this.plus = true;
            setTimeout(() => (this.showUpdate = false), 1000);
            setTimeout(() => (this.showBank = false), 2000);
          }
        }
      }
      else if (data.action === "show") {
        if (data.type === "cash" && !this.showCash) {
          this.showCash = true;
          this.cash = data.cash;
          setTimeout(() => (this.showCash = false), 3500);
        } else if (data.type === "bank" && !this.showBank) {
          this.showBank = true;
          this.bank = data.bank;
          setTimeout(() => (this.showBank = false), 3500);
        }
      }
      //player hud
      if (data.action === "hudtick") {
        show.value = data.show;
        health.value = data.health;
        armor.value = data.armor;
        hunger.value = data.hunger;
        thirst.value = data.thirst;
        stress.value = data.stress;
        voice.value = data.voice;
        talking.value = data.talking;
        radio.value = data.radio;
        radioActive.value = data.radioActive;
        nos.value = data.nos;
        oxygen.value = Math.round(data.oxygen);
        cruise.value = data.cruise;
        nitroActive.value = data.nitroActive;
        harness.value = data.harness;
        speed.value = data.speed;
        armed.value = data.armed;
        parachute.value = data.parachute;
        hp.value = data.hp * 5;
        engine.value = data.engine;
        cinematic.value = data.cinematic;
        dev.value = data.dev;
        playerDead.value = data.playerDead;

        // Health show logic
        if (data.dynamicHealth) {
          showHealth.value = data.health < 100;
        } else {
          showHealth.value = true;
        }

        // Health color
        healthColor.value = playerDead.value ? "#ff0000" : "#3FA554";

        // Armor show and color
        if (data.dynamicArmor) {
          showArmor.value = data.armor > 0;
        } else {
          showArmor.value = true;
        }
        armorColor.value = armor.value <= 0 ? "#FF0000" : "#326dbf";

        // Hunger show and color
        if (data.dynamicHunger) {
          showHunger.value = data.hunger < 100;
        } else {
          showHunger.value = true;
        }
        hungerColor.value = hunger.value <= 30 ? "#ff0000" : "#dd6e14";

        // Thirst show and color
        if (data.dynamicThirst) {
          showThirst.value = data.thirst < 100;
        } else {
          showThirst.value = true;
        }
        thirstColor.value = thirst.value <= 30 ? "#ff0000" : "#1a7cad";

        // Stress show
        if (data.dynamicStress) {
          showStress.value = data.stress > 0;
        } else {
          showStress.value = true;
        }

        if (data.dynamicOxygen) {
          showOxygen.value = Math.round(data.oxygen) < 100;
        } else {
          showOxygen.value = true;
        }


        // Engine show and color
        if (data.dynamicEngine) {
          showEngine.value = data.engine >= 0 && data.engine < 95;
        } else {
          showEngine.value = data.engine >= 0;
        }
        if (engine.value <= 45) {
          engineColor.value = "#ff0000";
        } else if (engine.value <= 75) {
          engineColor.value = "#dd6e14";
        } else {
          engineColor.value = "#3FA554";
        }

        // Nitro show and color
        if (data.dynamicNitro) {
          showNos.value = nos.value > 0;
        } else {
          showNos.value = nos.value >= 0;
        }
        nosColor.value = nitroActive.value ? "#D64763" : "#FFFFFF";

        // Talking color
        if (radioActive.value) {
          talkingColor.value = "#D64763";
        } else if (talking.value) {
          talkingColor.value = "#FFFF3E";
        } else {
          talkingColor.value = "#FFFFFF";
        }

        // Voice icon logic skipped for brevity (can add as computed)

        // Cruise, Harness, Armed, Parachute, Dev show/hide
        showCruise.value = cruise.value === true;
        showHarness.value = harness.value === true;
        showArmed.value = armed.value === true;
        showParachute.value = parachute.value >= 0;
        showDev.value = dev.value === true;

        // Hide HUD if paused
        if (data.isPaused === 1) {
          show.value = false;
        }
      }

    };



    // Setup and cleanup
    onMounted(() => {

      window.addEventListener('message', handleMessage);

    });
    return {
      // Player stats
      health, armor, hunger, thirst, stress, oxygen, voice, talking, show, playerDead, radio, radioActive,
      nos, nitroActive, cruise, harness, armed, parachute, engine, dev, hp, speed, cinematic,
      talkingColor, nosColor, engineColor,
      showHealth, showArmor, showHunger, showThirst, showStress, showOxygen, showNos, showEngine,
      showCruise, showHarness, showParachute, showDev, showArmed,



      // Vehicle stats
      speed,
      rpm,
      fuel,
      maxSpeed,
      maxRpm,
      inVehicle,
      rpmAngle,
      vehicleName,
      getColorForRPM,
      getColorForSpeed,
      needleRpmAngle,
      needleSpeedAngle,
      arcDashForRPM,
      arcDashForSpeed,
      colorSpeed,
      colorRpm,
      gear,
      gearColor,
      seabeltColor,
      fuelPointStyle: computed(fuelPoint),
      fuelColorStyle: computed(fuelColor),
      // Colors
      healthColor,
      armorColor,
      hungerColor,
      thirstColor,
      stressColor,
      oxygenColor,

      // Icons
      voiceIcon,

      // Circle path
      circlePath,
      // Money
      cash, bank, amount, plus, showCash, showBank
    };

  }
});



// Mount the app
app.mount('#app');

// Close menu with ESC key
document.onkeyup = function (data) {
  if (data.key == "Escape") {
    $.post("https://qb-hud/closeMenu");
  }
};

// Post requests for menu actions
function closeMenu() {
  $.post("https://qb-hud/closeMenu");
}

function restartHud() {
  $.post("https://qb-hud/restartHud");
}

function resetStorage() {
  $.post("https://qb-hud/resetStorage");
}

// Listen for open menu event
window.addEventListener("message", function (event) {
  if (event.data.action === "open") {
    $("#openmenu").fadeIn(150);
  }
});
