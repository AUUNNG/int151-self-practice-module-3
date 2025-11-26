async function fetchReservationPeriods() {
    try {
        const response = await fetch(`${API_URL}/reservation-periods`);
        if (response.ok) {
            const data = await response.json();
            updateReservationStatus(data)
        } else if (response.status === 403) {
            showDialog("Cannot perform this action because the reservation period is currently closed.", false, [{
                text: "OK",
                class: "ecors-button-dialog",
                onClick: () => {
                    dialog.close();
                    window.location.reload();
                }
            }])
        }
    } catch (error) {
        console.error('Error fetching reservation periods:', error);
    }
}

function updateReservationStatus(data) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentStartDate = formatDateTime(data.currentPeriod.startDateTime)
    const currentEndDate = formatDateTime(data.currentPeriod.endDateTime)
    const endStartDate = formatDateTime(data.nextPeriod.startDateTime)
    const endEndDate = formatDateTime(data.nextPeriod.endDateTime)

    // ========== test ==========
    // 1                            [before current, before next]
    // 2 2025-11-25T02:00:00.000Z   [current, before next]
    // 3 2025-11-27T11:00:00.000Z   [current, before next]
    // 4                            [after current, before next]
    // 5 2025-11-28T02:00:00.000Z   [after current, next]
    // 6 2025-12-01T10:00:00.000Z   [after current, next]
    // 5                            [after current, after next]
    // ========== test ==========

    const currentTime = new Date(Date.now())
    // const currentTime = new Date("2025-11-25T01:00:00.000Z")
    const reservationPeriodStart = new Date(data.currentPeriod.startDateTime)
    const reservationPeriodEnd = new Date(data.currentPeriod.endDateTime)
    const nextReservationPeriodStart = new Date(data.nextPeriod.startDateTime)
    const nextReservationPeriodEnd = new Date(data.nextPeriod.endDateTime)
    let status = null

    if (currentTime >= nextReservationPeriodStart) {
        if (currentTime <= nextReservationPeriodEnd) {
            console.log("after current, next");
            status = "afterCurrentNext"

            // currentMessage.textContent = "Reservation is closed"

            // nextMessage.textContent = "Next reseration period:"
            // nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`

            // declareActions.style.display = "grid"
            // declareActions.style.visibility = "visible";
        } else {
            console.log("after current, after next");
            status = "afterCurrentAfterNext"

            // currentMessage.textContent = "Reservation is closed"

            // nextMessage.textContent = "There are no upcoming active reservation periods."

            // declareActions.style.display = "none"
            // declareActions.style.visibility = "hidden";
        }
    } else {
        if (currentTime <= reservationPeriodEnd) {
            if (currentTime >= reservationPeriodStart) {
                console.log("current, before next");
                status = "currentBeforeNext"

                // currentMessage.textContent = "Reservation is open"
                // currentPeriod.textContent = `Period: ${currentStartDate} — ${currentEndDate} (${userTimeZone})`

                // nextMessage.textContent = "Next reseration period:"
                // nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`

                // declareActions.style.display = "grid"
                // declareActions.style.visibility = "visible";
            } else {
                console.log("before current, before next");
                status = "beforeCurrentBeforeNext"

                // currentMessage.textContent = "Reservation is closed"
                // currentPeriod.textContent = `Period: ${currentStartDate} — ${currentEndDate} (${userTimeZone})`

                // nextMessage.textContent = "Next reseration period:"
                // nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`

                // declareActions.style.display = "none"
                // declareActions.style.visibility = "hidden";
            }
        } else {
            console.log("after current, before next");
            status = "afterCurrentBeforeNext"

            // currentMessage.textContent = "Reservation is closed"

            // nextMessage.textContent = "Next reseration period:"
            // nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`

            // declareActions.style.display = "none"
            // declareActions.style.visibility = "hidden";
        }
    }

    switch (status) {
        case "beforeCurrentBeforeNext":
            currentMessage.textContent = "Reservation is closed"
            currentPeriod.textContent = `Period: ${currentStartDate} — ${currentEndDate} (${userTimeZone})`
            nextMessage.textContent = "Next reseration period:"
            nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            declareActions.style.display = "none"
            declareActions.style.visibility = "hidden";
            break;

        case "currentBeforeNext":
            currentMessage.textContent = "Reservation is open"
            currentPeriod.textContent = `Period: ${currentStartDate} — ${currentEndDate} (${userTimeZone})`
            nextMessage.textContent = "Next reseration period:"
            nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            declareActions.style.display = "grid"
            declareActions.style.visibility = "visible";
            break;

        case "afterCurrentBeforeNext":
            currentMessage.textContent = "Reservation is closed"
            nextMessage.textContent = "Next reseration period:"
            nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            declareActions.style.display = "none"
            declareActions.style.visibility = "hidden";
            break;

        case "afterCurrentNext":
            currentMessage.textContent = "Reservation is closed"
            nextMessage.textContent = "Next reseration period:"
            nextPeriod.textContent = `Period: ${endStartDate} — ${endEndDate} (${userTimeZone})`
            declareActions.style.display = "grid"
            declareActions.style.visibility = "visible";
            break;

        case "afterCurrentAfterNext":
            currentMessage.textContent = "Reservation is closed"
            nextMessage.textContent = "There are no upcoming active reservation periods."
            declareActions.style.display = "none"
            declareActions.style.visibility = "hidden";
            break;
    }
}

function formatDateTime(data) {
    const date = new Date(data);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const dateStr = date.toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: userTimeZone
    });
    return dateStr
}