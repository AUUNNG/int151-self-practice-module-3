function updateDeclarationStatus(data) {
    const date = new Date(data.updatedAt || data.createdAt);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateStr = date.toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    const lowercase = data.status.toLowerCase()
    const capitalizedString = `${lowercase[0].toUpperCase()}${lowercase.slice(1)}`;

    declaredPlanSpan.textContent = `${capitalizedString} ${plan.planCode} - ${plan.nameEng} plan on ${dateStr} (${userTimeZone})`;
}
