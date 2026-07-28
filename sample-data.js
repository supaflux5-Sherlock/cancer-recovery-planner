(function () {
  "use strict";

  const STORAGE_PREFIX = "crp:";

  function save(key, value) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  function loadSampleData() {
    // ---------- Profile ----------
    save("profileName", "Jamie Sullivan");
    save("profile-cause", "Breast");
    save("profileDiagnosisDate", daysAgo(210));
    save("profileSurgeryDate", daysAgo(180));
    save("profileTracheostomyDate", daysAgo(170));
    save("profile-communication", "In active treatment");
    save("profileEnt", "Dr. Nakamura, (555) 201-4477");
    save("profileSlp", "Dr. Reyes, PCP, (555) 201-9982");
    save(
      "profileNotes",
      "No known drug allergies. Prefers morning appointments. Port placed on left side."
    );

    // ---------- Daily Tracker ----------
    const feels = ["Rough", "Tired", "Tired", "Okay", "Okay", "Good", "Okay", "Good", "Strong", "Good", "Strong", "Good", "Strong", "Strong"];
    const dailyEntries = feels.map((feel, i) => ({
      date: daysAgo(13 - i),
      checks: {
        "daily-diaphragmatic": i % 4 === 0,
        "daily-restperiod": i % 3 === 0,
        "daily-pacing": i % 5 === 0,
        "daily-humming": i % 2 === 0,
        "daily-therapy": i % 2 === 1,
      },
      feel,
      notes: i === 13 ? "First day in a while without nausea." : "",
    }));
    save("dailyEntries", dailyEntries);

    // ---------- Wellbeing ----------
    const moods = ["Struggling", "Low", "Low", "Okay", "Okay", "Good", "Okay", "Good", "Good", "Strong", "Good", "Strong", "Good", "Strong"];
    const wellbeingEntries = moods.map((mood, i) => ({
      date: daysAgo(13 - i),
      mood,
      weighing: {
        "wellbeing-weighing-isolation": i < 3,
        "wellbeing-weighing-grief": i < 2,
        "wellbeing-weighing-anxiety": i === 4 || i === 5,
        "wellbeing-weighing-communication": i < 4,
        "wellbeing-weighing-recurrence": i === 6,
        "wellbeing-weighing-bodyimage": i < 5,
        "wellbeing-weighing-financial": i < 2,
        "wellbeing-weighing-sleep": i < 3,
        "wellbeing-weighing-relationship": false,
        "wellbeing-weighing-other": false,
      },
      helped: {
        "wellbeing-helped-talked": i >= 4,
        "wellbeing-helped-group": i === 10,
        "wellbeing-helped-therapy": i === 3 || i === 10,
        "wellbeing-helped-meditation": i >= 6,
        "wellbeing-helped-activity": i >= 8,
        "wellbeing-helped-creative": i === 12,
        "wellbeing-helped-rest": i < 4,
        "wellbeing-helped-outdoors": i >= 9,
        "wellbeing-helped-other": false,
      },
      goodThing: i >= 8 ? "Went for a short walk and it didn't wipe me out." : "",
      notes: "",
    }));
    save("wellbeingEntries", wellbeingEntries);

    // ---------- Medications ----------
    save("medicationRows", [
      { medication: "Ondansetron", dose: "8mg", time: "As needed", taken: true, notes: "For nausea" },
      { medication: "Tamoxifen", dose: "20mg", time: "8:00 AM", taken: true, notes: "" },
      { medication: "Tamoxifen", dose: "20mg", time: "8:00 AM", taken: true, notes: "" },
      { medication: "Dexamethasone", dose: "4mg", time: "Before infusion", taken: true, notes: "Pre-treatment" },
      { medication: "Multivitamin", dose: "1 tablet", time: "With lunch", taken: true, notes: "" },
      { medication: "Multivitamin", dose: "1 tablet", time: "With lunch", taken: false, notes: "" },
    ]);

    // ---------- Appointments ----------
    save("appointmentRows", [
      { date: daysAgo(30), provider: "Dr. Nakamura — Oncology", reason: "Cycle 3 chemo infusion", followup: "3 weeks" },
      { date: daysAgo(14), provider: "Dr. Reyes — PCP", reason: "General check-in", followup: "As needed" },
      { date: daysAgo(3), provider: "Dr. Nakamura — Oncology", reason: "Labs before next cycle", followup: "Before each cycle" },
      { date: daysAgo(-7), provider: "Radiation Oncology", reason: "Planning consult", followup: "" },
    ]);

    // ---------- Bloodwork ----------
    save("bloodworkRows", [
      { date: daysAgo(30), test: "Hemoglobin", result: "11.2 g/dL", range: "12.0–15.5 g/dL", notes: "Slightly low, monitoring" },
      { date: daysAgo(30), test: "WBC", result: "3.8 K/uL", range: "4.5–11.0 K/uL", notes: "Low, expected during chemo" },
      { date: daysAgo(30), test: "Platelets", result: "180 K/uL", range: "150–400 K/uL", notes: "Normal" },
      { date: daysAgo(90), test: "Hemoglobin", result: "13.1 g/dL", range: "12.0–15.5 g/dL", notes: "Normal, before treatment started" },
    ]);

    // ---------- Symptom Journal ----------
    save("journalEntries", [
      { date: daysAgo(25), noticed: "Mild nausea the day after infusion", severity: "Mild", helped: "Anti-nausea meds, ginger tea" },
      { date: daysAgo(18), noticed: "Fatigue lasted longer than usual this cycle", severity: "Moderate", helped: "Extra rest, shorter days" },
      { date: daysAgo(12), noticed: "Mouth sores starting", severity: "Moderate", helped: "Salt water rinses, softer foods" },
      { date: daysAgo(6), noticed: "Low-grade fever, 99.8°F", severity: "Concerning", helped: "Called oncology nurse line, monitored" },
      { date: daysAgo(1), noticed: "Feeling like myself today", severity: "Mild", helped: "" },
    ]);

    // ---------- Milestones ----------
    save("milestones", {
      m0: { done: true, date: daysAgo(170) },
      m1: { done: true, date: daysAgo(150) },
      m2: { done: true, date: daysAgo(90) },
      m3: { done: false, date: "" },
      m4: { done: false, date: "" },
      m5: { done: true, date: daysAgo(45) },
      m6: { done: false, date: "" },
      m7: { done: false, date: "" },
      m8: { done: false, date: "" },
      m9: { done: false, date: "" },
    });

    // ---------- Caregiver Log ----------
    save("caregiverEntries", [
      {
        date: daysAgo(20),
        method: "Rides to appointments",
        worked: "Having the same person drive to every infusion built a routine we could count on.",
        hard: "Coordinating work schedules around chemo days is still hard.",
        tryNext: "Put all cycle dates on the shared family calendar as soon as they're confirmed.",
      },
      {
        date: daysAgo(7),
        method: "Meal prep",
        worked: "Freezer meals for the days right after infusion were a lifesaver.",
        hard: "Ran out of easy options by the second week.",
        tryNext: "Double the batch next time, freeze half.",
      },
    ]);

    // ---------- Dietary ----------
    save("dietaryEntries", [
      { date: daysAgo(5), checks: { "dietary-mouth": true, "dietary-tube": false, "dietary-iv": false }, notes: "Bland foods, low appetite but ate three small meals." },
      { date: daysAgo(3), checks: { "dietary-mouth": true, "dietary-tube": false, "dietary-iv": false }, notes: "" },
      { date: daysAgo(1), checks: { "dietary-mouth": true, "dietary-tube": true, "dietary-iv": false }, notes: "Used a nutrition shake between meals — appetite better today." },
    ]);

    // ---------- Treatment Schedule ----------
    save("deviceCleanedToday:" + daysAgo(0), true);
    save("deviceWeek", { Mon: true, Tue: true, Wed: false, Thu: true, Fri: false, Sat: false, Sun: false });
    save("deviceLastResupply", daysAgo(9));
    save("deviceNextResupply", daysAgo(-12));
    save("deviceLastMembrane", daysAgo(30));
    save("deviceNextMembrane", daysAgo(-60));
    save("deviceLastUnit", daysAgo(9));
    save("deviceNextUnit", daysAgo(-12));
    save("deviceNotes", "Tolerating this cycle better than the last one.");
    save("devicetype-laryngectomy", true);
    save("devicetype-tep", false);

    // ---------- Insurance & Records ----------
    save("insuranceRows", [
      { date: daysAgo(28), provider: "Regional Cancer Center", item: "Cycle 2 infusion", amount: "$45 copay", notes: "Paid at visit" },
      { date: daysAgo(14), provider: "City Radiology", item: "CT scan", amount: "$1,200 billed", notes: "Waiting on insurance EOB" },
      { date: daysAgo(3), provider: "Specialty Pharmacy", item: "Anti-nausea prescription", amount: "$20 copay", notes: "" },
    ]);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("sample-data-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (
        !confirm(
          "This will replace all current data on this device with sample demo data. Continue?"
        )
      )
        return;
      loadSampleData();
      location.reload();
    });
  });
})();
