function updateReservationStatus(data) {    // display reservation-periods and set var cumulativeCreditLimit
    let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    let currentStartDate = null
    let currentEndDate = null
    let reservationPeriodStart = null
    let reservationPeriodEnd = null
    let endStartDate = null
    let endEndDate = null
    let nextReservationPeriodStart = null
    let nextReservationPeriodEnd = null

    if (data.currentPeriod) {
        currentStartDate = formatDateTime(data.currentPeriod.startDateTime)
        currentEndDate = formatDateTime(data.currentPeriod.endDateTime)
        reservationPeriodStart = new Date(data.currentPeriod.startDateTime).getTime()
        reservationPeriodEnd = new Date(data.currentPeriod.endDateTime).getTime()
    }
    if (data.nextPeriod) {
        endStartDate = formatDateTime(data.nextPeriod.startDateTime)
        endEndDate = formatDateTime(data.nextPeriod.endDateTime)
        nextReservationPeriodStart = new Date(data.nextPeriod.startDateTime).getTime()
        nextReservationPeriodEnd = new Date(data.nextPeriod.endDateTime).getTime()
    }

    // ========== test ==========
    // 1                            [before current, before next]
    // 2 2025-11-25T02:00:00.000Z   [current, before next]
    // 3 2025-11-27T11:00:00.000Z   [current, before next]
    // 4                            [after current, before next]
    // 5 2025-11-28T02:00:00.000Z   [after current, next]
    // 6 2025-12-01T10:00:00.000Z   [after current, next]
    // 5                            [after current, after next]
    // ========== test ==========

    const currentTime = new Date(Date.now()).getTime()
    // const currentTime = new Date("2025-11-27T11:00:00.000Z").getTime()

    let status = null

    if (currentTime >= nextReservationPeriodStart && nextReservationPeriodStart != null) {
        if (currentTime <= nextReservationPeriodEnd && nextReservationPeriodEnd != null) {
            console.log("after current, next");
            status = "afterCurrentNext"
        } else {
            console.log("after current, after next");
            status = "afterCurrentAfterNext"
        }
    } else {
        if (currentTime <= reservationPeriodEnd && reservationPeriodEnd != null) {
            if (currentTime >= reservationPeriodStart && reservationPeriodStart != null) {
                console.log("current, before next");
                status = "currentBeforeNext"
            } else {
                console.log("before current, before next");
                status = "beforeCurrentBeforeNext"
            }
        } else {
            console.log("after current, before next");
            status = "afterCurrentBeforeNext"
        }
    }

    switch (status) {
        case "beforeCurrentBeforeNext":
            is_active = false
            currentMessage.textContent = "Reservation is closed"
            currentPeriod.textContent = `Period: ${currentStartDate} — ${currentEndDate} (${userTimeZone})`
            if (data.nextPeriod !== null) {
                nextMessage.textContent = "Next reseration period:"
                nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            } else {
                nextMessage.textContent = "There are no upcoming active reservation periods."
            }
            declareActions.style.display = "none"
            declareActions.style.visibility = "hidden";
            break;

        case "currentBeforeNext":
            is_active = true
            cumulativeCreditLimit = data.currentPeriod.cumulativeCreditLimit
            currentMessage.textContent = "Reservation is open"
            currentPeriod.textContent = `Period: ${currentStartDate} — ${currentEndDate} (${userTimeZone})`
            if (data.nextPeriod !== null) {
                nextMessage.textContent = "Next reseration period:"
                nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            } else {
                nextMessage.textContent = "There are no upcoming active reservation periods."
            }
            declareActions.style.display = "grid"
            declareActions.style.visibility = "visible";
            break;

        case "afterCurrentBeforeNext":
            currentMessage.textContent = "Reservation is closed"
            if (data.nextPeriod !== null) {
                nextMessage.textContent = "Next reseration period:"
                nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            } else {
                nextMessage.textContent = "There are no upcoming active reservation periods."
            }
            declareActions.style.display = "none"
            declareActions.style.visibility = "hidden";
            break;

        case "afterCurrentNext":
            is_active = true
            cumulativeCreditLimit = data.nextPeriod.cumulativeCreditLimit
            currentMessage.textContent = "Reservation is closed"
            if (data.nextPeriod !== null) {
                nextMessage.textContent = "Next reseration period:"
                nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            } else {
                nextMessage.textContent = "There are no upcoming active reservation periods."
            }
            declareActions.style.display = "grid"
            declareActions.style.visibility = "visible";
            break;

        case "afterCurrentAfterNext":
            is_active = false
            currentMessage.textContent = "Reservation is closed"
            nextMessage.textContent = "There are no upcoming active reservation periods."
            declareActions.style.display = "none"
            declareActions.style.visibility = "hidden";
            break;
    }
    console.log("cumulativeCreditLimit: ", cumulativeCreditLimit);
}
