const generatedFullNames = new Set();
const generatedPhoneNumbers = new Set();

function handleGenerateUniqueFullName() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";

    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let firstName = "";
    let lastName = "";

    do {
        const firstNameLength = random(3, 12);
        const lastNameLength = random(6, 12);

        firstName = uppercase[Math.floor(Math.random() * uppercase.length)];
        lastName = uppercase[Math.floor(Math.random() * uppercase.length)];

        for (let i = 1; i < firstNameLength; i++) firstName += lowercase[Math.floor(Math.random() * lowercase.length)];
        for (let i = 1; i < lastNameLength; i++) lastName += lowercase[Math.floor(Math.random() * lowercase.length)];
    } while (generatedFullNames.has(`${firstName} ${lastName}`));

    const fullName = `${firstName} ${lastName}`;
    generatedFullNames.add(fullName);

    return fullName;
}

function handleGenerateEmailAddressFromFullName(fullName) {
    return `${fullName.replaceAll(" ", "").toLowerCase()}@cas.com`;
}

function handleGenerateUniquePhoneNumber() {
    const helpers = "0123456789";
    let phoneNumber = "";

    do {
        let number = "";

        number += String(Math.floor(Math.random() * 4) + 6);

        for (let i = 1; i < 10; i++) number += helpers[Math.floor(Math.random() * helpers.length)];

        phoneNumber = `+91${number}`;
    } while (generatedPhoneNumbers.has(phoneNumber));

    generatedPhoneNumbers.add(phoneNumber);

    return phoneNumber;
}

function handleGetRandomRole() {
    return Math.random() < 0.5 ? "individual" : "enterprise";
}

export {
    handleGenerateUniqueFullName,
    handleGenerateEmailAddressFromFullName,
    handleGenerateUniquePhoneNumber,
    handleGetRandomRole,
};
