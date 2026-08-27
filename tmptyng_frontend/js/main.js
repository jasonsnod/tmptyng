(function () {
    "use strict";

    /* ---- Custom cursor ---- */
    var cursor = document.getElementById("cursor");
    var cursorSmall = document.getElementById("cursor-small");
    var hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (hasFinePointer && cursor && cursorSmall) {
        window.addEventListener("mousemove", function (e) {
            var x = e.clientX + "px";
            var y = e.clientY + "px";
            cursor.style.transform = "translate3d(" + x + ", " + y + ", 0) translate(-50%, -50%)";
            cursorSmall.style.transform = "translate3d(" + x + ", " + y + ", 0) translate(-50%, -50%)";
        });
    }

    /* ---- Intro sequence ---- */
    var barFill = document.getElementById("intro-bar-fill");

    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
            if (barFill) barFill.style.width = "100%";
        });
    });

    window.setTimeout(function () {
        document.body.classList.add("is-loaded");
    }, 1400);

    /* ---- Filmstrip / hero title cycle ---- */
    var items = Array.prototype.slice.call(document.querySelectorAll(".filmstrip-item"));
    var playhead = document.getElementById("filmstrip-playhead");
    var titleEl = document.getElementById("hero-title");
    var indexEl = document.getElementById("hero-index-current");

    var activeIndex = 0;
    var cycleTimer = null;
    var CYCLE_MS = 4500;

    function setActive(nextIndex) {
        if (nextIndex === activeIndex || !items[nextIndex]) return;
        activeIndex = nextIndex;

        items.forEach(function (item, i) {
            item.classList.toggle("is-active", i === activeIndex);
        });

        if (playhead) {
            var pct = (activeIndex / items.length) * 100;
            playhead.style.left = pct + "%";
        }

        if (indexEl) {
            indexEl.textContent = String(activeIndex + 1).padStart(2, "0");
        }

        if (titleEl) {
            titleEl.classList.add("is-swapping");
            window.setTimeout(function () {
                titleEl.textContent = items[activeIndex].dataset.title;
                titleEl.classList.remove("is-swapping");
            }, 200);
        }
    }

    function startCycle() {
        stopCycle();
        cycleTimer = window.setInterval(function () {
            setActive((activeIndex + 1) % items.length);
        }, CYCLE_MS);
    }

    function stopCycle() {
        if (cycleTimer) {
            window.clearInterval(cycleTimer);
            cycleTimer = null;
        }
    }

    items.forEach(function (item) {
        item.addEventListener("click", function () {
            setActive(Number(item.dataset.index));
            startCycle();
        });
    });

    if (items.length) {
        startCycle();
    }
})();
