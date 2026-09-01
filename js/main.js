(function () {
    "use strict";

    /* ---- Custom cursor ---- */
    let cursor = document.getElementById("cursor");
    let cursorSmall = document.getElementById("cursor-small");
    let hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (hasFinePointer && cursor && cursorSmall) {
        window.addEventListener("mousemove", function (e) {
            let x = e.clientX + "px";
            let y = e.clientY + "px";
            cursor.style.transform = "translate3d(" + x + ", " + y + ", 0) translate(-50%, -50%)";
            cursorSmall.style.transform = "translate3d(" + x + ", " + y + ", 0) translate(-50%, -50%)";
        });
    }

    /* ---- Nav toggle ---- */
    let navToggle = document.getElementById("nav-toggle");
    let navCollapse = document.getElementById("nav-collapse");

    if (navToggle && navCollapse) {
        navToggle.addEventListener("click", function () {
            let isOpen = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isOpen));
            navCollapse.classList.toggle("is-open", !isOpen);
        });
    }

    /* ---- Side panel scroll spacer ---- */
    let sidePanel = document.querySelector(".side-panel");
    let sidePanelInner = document.querySelector(".side-panel-inner");
    let sidePanelSpacer = document.getElementById("side-panel-spacer");

    function sizeSidePanelSpacer() {
        if (!sidePanel || !sidePanelInner || !sidePanelSpacer) return;

        let paragraphs = sidePanelInner.querySelectorAll("p");
        if (!paragraphs.length) return;

        let lastParagraph = paragraphs[paragraphs.length - 1];
        let panelStyle = window.getComputedStyle(sidePanel);
        let gap = parseFloat(window.getComputedStyle(sidePanelInner).rowGap) || 0;
        let paddingBottom = parseFloat(panelStyle.paddingBottom) || 0;

        let available = sidePanel.clientHeight - lastParagraph.offsetHeight - gap - paddingBottom;
        sidePanelSpacer.style.height = Math.max(available, 0) + "px";
    }

    sizeSidePanelSpacer();
    window.addEventListener("load", sizeSidePanelSpacer);
    window.addEventListener("resize", sizeSidePanelSpacer);

    /* ---- Intro sequence ---- */
    let barFill = document.getElementById("intro-bar-fill");

    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
            if (barFill) barFill.style.width = "100%";
        });
    });

    window.setTimeout(function () {
        document.body.classList.add("is-loaded");
    }, 1400);

    /* ---- Filmstrip / hero title cycle ---- */
    let items = Array.prototype.slice.call(document.querySelectorAll(".filmstrip-item"));
    let playhead = document.getElementById("filmstrip-playhead");
    let titleEl = document.getElementById("hero-title");

    let activeIndex = 0;

    function setActive(nextIndex) {
        if (nextIndex === activeIndex || !items[nextIndex]) return;
        activeIndex = nextIndex;

        items.forEach(function (item, i) {
            item.classList.toggle("is-active", i === activeIndex);
        });

        if (playhead) {
            let pct = (activeIndex / items.length) * 100;
            playhead.style.left = pct + "%";
        }

        if (titleEl) {
            titleEl.classList.add("is-swapping");
            window.setTimeout(function () {
                titleEl.textContent = items[activeIndex].dataset.title;
                titleEl.classList.remove("is-swapping");
            }, 200);
        }
    }

    items.forEach(function (item) {
        item.addEventListener("click", function () {
            setActive(Number(item.dataset.index));
        });
    });

    /* ---- Writings rolodex ---- */
    let rolodex = document.getElementById("rolodex");
    let rolodexCards = Array.prototype.slice.call(document.querySelectorAll(".rolodex-card"));
    let postOverlay = document.getElementById("post-overlay");
    let postPanelScroll = document.getElementById("post-panel-scroll");
    let postClose = document.getElementById("post-close");

    function openPost(card) {
        let template = card.querySelector("template");
        if (!template || !postPanelScroll || !postOverlay || !rolodex) return;

        postPanelScroll.innerHTML = "";
        postPanelScroll.appendChild(template.content.cloneNode(true));
        postPanelScroll.scrollTop = 0;

        rolodex.classList.add("is-hidden");
        postOverlay.classList.add("is-open");
        postOverlay.setAttribute("aria-hidden", "false");
    }

    function closePost() {
        if (!postOverlay || !rolodex) return;
        postOverlay.classList.remove("is-open");
        postOverlay.setAttribute("aria-hidden", "true");
        rolodex.classList.remove("is-hidden");
    }

    rolodexCards.forEach(function (card) {
        card.addEventListener("click", function () {
            openPost(card);
        });
    });

    if (postClose) {
        postClose.addEventListener("click", closePost);
    }

    if (postOverlay) {
        postOverlay.addEventListener("click", function (e) {
            if (e.target === postOverlay) closePost();
        });
    }

    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && postOverlay && postOverlay.classList.contains("is-open")) {
            closePost();
        }
    });
})();
