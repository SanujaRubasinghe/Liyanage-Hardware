export const checkConsent = () => {
    const consentCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('cookie_consent='))
    const hasCookieConsent = consentCookie ? consentCookie.split('=')[1] === 'true' : false

    return hasCookieConsent
}