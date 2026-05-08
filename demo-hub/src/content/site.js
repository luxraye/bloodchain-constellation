/**
 * Site copy and mailto helpers. Optional: VITE_CONTACT_EMAIL in deploy env overrides email only.
 */
export const SITE = {
  contactEmail:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL?.trim()) ||
    'giftjrnakedi@gmail.com',

  contactName: 'Gift Jr Nakedi',

  /** Display format */
  contactPhoneDisplay: '(267) 721 610 38',

  /** Use with <a href={`tel:${SITE.contactPhoneTel}`}> */
  contactPhoneTel: '+26772161038',

  projectTitle: 'Bloodchain',
  projectSubtitle: 'National blood supply chain management platform',

  organization: 'Bloodchain Botswana',
  incubationLine: 'Incubated by Unipod at the University of Botswana',

  prototypeNote:
    'This is a live demonstration environment. Interfaces, data flows, and integrations represent the platform as built—pending formal clinical certification and regulatory sign-off before production deployment.',

  /** Set to your public Git URL to show a footer link; leave empty to hide. */
  repoUrl: '',
}

export function mailtoLink(subject, body) {
  const q = new URLSearchParams()
  if (subject) q.set('subject', subject)
  if (body) q.set('body', body)
  const qs = q.toString()
  return `mailto:${SITE.contactEmail}${qs ? `?${qs}` : ''}`
}

function sig() {
  return `\n\n— ${SITE.contactName}`
}

export function mailtoGeneral() {
  return mailtoLink(
    'Bloodchain — General inquiry',
    `Hello Bloodchain Botswana,\n\nI would like to learn more about the Bloodchain project.${sig()}`,
  )
}

export function mailtoCollaboration() {
  return mailtoLink(
    'Bloodchain — Collaboration / partnership',
    `Hello Bloodchain Botswana,\n\nWe would like to explore collaboration or partnership with Bloodchain (e.g. research, pilot, integration).\n\nOrganization:\nRole:${sig()}`,
  )
}

export function mailtoMediaDemo() {
  return mailtoLink(
    'Bloodchain — Media / demo request',
    `Hello Bloodchain Botswana,\n\nI am requesting a demo or interview about Bloodchain.\n\nOutlet / affiliation:\nPreferred dates:${sig()}`,
  )
}
