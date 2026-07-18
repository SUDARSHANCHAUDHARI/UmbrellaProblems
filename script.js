(() => {
  "use strict";

  const scene = document.querySelector("#weatherScene");
  const rainLayer = document.querySelector("#rainLayer");
  const tryButton = document.querySelector("#tryButton");
  const resetButton = document.querySelector("#resetButton");
  const soundToggle = document.querySelector("#soundToggle");
  const soundLabel = document.querySelector("#soundLabel");
  const statusLabel = document.querySelector("#statusLabel");
  const statusTitle = document.querySelector("#statusTitle");
  const statusText = document.querySelector("#statusText");
  const attemptFraction = document.querySelector("#attemptFraction");
  const attemptMeter = document.querySelector("#attemptMeter");
  const attemptMarks = [...attemptMeter.querySelectorAll("li")];
  const umbrellaHitArea = document.querySelector("#umbrellaHitArea");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  const TOTAL_ATTEMPTS = 10;
  const TRANSIENT_CLASSES = [
    "umbrella-open",
    "scenario--inverted",
    "scenario--snap",
    "scenario--fly",
    "scenario--bird",
    "scenario--below",
    "scenario--tiny",
    "scenario--water",
    "scenario--bend",
    "scenario--handle",
    "scenario--direction",
    "scene--success",
  ];

  const failures = [
    {
      id: "inverted",
      className: "scenario--inverted",
      title: "Inside out is still technically open.",
      message: "The umbrella catches several litres of rain and no useful ideas.",
      sound: "boing",
      duration: 1450,
    },
    {
      id: "snap",
      className: "scenario--snap",
      title: "A very brief opening statement.",
      message: "It opens, considers the weather, and closes immediately.",
      sound: "snap",
      duration: 1250,
    },
    {
      id: "fly",
      className: "scenario--fly",
      title: "The wind has adopted it.",
      message: "The umbrella is beginning a promising new life somewhere east of here.",
      sound: "wind",
      duration: 1650,
    },
    {
      id: "bird",
      className: "scenario--bird",
      title: "The bird has excellent coverage.",
      message: "A thoughtful feature, if you happen to be the bird.",
      sound: "chirp",
      duration: 1550,
    },
    {
      id: "below",
      className: "scenario--below",
      title: "Dry ankles. Bold strategy.",
      message: "The umbrella opens underneath Milo, protecting the pavement from above.",
      sound: "boing",
      duration: 1450,
    },
    {
      id: "tiny",
      className: "scenario--tiny",
      title: "Pocket-sized disappointment.",
      message: "It could keep one determined raindrop off a very small sandwich.",
      sound: "tiny",
      duration: 1350,
    },
    {
      id: "water",
      className: "scenario--water",
      title: "Rain, now in one convenient serving.",
      message: "The canopy collects the water and pours all of it directly onto Milo.",
      sound: "splash",
      duration: 1750,
    },
    {
      id: "bend",
      className: "scenario--bend",
      title: "The wind votes no.",
      message: "Every spoke bends backward. Milo remains exactly where the rain is.",
      sound: "wind",
      duration: 1500,
    },
    {
      id: "handle",
      className: "scenario--handle",
      title: "The handle has resigned.",
      message: "It escapes without notice, benefits, or the rest of the umbrella.",
      sound: "slide",
      duration: 1500,
    },
    {
      id: "direction",
      className: "scenario--direction",
      title: "The rain has learned to flank.",
      message: "It changes direction just in time to arrive sideways under the canopy.",
      sound: "wind",
      duration: 1550,
    },
  ];

  const state = {
    attempts: 0,
    busy: false,
    raining: true,
    soundEnabled: false,
    reducedMotion: motionPreference.matches,
    failureQueue: [],
    timers: new Set(),
    pointer: null,
    suppressClick: false,
  };

  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  };

  const later = (callback, delay) => {
    const timer = window.setTimeout(() => {
      state.timers.delete(timer);
      callback();
    }, state.reducedMotion ? Math.min(delay, 130) : delay);
    state.timers.add(timer);
    return timer;
  };

  const clearTimers = () => {
    state.timers.forEach((timer) => window.clearTimeout(timer));
    state.timers.clear();
  };

  class WeatherAudio {
    constructor() {
      this.context = null;
      this.master = null;
      this.rainSource = null;
      this.rainGain = null;
      this.enabled = false;
    }

    async enable() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;

      if (!this.context) {
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = 0.72;
        this.master.connect(this.context.destination);
      }

      if (this.context.state === "suspended") await this.context.resume();
      this.enabled = true;
      if (state.raining) this.startRain();
      this.tone(520, 0.08, "sine", 0.04);
      return true;
    }

    disable() {
      this.enabled = false;
      this.stopRain();
    }

    createNoiseBuffer(seconds = 1.5) {
      const frameCount = Math.floor(this.context.sampleRate * seconds);
      const buffer = this.context.createBuffer(1, frameCount, this.context.sampleRate);
      const channel = buffer.getChannelData(0);
      let previous = 0;

      for (let index = 0; index < frameCount; index += 1) {
        const white = Math.random() * 2 - 1;
        previous = previous * 0.78 + white * 0.22;
        channel[index] = previous;
      }
      return buffer;
    }

    startRain() {
      if (!this.enabled || !this.context || this.rainSource || !state.raining) return;

      const source = this.context.createBufferSource();
      const highPass = this.context.createBiquadFilter();
      const lowPass = this.context.createBiquadFilter();
      const gain = this.context.createGain();

      source.buffer = this.createNoiseBuffer();
      source.loop = true;
      highPass.type = "highpass";
      highPass.frequency.value = 700;
      lowPass.type = "lowpass";
      lowPass.frequency.value = 5200;
      gain.gain.value = 0.055;

      source.connect(highPass);
      highPass.connect(lowPass);
      lowPass.connect(gain);
      gain.connect(this.master);
      source.start();

      this.rainSource = source;
      this.rainGain = gain;
    }

    stopRain() {
      if (!this.rainSource || !this.context) return;
      const source = this.rainSource;
      const gain = this.rainGain;
      const now = this.context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      source.stop(now + 0.09);
      this.rainSource = null;
      this.rainGain = null;
    }

    tone(frequency, duration, type = "sine", volume = 0.055, delay = 0) {
      if (!this.enabled || !this.context) return;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const start = this.context.currentTime + delay;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    noise(duration = 0.25, volume = 0.08, frequency = 1300) {
      if (!this.enabled || !this.context) return;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      source.buffer = this.createNoiseBuffer(duration + 0.05);
      filter.type = "bandpass";
      filter.frequency.value = frequency;
      filter.Q.value = 0.75;
      gain.gain.setValueAtTime(volume, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start();
      source.stop(this.context.currentTime + duration + 0.02);
    }

    effect(name) {
      if (!this.enabled) return;
      const effects = {
        boing: () => {
          this.tone(180, 0.28, "triangle", 0.075);
          this.tone(95, 0.34, "sine", 0.05, 0.08);
        },
        snap: () => {
          this.tone(760, 0.08, "square", 0.03);
          this.noise(0.1, 0.07, 2400);
        },
        wind: () => this.noise(0.65, 0.11, 650),
        chirp: () => {
          this.tone(1050, 0.09, "sine", 0.045);
          this.tone(1320, 0.11, "sine", 0.04, 0.1);
        },
        tiny: () => {
          this.tone(900, 0.08, "sine", 0.035);
          this.tone(1350, 0.12, "sine", 0.03, 0.08);
        },
        splash: () => this.noise(0.5, 0.13, 900),
        slide: () => {
          this.tone(350, 0.42, "sawtooth", 0.025);
          this.tone(110, 0.4, "triangle", 0.035, 0.12);
        },
      };
      effects[name]?.();
    }

    success() {
      if (!this.enabled) return;
      [392, 494, 587, 784].forEach((frequency, index) => {
        this.tone(frequency, 0.34, "triangle", 0.04, index * 0.09);
      });
    }
  }

  const weatherAudio = new WeatherAudio();

  const createRain = () => {
    rainLayer.replaceChildren();
    const fragment = document.createDocumentFragment();
    const dropCount = state.reducedMotion ? 12 : 82;

    for (let index = 0; index < dropCount; index += 1) {
      const drop = document.createElement("i");
      drop.className = "raindrop";
      drop.style.setProperty("--x", `${Math.random() * 112 - 6}%`);
      drop.style.setProperty("--length", `${10 + Math.random() * 23}px`);
      drop.style.setProperty("--thickness", `${1 + Math.random() * 1.7}px`);
      drop.style.setProperty("--opacity", `${0.35 + Math.random() * 0.6}`);
      drop.style.setProperty("--speed", `${0.52 + Math.random() * 0.65}s`);
      drop.style.setProperty("--delay", `${Math.random() * -2.2}s`);
      fragment.append(drop);
    }
    rainLayer.append(fragment);
  };

  const createPuddleRipple = () => {
    if (!state.raining || state.reducedMotion || document.hidden) return;
    const ripple = document.createElement("i");
    const onLeft = Math.random() > 0.5;
    ripple.className = "splash-ripple";
    ripple.style.setProperty("--left", `${onLeft ? 6 + Math.random() * 25 : 67 + Math.random() * 25}%`);
    ripple.style.setProperty("--bottom", `${5 + Math.random() * 7}%`);
    scene.append(ripple);
    window.setTimeout(() => ripple.remove(), 850);
  };

  const setStatus = (label, title, message) => {
    statusLabel.textContent = label;
    statusTitle.textContent = title;
    statusText.textContent = message;
  };

  const updateAttempts = () => {
    const paddedAttempts = String(state.attempts).padStart(2, "0");
    attemptFraction.textContent = `${paddedAttempts} / ${TOTAL_ATTEMPTS}`;
    attemptMeter.setAttribute(
      "aria-label",
      state.attempts === 0
        ? "No attempts yet"
        : `${state.attempts} of ${TOTAL_ATTEMPTS} umbrella attempts completed`,
    );

    attemptMarks.forEach((mark, index) => {
      mark.classList.toggle("is-used", index < state.attempts);
      mark.classList.toggle("is-final", index === TOTAL_ATTEMPTS - 1 && state.attempts === TOTAL_ATTEMPTS);
    });
    scene.style.setProperty("--wetness", `${Math.min(0.12 + state.attempts * 0.075, 0.84)}`);
  };

  const resetVisuals = () => {
    scene.classList.remove(...TRANSIENT_CLASSES, "is-dragging");
    rainLayer.classList.remove("is-sideways");
    scene.style.removeProperty("--drag-x");
    scene.style.removeProperty("--drag-y");
  };

  const prepareFailure = (failure) => {
    scene.classList.add(failure.className);
    rainLayer.classList.toggle("is-sideways", failure.id === "direction");

    if (failure.id === "snap") {
      scene.classList.add("umbrella-open");
      later(() => scene.classList.remove("umbrella-open"), 360);
      return;
    }
    scene.classList.add("umbrella-open");
  };

  const stopRainThenSucceed = () => {
    resetVisuals();
    state.raining = false;
    rainLayer.classList.add("is-stopped");
    weatherAudio.stopRain();
    setStatus(
      "Attempt 10 of 10 · rain stopped",
      "Wait. The rain has stopped.",
      "For the first time all day, the umbrella appears ready to cooperate.",
    );

    later(() => {
      scene.classList.add("umbrella-open", "scene--success");
      scene.classList.remove("is-busy");
      scene.setAttribute("aria-label", "The rain has stopped and Milo's umbrella is open correctly.");
      state.busy = false;
      tryButton.disabled = true;
      tryButton.querySelector("span:first-child").textContent = "It finally worked";
      setStatus(
        "Attempt 10 of 10 · success",
        "Perfect. The rain stopped first.",
        "The umbrella is open, Milo is soaked, and there is no weather left to protect him from.",
      );
      weatherAudio.success();
    }, 260);
  };

  const finishFailure = () => {
    if (state.attempts === TOTAL_ATTEMPTS) {
      stopRainThenSucceed();
      return;
    }

    state.busy = false;
    scene.classList.remove("is-busy");
    tryButton.disabled = false;
    tryButton.querySelector("span:first-child").textContent = "Try again";
  };

  const runAttempt = () => {
    if (state.busy || !state.raining || state.attempts >= TOTAL_ATTEMPTS) return;

    resetVisuals();
    state.busy = true;
    state.attempts += 1;
    const failure = state.failureQueue[state.attempts - 1];

    scene.classList.add("is-busy");
    tryButton.disabled = true;
    tryButton.querySelector("span:first-child").textContent = "Umbrella thinking…";
    updateAttempts();
    setStatus(
      `Attempt ${state.attempts} of ${TOTAL_ATTEMPTS} · ${failure.id}`,
      failure.title,
      failure.message,
    );
    prepareFailure(failure);
    weatherAudio.effect(failure.sound);
    later(finishFailure, failure.duration);
  };

  const resetExperience = () => {
    clearTimers();
    resetVisuals();
    scene.querySelectorAll(".splash-ripple").forEach((ripple) => ripple.remove());
    state.attempts = 0;
    state.busy = false;
    state.raining = true;
    state.failureQueue = shuffle(failures);
    state.pointer = null;
    state.suppressClick = false;
    rainLayer.classList.remove("is-stopped", "is-sideways");
    scene.classList.remove("is-busy");
    scene.setAttribute("aria-label", "Rainy scene. Try to open Milo's closed umbrella.");
    tryButton.disabled = false;
    tryButton.querySelector("span:first-child").textContent = "Try the umbrella";
    setStatus(
      "Attempt 0 of 10",
      "The umbrella is pretending not to know you.",
      "Open it if you can. Click, tap, drag, or use the button.",
    );
    updateAttempts();
    if (state.soundEnabled) weatherAudio.startRain();
  };

  const releasePointer = (event, shouldAttempt) => {
    if (!state.pointer || state.pointer.id !== event.pointerId) return;
    const wasDragging = state.pointer.dragging;
    state.pointer = null;
    scene.classList.remove("is-dragging");
    scene.style.removeProperty("--drag-x");
    scene.style.removeProperty("--drag-y");

    if (scene.hasPointerCapture?.(event.pointerId)) scene.releasePointerCapture(event.pointerId);
    if (shouldAttempt && wasDragging) {
      state.suppressClick = true;
      runAttempt();
    }
  };

  scene.addEventListener("click", () => {
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    runAttempt();
  });

  scene.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    runAttempt();
  });

  umbrellaHitArea.addEventListener("pointerdown", (event) => {
    if (state.busy || !state.raining) return;
    state.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dragging: false,
    };
    scene.setPointerCapture?.(event.pointerId);
  });

  scene.addEventListener("pointermove", (event) => {
    if (!state.pointer || state.pointer.id !== event.pointerId) return;
    const deltaX = event.clientX - state.pointer.x;
    const deltaY = event.clientY - state.pointer.y;
    if (Math.hypot(deltaX, deltaY) < 8 && !state.pointer.dragging) return;
    state.pointer.dragging = true;
    scene.classList.add("is-dragging");
    scene.style.setProperty("--drag-x", `${deltaX}px`);
    scene.style.setProperty("--drag-y", `${deltaY}px`);
  });

  scene.addEventListener("pointerup", (event) => releasePointer(event, true));
  scene.addEventListener("pointercancel", (event) => releasePointer(event, false));

  tryButton.addEventListener("click", runAttempt);
  resetButton.addEventListener("click", resetExperience);

  soundToggle.addEventListener("click", async () => {
    if (state.soundEnabled) {
      weatherAudio.disable();
      state.soundEnabled = false;
      soundToggle.setAttribute("aria-pressed", "false");
      soundLabel.textContent = "Sound off";
      return;
    }

    const available = await weatherAudio.enable();
    if (!available) {
      soundToggle.disabled = true;
      soundLabel.textContent = "Sound unavailable";
      return;
    }

    state.soundEnabled = true;
    soundToggle.setAttribute("aria-pressed", "true");
    soundLabel.textContent = "Sound on";
  });

  motionPreference.addEventListener?.("change", (event) => {
    state.reducedMotion = event.matches;
    createRain();
  });

  window.setInterval(createPuddleRipple, 680);
  createRain();
  resetExperience();
})();
