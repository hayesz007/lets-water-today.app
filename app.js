(function () {
  "use strict";

  const bays = BAYSHARE_DATA.bays;
  const zoneFilter = document.getElementById("zone-filter");
  const typeFilter = document.getElementById("type-filter");
  const rateFilter = document.getElementById("rate-filter");
  const densitySlider = document.getElementById("density-slider");
  const bayGrid = document.getElementById("bay-grid");
  const modal = document.getElementById("booking-modal");
  const bookingContent = document.getElementById("booking-content");
  let reservations = [];
  let selectedBay = null;
  let selectedDate = "";
  let selectedTime = "";

  const zones = [...new Set(bays.map(function (bay) { return bay.zone; }))].sort();
  zones.forEach(function (zone) {
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = zone;
    zoneFilter.appendChild(option);
  });

  function density() {
    return Number(densitySlider.value);
  }

  function dateLabel(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return {
      value: [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-"),
      label: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    };
  }

  function filteredBays() {
    const zone = zoneFilter.value;
    const type = typeFilter.value;
    const maxRate = Number(rateFilter.value);
    return bays.filter(function (bay) {
      return (zone === "all" || bay.zone === zone)
        && (type === "all" || bay.type === type)
        && bay.rate <= maxRate;
    });
  }

  function visibleCountFor(resultCount) {
    const ratio = (density() - 2) / 13;
    return Math.max(1, Math.min(resultCount, Math.ceil(resultCount * (0.25 + ratio * 0.75))));
  }

  function getDisplaySlots(bay) {
    const densityBoost = Math.floor((density() - 2) * bay.slots / 13);
    return Math.max(1, bay.slots + densityBoost);
  }

  function render() {
    const matches = filteredBays();
    const visibleCount = visibleCountFor(matches.length);
    const visible = matches.slice(0, visibleCount);

    document.getElementById("density-output").textContent = density() + (density() === 1 ? " bay" : " bays");
    document.getElementById("network-bays").textContent = density();
    const avgDistance = matches.length
      ? 2.2 + 7.4 * ((15 - density()) / 13)
      : 0;
    document.getElementById("network-distance").textContent = matches.length ? avgDistance.toFixed(1) + " mi" : "—";
    const weekendSlots = matches.reduce(function (total, bay) {
      return total + getDisplaySlots(bay);
    }, 0);
    document.getElementById("weekend-slots").textContent = weekendSlots;
    document.getElementById("density-impact").textContent =
      density() <= 5
        ? "A small network: fewer options and longer average trips."
        : density() >= 12
          ? "A dense network: nearby choices and more weekend openings."
          : "More local bays improve choice and reduce average drive time.";

    document.getElementById("result-count").textContent =
      visible.length === 1 ? "1 bay shown" : visible.length + " bays shown";
    bayGrid.replaceChildren.apply(bayGrid, visible.map(makeBayCard));
    document.getElementById("empty-state").hidden = visible.length > 0;
  }

  function makeBayCard(bay) {
    const card = document.createElement("article");
    card.className = "bay-card";
    card.dataset.id = bay.id;

    const visual = document.createElement("div");
    visual.className = "bay-visual";
    const tag = document.createElement("span");
    tag.className = "visual-tag";
    tag.textContent = bay.type;
    visual.appendChild(tag);

    const body = document.createElement("div");
    body.className = "bay-body";
    const titleRow = document.createElement("div");
    titleRow.className = "bay-title-row";
    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = bay.name;
    const zone = document.createElement("p");
    zone.className = "zone-label";
    zone.textContent = bay.zone;
    titleWrap.append(title, zone);
    const rate = document.createElement("p");
    rate.className = "rate";
    rate.innerHTML = "$" + bay.rate + "<span>/hr</span>";
    titleRow.append(titleWrap, rate);

    const meta = document.createElement("div");
    meta.className = "bay-meta";
    bay.features.slice(0, 3).forEach(function (feature) {
      const item = document.createElement("span");
      item.textContent = feature;
      meta.appendChild(item);
    });

    const footer = document.createElement("div");
    footer.className = "bay-footer";
    const distance = document.createElement("span");
    distance.className = "distance";
    distance.textContent = (bay.distance - (density() - 2) * 0.08).toFixed(1) + " mi away";
    const availability = document.createElement("span");
    availability.className = "availability";
    availability.textContent = getDisplaySlots(bay) + " weekend slots";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button select-button";
    button.dataset.action = "book";
    button.textContent = "Select bay";
    footer.append(distance, availability, button);

    body.append(titleRow, meta, footer);
    card.append(visual, body);
    return card;
  }

  function openBooking(bay) {
    selectedBay = bay;
    selectedDate = dateLabel(1).value;
    selectedTime = "";
    renderBooking();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function renderBooking() {
    const dates = [dateLabel(1), dateLabel(2), dateLabel(3), dateLabel(7), dateLabel(8), dateLabel(9)];
    const times = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];
    bookingContent.innerHTML = "";

    const heading = document.createElement("div");
    heading.className = "booking-heading";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Reserve a bay";
    const title = document.createElement("h2");
    title.id = "booking-title";
    title.textContent = selectedBay.name;
    const subtitle = document.createElement("p");
    subtitle.textContent = selectedBay.zone + " · " + selectedBay.type + " · $" + selectedBay.rate + "/hour";
    heading.append(eyebrow, title, subtitle);

    const dateSection = document.createElement("section");
    dateSection.className = "booking-section";
    const dateTitle = document.createElement("h3");
    dateTitle.textContent = "Choose a date";
    const dateOptions = document.createElement("div");
    dateOptions.className = "date-options";
    dates.forEach(function (date) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice" + (date.value === selectedDate ? " selected" : "");
      button.textContent = date.label;
      button.dataset.date = date.value;
      dateOptions.appendChild(button);
    });
    dateSection.append(dateTitle, dateOptions);

    const timeSection = document.createElement("section");
    timeSection.className = "booking-section";
    const timeTitle = document.createElement("h3");
    timeTitle.textContent = "Choose a start time";
    const timeOptions = document.createElement("div");
    timeOptions.className = "time-options";
    times.forEach(function (time, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice" + (time === selectedTime ? " selected" : "");
      button.textContent = time;
      button.dataset.time = time;
      if (index === 5 && density() < 6) button.disabled = true;
      timeOptions.appendChild(button);
    });
    timeSection.append(timeTitle, timeOptions);

    const summary = document.createElement("div");
    summary.className = "booking-summary";
    const dateName = dates.find(function (date) { return date.value === selectedDate; });
    summary.innerHTML =
      "<span>2-hour reservation</span><strong>$" + (selectedBay.rate * 2) + "</strong>"
      + "<span>Estimated date</span><strong>" + (dateName ? dateName.label : "") + "</strong>"
      + "<span>Start time</span><strong>" + (selectedTime || "Not selected") + "</strong>";

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "button confirm-button";
    confirm.textContent = "Confirm reservation";
    confirm.disabled = !selectedTime;
    confirm.style.opacity = selectedTime ? "1" : ".55";

    bookingContent.append(heading, dateSection, timeSection, summary, confirm);
  }

  function closeBooking() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.hidden = true; }, 3500);
  }

  [zoneFilter, typeFilter, rateFilter].forEach(function (filter) {
    filter.addEventListener("change", render);
  });
  densitySlider.addEventListener("input", render);

  document.getElementById("reset-filters").addEventListener("click", function () {
    zoneFilter.value = "all";
    typeFilter.value = "all";
    rateFilter.value = "999";
    densitySlider.value = "8";
    render();
  });

  bayGrid.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action='book']");
    if (!button) return;
    const card = button.closest(".bay-card");
    const bay = bays.find(function (item) { return item.id === card.dataset.id; });
    if (bay) openBooking(bay);
  });

  bookingContent.addEventListener("click", function (event) {
    const dateButton = event.target.closest("button[data-date]");
    if (dateButton) {
      selectedDate = dateButton.dataset.date;
      renderBooking();
      return;
    }
    const timeButton = event.target.closest("button[data-time]");
    if (timeButton) {
      selectedTime = timeButton.dataset.time;
      renderBooking();
      return;
    }
    if (event.target.closest(".confirm-button") && selectedTime) {
      reservations.push({
        bay: selectedBay,
        date: selectedDate,
        time: selectedTime
      });
      document.getElementById("reservation-count").textContent = reservations.length;

      const dateName = dateLabel(0);
      const dateText = Array.from(bookingContent.querySelectorAll("[data-date]"))
        .find(function (button) { return button.dataset.date === selectedDate; });
      bookingContent.innerHTML =
        '<div class="confirmation"><div class="confirmation-mark" aria-hidden="true">✓</div>'
        + '<p class="eyebrow">Reservation confirmed</p>'
        + '<h2 id="booking-title">You’re booked.</h2>'
        + '<p>' + selectedBay.name + '<br>' + (dateText ? dateText.textContent : dateName.label) + ' at ' + selectedTime + '</p>'
        + '<button type="button" class="button" id="done-button">Done</button></div>';
    }
  });

  document.getElementById("done-button");
  bookingContent.addEventListener("click", function (event) {
    if (event.target.id === "done-button") {
      closeBooking();
      showToast("Reservation added to My reservations.");
    }
  });

  document.getElementById("close-modal").addEventListener("click", closeBooking);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeBooking();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeBooking();
  });

  document.getElementById("reservations-button").addEventListener("click", function () {
    if (reservations.length === 0) {
      showToast("No reservations yet. Select a bay to get started.");
    } else {
      const latest = reservations[reservations.length - 1];
      showToast(latest.bay.name + " · " + latest.time + " reservation saved.");
    }
  });

  render();
})();
