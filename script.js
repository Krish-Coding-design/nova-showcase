// Nova — startup showcase mockup
// Portfolio/demo only. No backend, no real data.
//
// Two moving parts:
//   1. A Three.js particle background (subtler + slower than
//      particle-practice/index.html).
//   2. A scroll-driven fade: each section's position in the viewport
//      is mapped to a 0 -> 1 value written into its --enter custom
//      property; all the actual motion lives in styles.css. This is
//      the same "scroll position -> CSS variable" technique as the
//      sanskruti-plumbing wave-wipe.

import * as THREE from "three";

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ============================================================
     1. THREE.JS PARTICLE BACKGROUND
     A single rigid Points cloud that drifts slowly. Wrapped in
     try/catch so a WebGL failure leaves the canvas blank instead
     of breaking the page.
     ============================================================ */
  (function initParticles() {
    var canvas = document.getElementById("bg");
    if (!canvas) return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // transparent — the CSS background shows through
      });
    } catch (err) {
      // No WebGL: nothing to do, the page still works.
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // perf cap

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Fewer particles than the practice sketch (500) — this runs on a
    // low-power laptop and the effect only needs to be a texture.
    var PARTICLE_COUNT = 350;
    var SPREAD = 120;

    var positions = new Float32Array(PARTICLE_COUNT * 3);
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    var material = new THREE.PointsMaterial({
      color: 0x8b5cf6, // violet, matches --accent
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false
    });

    var particles = new THREE.Points(geometry, material);
    scene.add(particles);

    function renderOnce() {
      renderer.render(scene, camera);
    }

    if (reduceMotion) {
      // Static frame only — no animation loop.
      renderOnce();
    } else {
      (function animate() {
        requestAnimationFrame(animate);
        // Subtler + slower than particle-practice (0.0007 / 0.0003).
        particles.rotation.y += 0.0002;
        particles.rotation.x += 0.0001;
        renderer.render(scene, camera);
      })();
    }

    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduceMotion) renderOnce();
    });
  })();

  /* ============================================================
     2. SCROLL-DRIVEN SECTION FADE
     For each [data-section], measure how far its centre is from
     the viewport centre and normalise to p in [0, 1]:
        p = 1  -> section centred (fully visible)
        p = 0  -> section a ~viewport-height away (faded out)
     Write p into --enter; styles.css maps it to opacity + slide.

     Throttled to one update per animation frame with a `ticking`
     flag, listener is passive. Skipped entirely under reduced
     motion — the CSS forces --enter: 1 there.
     ============================================================ */
  (function initScrollFade() {
    if (reduceMotion) return;

    var sections = Array.prototype.slice.call(
      document.querySelectorAll("[data-section]")
    );
    if (!sections.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var viewCentre = window.innerHeight / 2;
      // How far (in px) a section can drift before it's fully faded.
      // 0.9 * viewport height keeps neighbouring sections slightly
      // visible during the snap rather than hard cutting.
      var falloff = window.innerHeight * 0.9;

      for (var i = 0; i < sections.length; i++) {
        var el = sections[i];
        var inner = el.querySelector(".section-inner");
        if (!inner) continue;

        var rect = el.getBoundingClientRect();
        var sectionCentre = rect.top + rect.height / 2;
        var dist = Math.abs(sectionCentre - viewCentre);

        var p = 1 - dist / falloff;
        p = p < 0 ? 0 : p > 1 ? 1 : p; // clamp

        inner.style.setProperty("--enter", p.toFixed(3));
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update(); // set initial state
  })();
})();
