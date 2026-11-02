(function () {
  "use strict";

  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // The tracker still works for this visit if browser storage is unavailable.
      }
    }
  };

  const today = new Date();
  const todayString = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  let plants = storage.get("sprig-plants", STARTER_PLANTS);
  let activeFilter = "all";
  let sitterInterest = storage.get("sprig-sitter-interest", false);

  document.title = STARTUP.name + " | Plant care";
  document.getElementById("brand-name").textContent = STARTUP.name;
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;

  const plantGrid = document.getElementById("plant-grid");
  const plantForm = document.getElementById("plant-form");
  const formPanel = document.getElementById("plant-form-panel");
  const emptyMessage = document.getElementById("empty-message");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sitterButton = document.getElementById("sitter-interest");

  function localDate(value) {
    const parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function dayNumber(value) {
    const parts = value.split("-").map(Number);
    return Math.floor(Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000);
  }

  function daysUntilWater(plant) {
    const dueDay = dayNumber(plant.lastWatered) + Number(plant.intervalDays);
    return dueDay - dayNumber(todayString);
  }

  function formatDate(value) {
    return localDate(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function dueLabel(days) {
    if (days < 0) return "Overdue by " + Math.abs(days) + (Math.abs(days) === 1 ? " day" : " days");
    if (days === 0) return "Water today";
    if (days === 1) return "Water tomorrow";
    return "Water in " + days + " days";
  }

  function makePlantCard(plant) {
    const days = daysUntilWater(plant);
    const card = document.createElement("article");
    card.className = "plant-card";
    card.dataset.id = plant.id;

    const header = document.createElement("div");
    header.className = "plant-card-top";
    const marker = document.createElement("span");
    marker.className = "plant-marker";
    marker.setAttribute("aria-hidden", "true");
    const status = document.createElement("span");
    status.className = "status " + (days <= 0 ? "status-due" : "status-okay");
    status.textContent = dueLabel(days);
    header.append(marker, status);

    const name = document.createElement("h2");
    name.textContent = plant.name;
    const species = document.createElement("p");
    species.className = "plant-species";
    species.textContent = plant.species || "Plant";

    const details = document.createElement("p");
    details.className = "plant-details";
    details.textContent = "Every " + plant.intervalDays + " days · Last watered " + formatDate(plant.lastWatered);

    const actions = document.createElement("div");
    actions.className = "plant-actions";
    const waterButton = document.createElement("button");
    waterButton.type = "button";
    waterButton.className = "button button-small";
    waterButton.dataset.action = "water";
    waterButton.textContent = "Watered today";
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "text-button";
    removeButton.dataset.action = "remove";
    removeButton.textContent = "Remove";
    actions.append(waterButton, removeButton);

    card.append(header, name, species, details, actions);
    return card;
  }

  function renderPlants() {
    const dueCount = plants.filter(function (plant) { return daysUntilWater(plant) <= 0; }).length;
    const countLabel = dueCount === 1 ? "1 plant needs water" : dueCount + " plants need water";
    document.getElementById("due-summary").textContent = dueCount === 0 ? "All caught up. Your plants are looking good." : countLabel;
    document.getElementById("plant-count").textContent = plants.length + (plants.length === 1 ? " plant" : " plants");

    const visiblePlants = plants.filter(function (plant) {
      const needsWater = daysUntilWater(plant) <= 0;
      return activeFilter === "all" || (activeFilter === "due" && needsWater) || (activeFilter === "healthy" && !needsWater);
    }).sort(function (first, second) {
      return daysUntilWater(first) - daysUntilWater(second);
    });

    plantGrid.replaceChildren.apply(plantGrid, visiblePlants.map(makePlantCard));
    emptyMessage.hidden = visiblePlants.length > 0;
    if (plants.length === 0) {
      emptyMessage.textContent = "Your plant shelf is empty. Add a plant to get started.";
    } else if (activeFilter === "due") {
      emptyMessage.textContent = "Nothing needs water right now. Nice work.";
    } else if (activeFilter === "healthy") {
      emptyMessage.textContent = "No plants in this view yet.";
    } else {
      emptyMessage.textContent = "No plants yet. Add one to get started.";
    }
    storage.set("sprig-plants", plants);
  }

  function showView() {
    const requested = (window.location.hash || "#plants").slice(1);
    const current = requested === "sitter" ? "sitter" : "plants";
    document.querySelectorAll("[data-view]").forEach(function (view) {
      view.hidden = view.id !== current;
    });
    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    window.scrollTo(0, 0);
  }

  function renderSitterButton() {
    sitterButton.textContent = sitterInterest ? "You're on the interest list" : "Keep me posted";
    sitterButton.setAttribute("aria-pressed", sitterInterest ? "true" : "false");
    document.getElementById("sitter-note").textContent = sitterInterest
      ? "Your interest is saved on this device. No request has been sent."
      : "Prototype only. This does not send a request or book a sitter.";
  }

  document.getElementById("today-label").textContent = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  document.getElementById("watering-date").value = todayString;

  document.getElementById("add-plant").addEventListener("click", function () {
    formPanel.hidden = !formPanel.hidden;
    if (!formPanel.hidden) document.getElementById("plant-name").focus();
  });

  document.getElementById("cancel-add").addEventListener("click", function () {
    plantForm.reset();
    document.getElementById("watering-date").value = todayString;
    formPanel.hidden = true;
  });

  plantForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(plantForm);
    plants.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: String(formData.get("name")).trim(),
      species: String(formData.get("species")).trim(),
      intervalDays: Number(formData.get("interval")),
      lastWatered: String(formData.get("lastWatered"))
    });
    plantForm.reset();
    document.getElementById("watering-date").value = todayString;
    formPanel.hidden = true;
    activeFilter = "all";
    filterButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.filter === "all" ? "true" : "false");
    });
    renderPlants();
  });

  document.getElementById("plant-grid").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const card = button.closest(".plant-card");
    const plant = plants.find(function (item) { return item.id === card.dataset.id; });
    if (!plant) return;

    if (button.dataset.action === "water") {
      plant.lastWatered = todayString;
    } else if (button.dataset.action === "remove") {
      plants = plants.filter(function (item) { return item.id !== plant.id; });
    }
    renderPlants();
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(function (item) {
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      renderPlants();
    });
  });

  sitterButton.addEventListener("click", function () {
    sitterInterest = !sitterInterest;
    storage.set("sprig-sitter-interest", sitterInterest);
    renderSitterButton();
  });

  window.addEventListener("hashchange", showView);
  renderPlants();
  renderSitterButton();
  showView();
})();